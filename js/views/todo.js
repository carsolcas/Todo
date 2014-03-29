/*global define*/
define([
    'jqueryui',
    'underscore',
    'backbone',
    'text!templates/todo-item.html',
    'common/common',
    'common/todo_state'
], function ($, _, Backbone, todoTemplate, Common, TSTATE) {
    'use strict';

    var TodoView = Backbone.View.extend({

        tagName:  'li',

        template: _.template(todoTemplate),

        interval: null,

        events: {
            'click .task-close': 'deleteTask',
            'click .task-play': 'startTask',
            'click .task-stop': 'stopTask',
            'dblclick .task-header': 'editTitle',
            'keypress .edit-title': 'updateTitleOnEnter',
            'blur .edit-title': 'closeTitle',
            'dblclick .task-des': 'editDescription',
            'keypress .edit-des': 'updateDescriptionOnEnter',
            'blur .edit-des': 'closeDescription'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            var data = this.model.toJSON();
            data.formatedTime = this.formatTime(this.model.get('time'));
            this.$el.html(this.template(data));
            this.$input_title = this.$('.edit-title');
            this.$input_description = this.$('.edit-des');
            this.$task_header = this.$('.task-header');
            this.$task_description = this.$('.task-des');

            this.$('.task-item').draggable({
                    revert: 'invalid'
                }).data("backbone-todo", this);

            return this;
        },

        formatTime:function(taskTime){
                var seconds = taskTime % 60,
                    minutes = Math.floor(taskTime / 60),
                    hour = (minutes < 60) ? 0 : Math.floor(minutes / 60),
                    time = [Common.lpad(hour, 2), Common.lpad(minutes, 2), Common.lpad(seconds, 2)];

                return time.join(':');
        },

        deleteTask: function(){
            this.model.destroy();
            this.remove(); // Delete view
        },

        startTask: function(){
            this.model.save({ current_job: true });
            this.interval = setInterval(this.tick, 1000, this);
        },

        tick:function(view){
            console.log('tick tack');
            view.model.add_time();
        },

        stopTask: function(){
            this.model.save({ current_job: false });
            clearInterval(this.interval);
            this.interval = null;
        },

        closeTitle: function() {
            var value = this.$input_title.val().trim();
            if ( value ) {
                this.model.save({ title: value });
            }
            this.$task_header.removeClass('editing');
        },

        editTitle: function() {
            this.$task_header.addClass('editing');
            this.$input_title.focus();
        },

        updateTitleOnEnter: function( e ) {
            if ( e.which === 13 ) {
                this.closeTitle();
            }
        },

        closeDescription: function() {
            var value = this.$input_description.val().trim();
            if ( value ) {
                this.model.save({ description: value });
            }
            this.$task_description.removeClass('editing');
        },

        editDescription: function() {
            this.$task_description.addClass('editing');
            this.$input_description.focus();
        },

        updateDescriptionOnEnter: function( e ) {
            if ( e.which === 13 ) {
                this.closeDescription();
            }
        }
    });

    return TodoView;
});

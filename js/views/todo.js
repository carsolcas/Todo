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
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            var data = this.model.toJSON(),
                that = this;
            data.formatedTime = this.formatTime(this.model.get('time'));
            this.$el.html(this.template(data));
            this.$input_title = this.$('.edit-title');
            this.$input_description = this.$('.edit-des');
            this.$task_header = this.$('.task-header');
            this.$task_description = this.$('.task-des');

            this.$('.task-item').draggable({
                    revert: 'invalid'
                })
                .data("backbone-todo", this)
                //When start drag stop render task listener
                .on( "dragstart", function( event, ui ) {
                    that.stopAutoRefresh();
                 })
                 //When end drag start again render task listener
                 .on( "dragstop", function( event, ui ) {
                     that.startAutoRefresh();
                 });

            return this;
        },

        stopAutoRefresh: function (){
            this.stopListening(this.model, 'change');
        },

        startAutoRefresh: function (){
            this.listenTo(this.model, 'change', this.render);
        },

        formatTime:function(taskTime){
                var hour = Math.floor(taskTime / 3600),
                    minutes = Math.floor(taskTime % 3600 / 60),
                    seconds = taskTime % 60,
                    time = [Common.lpad(hour, 2), Common.lpad(minutes, 2), Common.lpad(seconds, 2)];

                return time.join(':');
        },

        deleteTask: function(){
            this.model.destroy();
            this.remove(); // Delete view
        },

        startTask: function(){
            this.model.start();
        },

        stopTask: function(){
            this.model.stop();
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

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

        events: {
            'click .task-close': 'deleteTask'
        },

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            var data = this.model.toJSON();
            data.formatedTime = this.formatTime(this.model.get('time'));
            this.$el.html(this.template(data));
            this.$input = this.$('.edit-header');

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
            // Delete view
            this.remove();
        }
    });

    return TodoView;
});

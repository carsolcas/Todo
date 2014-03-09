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
            this.$el.html(this.template(this.model.toJSON()));
            this.$input = this.$('.edit-header');
            this.$('.task-item').draggable({
                    revert: 'invalid'
                }).data("backbone-todo", this);

            return this;
        },

        deleteTask: function(){
            this.model.destroy();
            // Delete view
            this.remove();
        }
    });

    return TodoView;
});

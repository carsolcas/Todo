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
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$input = this.$('.edit-header');
            var id = '#' + this.model.id;
            this.$(id).draggable({
                    revert: 'invalid',
                    snap: ".task-list",
                    connectToSortable: ".task-list"
            });
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

/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/todos',
    'views/todos',
    'text!templates/stats.html',
    'common'
], function ($, _, Backbone, Todos, TodoView, statsTemplate, Common) {
    'use strict';

    var ListView = Backbone.View.extend({
        initialize: function () {
            Todos.setLocalStoragePrefix(this.prefix);
            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);

            Todos.fetch();
        },

        render: function () {
        },

        // Add a single todo item to the list by creating a view for it, and
        // appending its element to the `<ul>`.
        addOne: function (todo) {
            var view = new TodoView({ model: todo });
            $('#todo-list').append(view.render().el);
        },

        // Add all items in the **Todos** collection at once.
        addAll: function () {
            this.$('#todo-list').html('');
            Todos.each(this.addOne, this);
        }
    });

    return ListView;
});

/*global define*/
define([
    'underscore',
    'backbone',
    'backboneLocalstorage',
    'models/todo'
], function (_, Backbone, Store, Todo) {
    'use strict';

    var TodosCollection = Backbone.Collection.extend({
        model: Todo,
        localStorage: new Store('ja-todos'),

        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        comparator: function (todo) {
            return todo.get('order');
        }
    });

    return new TodosCollection();
});

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
        localStorage: new Backbone.LocalStorage('todos'),


        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        filterByState: function(state) {
            return this.filter(function( todo ) {
                return todo.get('state') === state;
            });
        },

        activeTodo: function() {
            return this.filter(function( todo ) {
                return todo.get('current_job');
            });
        },

        comparator: function (todo) {
            return todo.get('order');
        }
    });

    return TodosCollection;
});

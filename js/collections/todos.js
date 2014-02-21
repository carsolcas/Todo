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

        nextOrder: function () {
            if (!this.length) {
                return 1;
            }
            return this.last().get('order') + 1;
        },

        setLocalStoragePrefix: function(prefix){
            this.localStorage = new Store(prefix);
        },

        comparator: function (todo) {
            return todo.get('order');
        }
    });

    return new TodosCollection();
});

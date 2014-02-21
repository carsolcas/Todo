/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/todos',
    'views/todo',
    'common/common'
], function ($, _, Backbone, Todos, TodoView, Common) {
    'use strict';

    var appView = Backbone.View.extend({
        el: '#todoapp',

        events: {
        'keypress #new-title': 'titlepress'
        },

        initialize: function () {
        },

        titlepress: function(){
            console.log('Key Pressed');
        },

        render: function () {
        }
    });

    return appView;
});

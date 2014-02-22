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
        'keypress #new-title': 'titlePressKey',
        'keypress #new-description': 'descriptionPressKey',
        'click #btn-add': 'addTask'
        },

        initialize: function () {
            this.$title = this.$('#new-title');
            this.$desc = this.$('#new-description');
            this.$btn_add = this.$('#btn-add');
            this.$btn_clear = this.$('#btn-clear');
        },

        addTask: function(){
            console.log(this.$title.val());
            console.log(this.$desc.val());
        },

        titlePressKey: function(event){
            if (event.which === Common.ENTER_KEY ) {
                this.$desc.focus();
            }
        },

        descriptionPressKey: function(event){
            if (event.which === Common.ENTER_KEY ) {
                this.addTask();
            }
        },


        render: function () {
        }
    });

    return appView;
});

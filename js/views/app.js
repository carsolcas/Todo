/*global define*/
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/todos',
    'views/todo',
    'common/common',
    'text!templates/status.html'
], function ($, _, Backbone, Todos, TodoView, Common, summaryTemplate) {
    'use strict';

    var appView = Backbone.View.extend({
        el: '#todoapp',
        summaryTemplate: _.template(summaryTemplate),

        events: {
        'keypress #new-title': 'titlePressKey',
        'keypress #new-description': 'descriptionPressKey',
        'click #btn-add': 'addTask'
        },

        initialize: function () {
            console.log('initialize');
            this.$title = this.$('#new-title');
            this.$desc = this.$('#new-description');
            this.$btn_add = this.$('#btn-add');
            this.$btn_clear = this.$('#btn-clear');
            this.$summary_data = this.$('#summary-data');
            this.render();
        },

        addTask: function(){
            console.log(this.$title.val());
            console.log(this.$desc.val());
        },

        titlePressKey: function(event){
            if (event.which === Common.ENTER_KEY ) {
                this.$desc.focus();
                event.preventDefault();
            }
        },

        descriptionPressKey: function(event){
            if (event.which === Common.ENTER_KEY ) {
                this.addTask();
            }
        },

        lpad: function(num, width, char) {
            char = char || '0';
            num = num + '';
            return num.length >= width ? num : new Array(width - num.length + 1).join(char) + num;
        },

        render: function () {
            var d = new Date();
            var date = this.lpad(d.getDate(), 2)+'/'+this.lpad(d.getMonth()+1, 2)+'/'+d.getFullYear();
            this.$summary_data.html(this.summaryTemplate({
                date: date,
                time: 0,
                num_completed: 0,
                num_pending: 0
            }));
        }
    });

    return appView;
});

/*global define*/
define([
    'jqueryui',
    'underscore',
    'backbone',
    'collections/todos',
    'views/todo',
    'common/common',
    'common/todo_state',
    'text!templates/status.html'
], function ($, _, Backbone, TodoList, TodoView, Common, TSTATE, summaryTemplate) {
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
            this.$collections = [this.$('#pending'),this.$('#inProgress'),this.$('#completed')];

            var pending_list = new TodoList().setLocalStoragePrefix('pen'),
                inprogress_list = new TodoList().setLocalStoragePrefix('inp'),
                completed_list = new TodoList().setLocalStoragePrefix('com');
            this.collections = [pending_list, inprogress_list, completed_list];

            _.forEach(this.$collections, function($col_container, state){
                $col_container.data('state', state);
                $col_container.attr('id', state);
            });

            _.forEach(this.collections, function(collection, state){
                this.listenTo(collection, 'add', this.addOneEvent);
                this.listenTo(collection, 'remove', this.removeOneEvent);
            }, this);


            var that = this;
            this.$('.droppable').droppable({
                drop: function (event, ui) {
                        var todo = $(ui.draggable).data("backbone-todo"),
                            state = $(this).find('.task-list').data('state');
                        if (state === todo.get('state') ) return;

                        todo.set('state', state);
                        that.collections[state].create(todo.attributes, {wait: true});

                        that.collections[todo.get('state')].remove(todo);
                        todo.destroy();
                        that.render();
                }
            });

            this.$('.task-list').sortable({revert: true});

            _.forEach(this.collections, function(collection, state){
                collection.fetch();
            });

            this.render();
        },

        getTaskData: function(){
            return {
                title: this.$title.val().trim(),
                description: this.$desc.val().trim()
            }
        },

        addOneEvent: function( todo ) {
            var view = new TodoView({ model: todo }),
                state = todo.get('state');
            this.$collections[state].append( view.render().el );
        },

        removeOneEvent: function( todo ){
            this.render();
        },

        addTask: function(){
            var data = this.getTaskData();
            this.collections[TSTATE.PENDING].create(data, {wait: true});
            this.$title.val('');
            this.$desc.val('');
            this.render();
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
                num_completed: this.collections[TSTATE.COMPLETED].length,
                num_pending: this.collections[TSTATE.PENDING].length
            }));
        }
    });

    return appView;
});

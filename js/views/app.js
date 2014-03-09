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

            this.todoCollection = new TodoList();
            this.listenTo(this.todoCollection, 'add', this.addOneEvent);
            this.listenTo(this.todoCollection, 'remove', this.removeOneEvent);

            _.forEach(this.$collections, function($col_container, state){
                $col_container.data('state', state);
            });


            var that = this;
            this.$('.droppable').droppable({
                drop: function (event, ui) {
                    var todoView = $(ui.draggable).data("backbone-todo"),
                        todo = todoView.model,
                        new_state = $(this).find('.task-list').data('state');

                    if (new_state === todo.get('state') ) return;

                    todo.set('state', new_state);
                    todo.save();
                    todoView.remove();
                    that.todoCollection.remove(todo);
                    that.todoCollection.add(todo);
                    that.render();
                }
            });

            this.$('.task-list').sortable({revert: true});

            this.todoCollection.fetch();
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
            this.todoCollection.create(data, {wait: true});
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
                num_completed: this.todoCollection.filterByState(TSTATE.COMPLETED).length,
                num_pending: this.todoCollection.filterByState(TSTATE.PENDING).length
            }));
        }
    });

    return appView;
});

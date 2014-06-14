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
            this.$title = this.$('#new-title');
            this.$desc = this.$('#new-description');
            this.$btn_add = this.$('#btn-add');
            this.$btn_clear = this.$('#btn-clear');
            this.$summary_data = this.$('#summary-data');
            this.$collections = [this.$('#pending'),this.$('#inProgress'),this.$('#completed')];

            this.todoCollection = new TodoList();
            this.listenTo(this.todoCollection, 'add', this.addOneEvent);
            this.listenTo(this.todoCollection, 'remove', this.removeOneEvent);
            // Custom Events
            this.listenTo(this.todoCollection, 'task.add.processing', this.onAddProcessing);
            this.listenTo(this.todoCollection, 'task.del.processing', this.onDelProcessing);
            this.listenTo(this.todoCollection, 'task.started', this.onTaskStarted);

            _.forEach(this.$collections, function($col_container, state){
                $col_container.data('state', state);
            });


            var that = this;
            this.$('.droppable').droppable({
                drop: function (event, ui) {
                    var todoView = ui.draggable.data("backbone-todo"),
                        todo = todoView.model,
                        new_state = $(this).find('.task-list').data('state'),
                        old_state = todo.get('state');

                    //if is the same set view to original location and exit
                    if (new_state === old_state ){
                        ui.draggable.css('left', 0).css('top', 0);
                        return;
                    }

                    todo.set('state', new_state);
                    todo.save();
                    if (new_state === TSTATE.PROCESSING)
                        todo.trigger('task.add.processing', todo);
                    else if (old_state === TSTATE.PROCESSING)
                        todo.trigger('task.del.processing', todo);

                    that.showView(todoView);
                }
            });

            this.todoCollection.fetch();
            this.render();
        },

        getTaskData: function(){
            return {
                title: this.$title.val().trim(),
                description: this.$desc.val().trim()
            }
        },

        onAddProcessing:function(todo){
            todo.start();
        },

        onDelProcessing:function(todo){
            todo.stop();
        },

        onTaskStarted:function(todo){
            var activeTodo = this.todoCollection.activeTodo();
            activeTodo.forEach(function(todo) {
                todo.stop();
            });

        },

        showView: function (view){
            view.startAutoRefresh();
            var state = view.model.get('state');
            this.$collections[state].append( view.render().el );
        },

        addOneEvent: function( todo ) {
            var view = new TodoView({ model: todo });
            this.showView(view);
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

        render: function () {
            var d = new Date();
            var date = Common.lpad(d.getDate(), 2) + '/' +
                       Common.lpad(d.getMonth() + 1, 2) + '/' +
                       d.getFullYear();

            this.$summary_data.html(this.summaryTemplate({
                date: date,
                time: 0,
                num_completed: this.todoCollection.filterByState(TSTATE.COMPLETED).length,
                num_processing: this.todoCollection.filterByState(TSTATE.PROCESSING).length,
                num_pending: this.todoCollection.filterByState(TSTATE.PENDING).length
            }));
        }
    });

    return appView;
});

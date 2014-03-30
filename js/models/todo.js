/*global define*/
define([
    'underscore',
    'backbone',
    'common/todo_state',
    'common/common'
], function (_, Backbone, state, Common) {
    'use strict';

    var Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            create_date: Date(),
            state: state.PENDING,
            time: 0,
            current_job: false
        },

        add_time : function(seconds){
            var s = seconds || 1;
            this.save({
                time: +this.get('time') + s
            });
        },

        addSecond: function(todo){
            todo.add_time();
        },

        start: function(){
            this.save({current_job: true});
            this.interval = setInterval(this.addSecond, 1000, this);
        },

        stop: function(){
            this.save({current_job: false});
            clearInterval(this.interval);
            this.interval = null;
        }
    });

    return Todo;
});

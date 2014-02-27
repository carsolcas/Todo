/*global define*/
define([
    'underscore',
    'backbone',
    'common/todo_state'
], function (_, Backbone, state) {
    'use strict';

    var Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            create_date: Date(),
            state: state.PENDING,
            time: 0,
            current_job: false,
            formatTime:function(){
                return '00:00';
            }
        },

        add_time : function(seconds){
            s = seconds || 1;
            this.save({
                time: +this.get('time') + s
            });
        }
    });

    return Todo;
});

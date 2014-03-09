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
            s = seconds || 1;
            this.save({
                time: +this.get('time') + s
            });
        }
    });

    return Todo;
});

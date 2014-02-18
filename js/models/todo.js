/*global define*/
define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            description: '',
            create_date: Date(),
            state: 'pending',
            completed: false,
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

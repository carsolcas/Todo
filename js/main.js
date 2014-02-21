'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        jqueryui: {
            deps: ['jquery'],
            exports: '$'
        },
        backboneLocalstorage: {
            deps: ['backbone'],
            exports: 'Store'
        }
    },
    paths: {
        jquery: '../vendors/jquery',
        jqueryui: '../vendors/jquery.ui',
        underscore: '../vendors/underscore',
        backbone: '../vendors/backbone',
        backboneLocalstorage: '../vendors/backbone.localStorage',
        text: '../vendors/text'
    }
});

require([
    'jqueryui',
    'backbone',
    'views/app'
], function ($, Backbone, AppView) {
    Backbone.history.start();
    $( "#datepicker" ).datepicker();
    $( "#datepicker" ).datepicker("option", "dateFormat", "dd/mm/yy");
    new AppView();
});

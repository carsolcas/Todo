/*global define*/
'use strict';

define([], function () {
    return {
        ENTER_KEY: 13,

        lpad: function(num, width, char) {
            char = char || '0';
            num = num + '';
            return num.length >= width ? num : new Array(width - num.length + 1).join(char) + num;
        }
    };
});

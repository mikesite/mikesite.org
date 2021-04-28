"use strict";
/**
 * This is a self-executing instruction that has to be included in order to handle expandable elements.
 */
document.addEventListener('DOMContentLoaded', function () {
    var instructions = document.getElementsByClassName('expandable');
    var _loop_1 = function (i) {
        if (instructions[i] instanceof HTMLElement) {
            var instruction_1 = instructions[i];
            var header = document.getElementById(instruction_1.id + '-header');
            if (header) {
                instruction_1.style.display = 'none';
                header.addEventListener('click', function () { return instruction_1.style.display = instruction_1.style.display ? '' : 'none'; });
            }
        }
    };
    for (var i = 0; i < instructions.length; i++) {
        _loop_1(i);
    }
});

/**
 * Defines functionality around event-handling or the preparation thereof.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Executes or registers the given handler for a point of time when the document is fully loaded and constructed.
     * This check is necessary because RequireJS delays the execution of the main script.
     * So a simple DOMContentLoaded listener is added too late most of the time.
     * In case RequireJS is fast enough this will nonetheless prevent the handler from being executed to early.
     * @param {() => void} fun The handler to register or execute.
     */
    function whenReady(fun) {
        if (/interactive|complete|loaded/.test(document.readyState)) {
            fun();
        }
        else {
            document.addEventListener('DOMContentLoaded', fun);
        }
    }
    exports.whenReady = whenReady;
    /**
     * Turns a button into a file saving operator. Clicking this button will ask the user how to handle a file with the given content.
     * The given button is essentially cloned and replaced.
     * @param {HTMLButtonElement} button The button that should trigger the file handling.
     * @param {string} content The file's content.
     * @param {string} fileName The file's name.
     */
    function saveOnClick(button, content, fileName) {
        if (fileName === void 0) { fileName = 'file'; }
        // remove all event handler first
        var clone = button.cloneNode(true);
        // replace given button with clone
        // if given button isn't added to the document this will not crash but the call will not change anything, so in a way it will fail quietly
        if (button.parentNode)
            button.parentNode.replaceChild(clone, button);
        // instruct content saving
        clone.addEventListener('click', function () {
            var a = document.createElement('A');
            a.style.display = 'none';
            a.download = fileName;
            a.href = content;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
        clone.disabled = false;
    }
    exports.saveOnClick = saveOnClick;
});

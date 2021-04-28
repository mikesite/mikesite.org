/**
 * Defines functionality to apply to string-based objects.
 * These helper functions will typically return string predicates.
 * This way you can either directly apply the predicate to a singular string or use it to operate on collections.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Checks whether a text starts with another text.
     * @param {string} query The text that every accepted string must start with.
     * @returns {boolean} A predicate for strings checking their start.
     */
    function startsWith(query) {
        return function (t) { return t.indexOf(query) === 0; };
    }
    exports.startsWith = startsWith;
    /**
     * Checks whether a text includes another text.
     * @param {string} query The text that every accepted string must contain.
     * @returns {boolean} A predicate for strings checking their content.
     */
    function includes(query) {
        return function (t) { return t.indexOf(query) >= 0; };
    }
    exports.includes = includes;
});

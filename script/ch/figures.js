define(["require", "exports", "../helper/map"], function (require, exports, map_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Contains information describing available figures/costumes.
     */
    /**
     * Lists all playable races.
     * @type {ReadonlyArray<string>}
     */
    exports.RACES = Object.freeze(["Dwarf", "Human", "Elf"]);
    /**
     * Lists all playable classes.
     * @type {ReadonlyArray<string>}
     */
    exports.CLASSES = Object.freeze(["Warrior", "Wizard", "Priest"]);
    /**
     * Lists all playable genders.
     * @type {ReadonlyArray<string>}
     */
    exports.GENDERS = Object.freeze(["F", "M"]);
    /**
     * Lists all color variants.
     * @type {ReadonlyArray<string>}
     */
    exports.COLORS = Object.freeze(["A", "B", "C"]);
    /**
     * Constructs all possible figures based on the given sets of alternative values for the three components.
     * @param {ReadonlyArray<string>} races The races to consider.
     * @param {ReadonlyArray<string>} classes The classes to consider.
     * @param {ReadonlyArray<string>} gender The genders to consider.
     * @returns {[string , string , string][]} All possible figures from the given parts.
     */
    function figureBases(races, classes, gender) {
        if (races === void 0) { races = exports.RACES; }
        if (classes === void 0) { classes = exports.CLASSES; }
        if (gender === void 0) { gender = exports.GENDERS; }
        return map_1.flatMap(races, function (r) { return map_1.flatMap(classes, function (c) { return gender.map(function (g) { return [r, c, g]; }); }); });
    }
    exports.figureBases = figureBases;
});

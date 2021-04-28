define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Contains archetype specific information.
     */
    /**
     * Describes the minimum number of copies needed from an item to completely equip any team fully with it.
     * @returns {(item: CsvItem) => number} A mapping from an item to it's count of copies.
     */
    function getTeamMaxUsableItemCount() {
        var teamMax = {
            "Arcane Item": 12,
            "Arcane Skill": 3,
            "Boots": 3,
            "Divine Armor": 3,
            "Divine Item": 9,
            "Divine Skill": 3,
            "Divine Weapon": 6,
            "Dwarf Skill": 3,
            "Elf Skill": 3,
            "Heavy Armor": 3,
            "Helmet": 3,
            "Human Skill": 3,
            "Martial Skill": 3,
            "Robes": 3,
            "Shield": 3,
            "Staff": 6,
            "Weapon": 9
        };
        return function (item) { return teamMax[item.get('Slot')] || 1; };
    }
    exports.getTeamMaxUsableItemCount = getTeamMaxUsableItemCount;
});

define(["require", "exports", "../helper/csv", "../helper/functional"], function (require, exports, csv_1, functional_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Helper functions regarding equipment.
     */
    /**
     * All special items that should be excluded from completeness checks because they are no more collectible.
     * @type {ReadonlyArray<string>}
     */
    var specialItems = Object.freeze([
        /* Tutorial Only Equipment */
        "The Goldleaf Blade",
        /* Release Treasure */
        "Demon Skull Snuffbox"
    ]);
    /**
     * All seasonal reprinted items.
     * @type {ReadonlyArray<string>}
     */
    var seasonalItems = Object.freeze([
        /* Halloween Equipment */
        "Devil Trident", "Skeleton Suit", "Fang Shield", "Hell Cauldron", "The Deadonomicon",
        "Vankenstein's Staff", "Blazing Skull", "Trickster Wand", "Wicked Broom", "Haunted Stick",
        "Witchy Robes", "Black Cat Buckler", "Pumpkin Bomb", "Werewolf Boots", "Sugar Rage",
        /* Halloween Treasure */
        "Kobold Kandy", "Ghost Pop", "Pixie Cake", "Candy Nauticorn", "Candied Gland",
        /* Holiday Equipment */
        "Stocking Boots", "Holy Knight Armor", "Lump of Coal", "Very Bad Gift", "Killer Kane",
        "Paper Crown", "Party Leader Hat", "Party Dress", "Jolly Robe", "Festive Robe",
        "Antler Shield", "Wreath of Steel", "Humbug Staff", "Carver", "Eggnog Flask",
        /* Holiday Treasure */
        "Frosted Cookie", "Reindeer Steak", "Treerunt", "Turkoise", "Gifting Bag"
    ]);
    /**
     * A predicate for special items.
     */
    exports.specialItemFilter = function (item) { return specialItems.indexOf(item.get('Equipment Name')) > -1; };
    /**
     * A predicate for seasonal reprinted items.
     */
    exports.seasonalItemFilter = function (item) { return seasonalItems.indexOf(item.get('Equipment Name')) > -1; };
    /**
     * A predicate for default items per slot.
     */
    exports.slotDefaultFilter = function (item) { return item.get('Slot Default') !== ''; };
    /**
     * A predicate to detect items that cannot drop (currently).
     */
    exports.noLootFilter = function (item) { return /noLoot/.test(item.get('Tags')); };
    /**
     * A sorting policy for strings representing rarities.
     */
    exports.rarityNameSort = function (r1, r2) {
        var rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
        return rarities.indexOf(r1) - rarities.indexOf(r2);
    };
    /**
     * A sorting policy for items based on their rarity.
     */
    exports.raritySort = functional_1.fieldSort(csv_1.getter('Rarity'), exports.rarityNameSort);
    /**
     * Constructs an qualified name for items to be displayed.
     * @param {CsvItem} item The item to construct a name for.
     * @returns {string} The item's qualified name.
     */
    function getQualifiedName(item) {
        return item.get('Equipment Name') + ' (' + item.get('Rarity')[0] + item.get('Level') + ')';
    }
    exports.getQualifiedName = getQualifiedName;
    /**
     * Returns the value of some item.
     * @param {CsvItem} item The item to price.
     * @returns {number} The item's value.
     */
    function getValue(item) {
        var equipmentValue = {
            Common: 1,
            Uncommon: 2,
            Rare: 5,
            Epic: 20,
            Legendary: 100
        };
        var treasureValue = {
            Common: 2,
            Uncommon: 10,
            Rare: 40,
            Epic: 200,
            Legendary: 1000
        };
        return ((item.get('Slot') === 'Treasure') ? treasureValue : equipmentValue)[item.get('Rarity')] || 1;
    }
    exports.getValue = getValue;
    /**
     * Returns the cost of some item.
     * @param {CsvItem} item item The item to price.
     * @param {Boolean} rebuy Whether the item is a rebuy from a shop or a regular buy.
     * @returns {number} The item's cost.
     */
    function getCost(item, rebuy) {
        if (rebuy === void 0) { rebuy = false; }
        var equipmentCost = {
            Common: 5,
            Uncommon: 25,
            Rare: 100,
            Epic: 500,
            Legendary: 2500
        };
        var rebuyCost = {
            Common: 1,
            Uncommon: 2,
            Rare: 5,
            Epic: 20,
            Legendary: 100
        };
        var treasureCost = {
            Common: 2,
            Uncommon: 10,
            Rare: 40,
            Epic: 200,
            Legendary: 1000
        };
        return ((item.get('Slot') === 'Treasure') ? treasureCost : (rebuy ? rebuyCost : equipmentCost))[item.get('Rarity')] || 1;
    }
    exports.getCost = getCost;
});

import {CsvItem, getter, Index} from "../helper/csv";
import {fieldSort}              from "../helper/functional";

/**
 * Helper functions regarding equipment.
 */

/**
 * All special items that should be excluded from completeness checks because they are no more collectible.
 * @type {ReadonlyArray<string>}
 */
const specialItems: ReadonlyArray<string> = Object.freeze([
    /* Tutorial Only Equipment */
    "The Goldleaf Blade",
    /* Release Treasure */
    "Demon Skull Snuffbox"
]);

/**
 * All seasonal reprinted items.
 * @type {ReadonlyArray<string>}
 */
const seasonalItems: ReadonlyArray<string> = Object.freeze([
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
export const specialItemFilter: (i: CsvItem) => boolean =
    (item: CsvItem) => specialItems.indexOf(item.get('Equipment Name')) > -1;

/**
 * A predicate for seasonal reprinted items.
 */
export const seasonalItemFilter: (i: CsvItem) => boolean =
    (item: CsvItem) => seasonalItems.indexOf(item.get('Equipment Name')) > -1;

/**
 * A predicate for default items per slot.
 */
export const slotDefaultFilter: (i: CsvItem) => boolean =
    (item: CsvItem) => item.get('Slot Default') !== '';

/**
 * A predicate to detect items that cannot drop (currently).
 */
export const noLootFilter: (i: CsvItem) => boolean =
    (item: CsvItem) => /noLoot/.test(item.get('Tags'));

/**
 * A sorting policy for strings representing rarities.
 */
export const rarityNameSort: (r1: string, r2: string) => number =
    (r1: string, r2: string) => {
    const rarities: string[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
    return rarities.indexOf(r1) - rarities.indexOf(r2);
};

/**
 * A sorting policy for items based on their rarity.
 */
export const raritySort: (i1: CsvItem, i2: CsvItem) => number =
    fieldSort(getter('Rarity'), rarityNameSort);

/**
 * Constructs an qualified name for items to be displayed.
 * @param {CsvItem} item The item to construct a name for.
 * @returns {string} The item's qualified name.
 */
export function getQualifiedName(item: CsvItem): string {
    return item.get('Equipment Name') + ' (' + item.get('Rarity')[0] + item.get('Level') + ')';
}

/**
 * Returns the value of some item.
 * @param {CsvItem} item The item to price.
 * @returns {number} The item's value.
 */
export function getValue(item: CsvItem): number {
    let equipmentValue: Index<number> = {
        Common: 1,
        Uncommon: 2,
        Rare: 5,
        Epic: 20,
        Legendary: 100};
    let treasureValue: Index<number> = {
        Common: 2,
        Uncommon: 10,
        Rare: 40,
        Epic: 200,
        Legendary: 1000};
    return ((item.get('Slot') === 'Treasure') ? treasureValue : equipmentValue)[item.get('Rarity')] || 1;
}

/**
 * Returns the cost of some item.
 * @param {CsvItem} item item The item to price.
 * @param {Boolean} rebuy Whether the item is a rebuy from a shop or a regular buy.
 * @returns {number} The item's cost.
 */
export function getCost(item: CsvItem, rebuy: Boolean = false): number {
    let equipmentCost: Index<number> = {
        Common: 5,
        Uncommon: 25,
        Rare: 100,
        Epic: 500,
        Legendary: 2500};
    let rebuyCost: Index<number> = {
        Common: 1,
        Uncommon: 2,
        Rare: 5,
        Epic: 20,
        Legendary: 100};
    let treasureCost: Index<number> = {
        Common: 2,
        Uncommon: 10,
        Rare: 40,
        Epic: 200,
        Legendary: 1000};
    return ((item.get('Slot') === 'Treasure') ? treasureCost : (rebuy ? rebuyCost : equipmentCost))[item.get('Rarity')] || 1;
}

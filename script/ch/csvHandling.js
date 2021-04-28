define(["require", "exports", "../helper/string"], function (require, exports, string_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * This file contains helper functions that target csv handling that are specific to the way Card Hunter processes csv-files.
     */
    /**
     * Generates an extractor to be used when custom filtering items.
     * @param {string[]} itemHeader The header of the item data.
     * @param {CsvMap} cardMap The mapping from card name to card object.
     * @param {CsvItem[]} itemData All relevant items.
     * @returns {Extractor} An extractor to find cards from items.
     */
    function cardExtractorFromItems(itemHeader, cardMap, itemData) {
        var cardFields = itemHeader.filter(string_1.startsWith('Card '));
        return { '+switch': function (i) { return cardFields.map(function (h) { return i.get(h); }).filter(function (c) { return c; }).map(cardMap); },
            'allC': function (_) { return itemData; } };
    }
    exports.cardExtractorFromItems = cardExtractorFromItems;
    /**
     * Generates an extractor to be used when custom filtering cards.
     * @param {CsvItem[]} cardData All relevant cards.
     * @param {CsvItem[]} itemData All relevant items.
     * @param {CsvMap} itemMap The mapping from item name to item object.
     * @param {Extractor} cardExtractor The extractor to find cards from items.
     * @returns {Extractor} An extractor to find items with cards.
     */
    function itemExtractorFromCards(cardData, itemData, itemMap, cardExtractor) {
        var cardPrintage = cardData.reduce(function (r, e) {
            r[e.get('Card Name')] = {};
            return r;
        }, {});
        itemData.forEach(function (i) { return cardExtractor['+switch'](i).forEach(function (c) { return cardPrintage[c.get('Card Name')][i.get('Equipment Name')] = true; }); });
        var itemsWithCards = Object.keys(cardPrintage).reduce(function (r, e) {
            r[e] = Object.keys(cardPrintage[e]).map(itemMap);
            return r;
        }, {});
        return { '+switch': function (c) { return itemsWithCards[c.get('Card Name')]; },
            'allC': function (_) { return cardData; } };
    }
    exports.itemExtractorFromCards = itemExtractorFromCards;
    /**
     * Generates extractors to be used when custom filtering items and cards.
     * @param {string[]} itemHeader The header of the item data.
     * @param {CsvItem[]} itemData All relevant items.
     * @param {CsvMap} itemMap The mapping from item name to item object.
     * @param {CsvItem[]} cardData All relevant cards.
     * @param {CsvMap} cardMap The mapping from card name to card object.
     * @returns {Extractors} Extractors to find cards from items and items with cards.
     */
    function cardAndItemExtractors(itemHeader, itemData, itemMap, cardData, cardMap) {
        var cardExtractor = cardExtractorFromItems(itemHeader, cardMap, itemData);
        return [cardExtractor, itemExtractorFromCards(cardData, itemData, itemMap, cardExtractor)];
    }
    exports.cardAndItemExtractors = cardAndItemExtractors;
    /**
     * Extracts csv-content from the division with the given id and splits the relevant content into lines.
     * @param {string} id The HTMLElement' id containing the csv-content.
     * @returns {string[]} The lines minus game specific but irrelevant additional information.
     */
    function loadCsvContent(id) {
        return document.getElementById(id).innerHTML.trim().split(/[\n\r]+/).slice(1);
    }
    exports.loadCsvContent = loadCsvContent;
});

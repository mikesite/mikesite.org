import {CsvItem, CsvMap, Index} from "../helper/csv";
import {startsWith}             from "../helper/string";
import {Extractor, Extractors}  from "../parser/customFilter";

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
export function cardExtractorFromItems(itemHeader: string[], cardMap: CsvMap, itemData: CsvItem[]): Extractor {
    const cardFields: string[] = itemHeader.filter(startsWith('Card '));
    return { '+switch':(i: CsvItem) => cardFields.map((h: string) => i.get(h)).filter((c: string) => c).map(cardMap),
        'allC':(_:CsvItem) => itemData };
}

/**
 * Generates an extractor to be used when custom filtering cards.
 * @param {CsvItem[]} cardData All relevant cards.
 * @param {CsvItem[]} itemData All relevant items.
 * @param {CsvMap} itemMap The mapping from item name to item object.
 * @param {Extractor} cardExtractor The extractor to find cards from items.
 * @returns {Extractor} An extractor to find items with cards.
 */
export function itemExtractorFromCards(cardData: CsvItem[], itemData: CsvItem[], itemMap: CsvMap, cardExtractor: Extractor): Extractor {
    let cardPrintage: Index<Index<boolean>> = cardData.reduce(
        (r: Index<Index<boolean>>, e: CsvItem) => {
            r[e.get('Card Name')] = ({} as Index<boolean>);
            return r;
        }, {} as Index<Index<boolean>>);
    itemData.forEach((i: CsvItem) => cardExtractor['+switch'](i).forEach((c: CsvItem) => cardPrintage[c.get('Card Name')][i.get('Equipment Name')] = true));
    let itemsWithCards: Index<CsvItem[]> = Object.keys(cardPrintage).reduce(
        (r: Index<CsvItem[]>, e: string) => {
            r[e] = Object.keys(cardPrintage[e]).map(itemMap);
            return r;
        }, {} as Index<CsvItem[]>);
    return { '+switch':(c: CsvItem) => itemsWithCards[c.get('Card Name')],
        'allC':(_:CsvItem) => cardData };
}

/**
 * Generates extractors to be used when custom filtering items and cards.
 * @param {string[]} itemHeader The header of the item data.
 * @param {CsvItem[]} itemData All relevant items.
 * @param {CsvMap} itemMap The mapping from item name to item object.
 * @param {CsvItem[]} cardData All relevant cards.
 * @param {CsvMap} cardMap The mapping from card name to card object.
 * @returns {Extractors} Extractors to find cards from items and items with cards.
 */
export function cardAndItemExtractors(itemHeader: string[], itemData: CsvItem[], itemMap: CsvMap, cardData: CsvItem[], cardMap: CsvMap): Extractors {
    let cardExtractor = cardExtractorFromItems(itemHeader, cardMap, itemData);
    return [cardExtractor, itemExtractorFromCards(cardData, itemData, itemMap, cardExtractor)];
}

/**
 * Extracts csv-content from the division with the given id and splits the relevant content into lines.
 * @param {string} id The HTMLElement' id containing the csv-content.
 * @returns {string[]} The lines minus game specific but irrelevant additional information.
 */
export function loadCsvContent(id: string): string[] {
    return document.getElementById(id)!.innerHTML.trim().split(/[\n\r]+/).slice(1);
}

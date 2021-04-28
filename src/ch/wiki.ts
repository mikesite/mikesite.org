import {CsvItem} from "../helper/csv";

/**
 * This file contains functionality regarding the Cardhuntria-wiki.
 */

/**
 * The wiki's base URL.
 * @type {string}
 */
const wikiBase: string = 'http://wiki.cardhuntria.com/wiki/';

/**
 * This object is capable of constructing URLs for several purposes targeting the wiki.
 * @type {Readonly<{cardLink: ((i: CsvItem) => string); itemLink: ((i: CsvItem) => string)}>}
 */
export const Wiki = Object.freeze({
    cardLink(c: CsvItem): string {
        return wikiBase + 'Cards/' + c.get('Card Name').replace(/ /g, '_');
    },
    itemLink(i: CsvItem): string {
        return wikiBase + 'Items/' + i.get('Equipment Name').replace(/ /g, '_');
    }
});

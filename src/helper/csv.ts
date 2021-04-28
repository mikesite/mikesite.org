import {compose}          from "./functional";
import {asKMap, isTotal}  from "./map";

/**
 * Defines functionality that involves csv-based data.
 */

/**
 * Declares an object to be string-indexed.
 */
export type Index<T> = { [index: string]: T };

/**
 * Defines the return type of a parsed csv-based data set.
 */
export interface CsvItem {
    /**
     * Returns the value associated to the given column of this item.
     * @param {string} key The column to retrieve.
     * @returns {string} The contained value.
     */
    get(key: string): string
}

/**
 * Declares a mapping from ome identifier to an CsvItem.
 */
export type CsvMap = (id: string) => CsvItem;

/**
 * Represents the header line of a csv-based data set that has knowledge about the column headers.
 */
class Header {
    private cache: Index<number> = {};
    constructor(readonly cols: string[]) {}
    index(col: string): number {
        if (this.cache[col] === undefined) {
            return this.cache[col] = this.cols.indexOf(col);
        }
        return this.cache[col];
    }
}

/**
 * Represents a data line of a csv-based data set.
 */
class Item implements CsvItem {
    private cache: Index<string> = {};
    /*
     * Unless I decide to move a declaration into the CsvItem-type the ctor-argument 'row' must not be renamed
     * because of a dependency in the custom filter
     */
    constructor(readonly head: Header, readonly row: string[]) {}
    get(key: string): string {
        if (this.cache[key] === undefined) {
            return this.cache[key] = this.row[this.head.index(key)];
        }
        return this.cache[key];
    }
}

/**
 * Parses csv-based data sets into the defined types representing csv-based data sets.
 * @param {string[]} csvLines The lines to parse.
 * @returns {[string[] , CsvItem[]]} The parsed content together with a collection of valid column headers.
 */
export function parseRawCsvData(csvLines: string[]): [string[], CsvItem[]] {
    // escape commas enclosed in quotes, split at commas, replace escaped commas
    // newlines cannot be present as the input is split at newlines previously
    // so no misinterpretation of this replacement possible
    let lines: string[][] = csvLines.map((row: string) =>
        row.replace(/(,)(?=[^"]*"[^"]*(?:"[^"]*"[^"]*)*$)/g, '\n').split(/,/).map((cell: string) =>
            cell.replace(/\n/g, ",").replace(/^"|"$/g, "").replace(/""/g, '"')
        )
    );
    let head: Header = new Header(lines[0]);
    return [lines[0], lines.slice(1).map((row: string[]) => new Item(head, row))];
}

/**
 * Parses csv-based data sets into the defined types representing csv-based data sets.
 * @param {string[]} csvLines The lines to parse.
 * @returns {CsvItem[]} The parsed content.
 */
export function parseCsvData(csvLines: string[]): CsvItem[] {
    return parseRawCsvData(csvLines)[1];
}

/**
 * Defines getters for the given column.
 * @param {string} field The column to extract.
 * @returns {(item: CsvItem) => string} The constructed getter.
 */
export function getter(field: string): (item: CsvItem) => string {
    return (item: CsvItem) => item.get(field);
}

/**
 * Defines getters for the given column that is meant to represent numeric data.
 * @param {string} field The column to extract.
 * @returns {(item: CsvItem) => number} The constructed getter.
 */
export function intGetter(field: string): (item: CsvItem) => number {
    return compose(getter(field), parseInt);
}

/**
 * Constructs a sorting policy for parsed items that sort some field on a alphabetical basis.
 * @param {string} field The field to sort on.
 * @returns {(i1: CsvItem, i2: CsvItem) => number} The constructed sorting policy.
 */
export function textSort(field: string): (i1: CsvItem, i2: CsvItem) => number {
    return (i1: CsvItem, i2: CsvItem) => i1.get(field).localeCompare(i2.get(field));
}

/**
 * Creates a mapping from the extracted field to the given items. The extracted key should be unique for each item.
 * @param {CsvItem[]} items The items to map to.
 * @param {string} field The field that should be extracted.
 * @returns {CsvMap} The generated mapping.
 */
export function csvMap(items: CsvItem[], field: string): CsvMap {
    return isTotal(asKMap(items, getter(field)));
}

/**
 * Formats any tabular values as a csv-compliant string.
 * @param {any[][]} content The table to convert.
 * @returns {string} The formatted csv-string.
 */
export function toCsv(content: any[][]): string {
    function delimiterEncodedValue(val: any): string {
        let strng: string = val.toString();
        if (/[,\n\r"]/.test(strng))
            return '"' + strng.replace(/"/g, '""') + '"';
        return strng;
    }

    return content.map((line: any[]) => line.map(delimiterEncodedValue).join(',')).join('\n');
}

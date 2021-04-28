define(["require", "exports", "./functional", "./map"], function (require, exports, functional_1, map_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Represents the header line of a csv-based data set that has knowledge about the column headers.
     */
    var Header = /** @class */ (function () {
        function Header(cols) {
            this.cols = cols;
            this.cache = {};
        }
        Header.prototype.index = function (col) {
            if (this.cache[col] === undefined) {
                return this.cache[col] = this.cols.indexOf(col);
            }
            return this.cache[col];
        };
        return Header;
    }());
    /**
     * Represents a data line of a csv-based data set.
     */
    var Item = /** @class */ (function () {
        /*
         * Unless I decide to move a declaration into the CsvItem-type the ctor-argument 'row' must not be renamed
         * because of a dependency in the custom filter
         */
        function Item(head, row) {
            this.head = head;
            this.row = row;
            this.cache = {};
        }
        Item.prototype.get = function (key) {
            if (this.cache[key] === undefined) {
                return this.cache[key] = this.row[this.head.index(key)];
            }
            return this.cache[key];
        };
        return Item;
    }());
    /**
     * Parses csv-based data sets into the defined types representing csv-based data sets.
     * @param {string[]} csvLines The lines to parse.
     * @returns {[string[] , CsvItem[]]} The parsed content together with a collection of valid column headers.
     */
    function parseRawCsvData(csvLines) {
        // escape commas enclosed in quotes, split at commas, replace escaped commas
        // newlines cannot be present as the input is split at newlines previously
        // so no misinterpretation of this replacement possible
        var lines = csvLines.map(function (row) {
            return row.replace(/(,)(?=[^"]*"[^"]*(?:"[^"]*"[^"]*)*$)/g, '\n').split(/,/).map(function (cell) {
                return cell.replace(/\n/g, ",").replace(/^"|"$/g, "").replace(/""/g, '"');
            });
        });
        var head = new Header(lines[0]);
        return [lines[0], lines.slice(1).map(function (row) { return new Item(head, row); })];
    }
    exports.parseRawCsvData = parseRawCsvData;
    /**
     * Parses csv-based data sets into the defined types representing csv-based data sets.
     * @param {string[]} csvLines The lines to parse.
     * @returns {CsvItem[]} The parsed content.
     */
    function parseCsvData(csvLines) {
        return parseRawCsvData(csvLines)[1];
    }
    exports.parseCsvData = parseCsvData;
    /**
     * Defines getters for the given column.
     * @param {string} field The column to extract.
     * @returns {(item: CsvItem) => string} The constructed getter.
     */
    function getter(field) {
        return function (item) { return item.get(field); };
    }
    exports.getter = getter;
    /**
     * Defines getters for the given column that is meant to represent numeric data.
     * @param {string} field The column to extract.
     * @returns {(item: CsvItem) => number} The constructed getter.
     */
    function intGetter(field) {
        return functional_1.compose(getter(field), parseInt);
    }
    exports.intGetter = intGetter;
    /**
     * Constructs a sorting policy for parsed items that sort some field on a alphabetical basis.
     * @param {string} field The field to sort on.
     * @returns {(i1: CsvItem, i2: CsvItem) => number} The constructed sorting policy.
     */
    function textSort(field) {
        return function (i1, i2) { return i1.get(field).localeCompare(i2.get(field)); };
    }
    exports.textSort = textSort;
    /**
     * Creates a mapping from the extracted field to the given items. The extracted key should be unique for each item.
     * @param {CsvItem[]} items The items to map to.
     * @param {string} field The field that should be extracted.
     * @returns {CsvMap} The generated mapping.
     */
    function csvMap(items, field) {
        return map_1.isTotal(map_1.asKMap(items, getter(field)));
    }
    exports.csvMap = csvMap;
    /**
     * Formats any tabular values as a csv-compliant string.
     * @param {any[][]} content The table to convert.
     * @returns {string} The formatted csv-string.
     */
    function toCsv(content) {
        function delimiterEncodedValue(val) {
            var strng = val.toString();
            if (/[,\n\r"]/.test(strng))
                return '"' + strng.replace(/"/g, '""') + '"';
            return strng;
        }
        return content.map(function (line) { return line.map(delimiterEncodedValue).join(','); }).join('\n');
    }
    exports.toCsv = toCsv;
});

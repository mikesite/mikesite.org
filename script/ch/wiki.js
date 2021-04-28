define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * This file contains functionality regarding the Cardhuntria-wiki.
     */
    /**
     * The wiki's base URL.
     * @type {string}
     */
    var wikiBase = 'http://wiki.cardhuntria.com/wiki/';
    /**
     * This object is capable of constructing URLs for several purposes targeting the wiki.
     * @type {Readonly<{cardLink: ((i: CsvItem) => string); itemLink: ((i: CsvItem) => string)}>}
     */
    exports.Wiki = Object.freeze({
        cardLink: function (c) {
            return wikiBase + 'Cards/' + c.get('Card Name').replace(/ /g, '_');
        },
        itemLink: function (i) {
            return wikiBase + 'Items/' + i.get('Equipment Name').replace(/ /g, '_');
        }
    });
});

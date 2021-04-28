define(["require", "exports", "../helper/csv", "../helper/functional", "../helper/map"], function (require, exports, csv_1, functional_1, map_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * This file contains functionality regarding game's console output.
     */
    /**
     * Finds the given marker in the given text and returns all content following this marker.
     * If the marker isn#t found in the text no text is returned.
     * @param {string} text The text to search in.
     * @param {string} marker The text to search for.
     * @param {boolean} last Whether the last (or first) occurrence of the marker is requested.
     * @returns {string} The content following the marker.
     */
    function get(text, marker, last) {
        if (last === void 0) { last = false; }
        var i = (last) ? text.lastIndexOf(marker) : text.indexOf(marker);
        return (i < 0) ? "" : text.slice(i + marker.length);
    }
    /**
     * Returns all content preceding the given marker in the given text.
     * If the marker isn't found in the text at all, the whole text is returned.
     * @param {string} text The text to search in.
     * @param {string} marker The text to search for.
     * @returns {string} The content preceding the marker.
     */
    function cut(text, marker) {
        var i = text.indexOf(marker);
        return (i < 0) ? text : text.slice(0, i);
    }
    /**
     * Parses the player's collection from the console dump.
     * @param {string} raw The console output.
     * @returns {[number , number][]} The items the player possesses and their quantity.
     */
    function parseRawCollection(raw) {
        raw = get(raw, "Received extension response: collection", true);
        raw = cut(raw, "Received extension response");
        raw = cut(raw, "Sending zone extension request");
        raw = get(raw, "(sfs_object) inventory:");
        raw = cut(raw, "(sfs_object)");
        raw = get(raw, "(sfs_array) Items:");
        raw = cut(raw, "(sfs_array)");
        return raw.replace(/\s*\(int\)\s*(\d*)\s*\(int\)\s*(\d*)\s*/g, ",$1:$2").slice(1).split(/,/).map(function (row) {
            var arr = row.split(/:/).map(function (v) { return parseInt(v); });
            return [arr[0], arr[1]];
        });
    }
    exports.parseRawCollection = parseRawCollection;
    /**
     * Parses the player's collection from the console dump and returns them as a mapping.
     * @param {string} raw The console output.
     * @returns {(item: CsvItem) => number} A mapping from items to their collected quantity.
     */
    function parseCollection(raw) {
        return functional_1.compose(csv_1.intGetter('Id'), map_1.withDefault(map_1.tupleAsMap(parseRawCollection(raw)), 0));
    }
    exports.parseCollection = parseCollection;
    /**
     * Parses the flags indicating the player's progress in the campaign.
     * @param {string} raw The console output.
     * @returns {(f: string) => boolean} A mapping from flags to their completion status.
     */
    function parseCampaignFlags(raw) {
        raw = get(raw, "getlocalcampaignflags", true);
        raw = raw.replace(/^\s*/, '');
        raw = cut(raw, "Received extension response");
        raw = cut(raw, "Sending zone extension request");
        raw = cut(raw, '> ');
        return map_1.withDefault(map_1.asMap(raw.split(/[\n\r]+\s*/), function (f) { return f; }, function (_) { return true; }), false);
    }
    exports.parseCampaignFlags = parseCampaignFlags;
    /**
     * Parses the shop's offers.
     * @param {string} raw The console output.
     * @returns {[number , ShopItem][]} Tuples of item ids to their amount in the shop.
     */
    function parseRawShop(raw) {
        raw = get(raw, "Received extension response: storeitems", true);
        raw = cut(raw, "Received extension response");
        raw = cut(raw, "Sending zone extension request");
        raw = get(raw, "Parameters:");
        raw = get(raw, "(sfs_array) stock:");
        return raw.replace(/\s*\(sfs_object\)\s*\(int\)\s*(item_id|quantity|sold_quantity):\s*(\d*)\s*\(int\)\s*(item_id|quantity|sold_quantity):\s*(\d*)\s*\(int\)\s*(item_id|quantity|sold_quantity):\s*(\d*)\s*/g, function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args[1] < args[3] && args[1] < args[5]) {
                if (args[3] < args[5]) {
                    return ',' + args[2] + ':' + args[4] + ':' + args[6];
                }
                return ',' + args[2] + ':' + args[6] + ':' + args[4];
            }
            if (args[3] < args[5]) {
                if (args[1] < args[5]) {
                    return ',' + args[4] + ':' + args[2] + ':' + args[6];
                }
                return ',' + args[4] + ':' + args[6] + ':' + args[2];
            }
            if (args[1] < args[3]) {
                return ',' + args[6] + ':' + args[2] + ':' + args[4];
            }
            return ',' + args[6] + ':' + args[4] + ':' + args[2];
        }).slice(1).split(/,/).map(function (row) {
            var arr = row.split(/:/).map(function (v) { return parseInt(v); });
            return [arr[0], { sell: arr[1], resell: arr[2] }];
        });
    }
    exports.parseRawShop = parseRawShop;
    /**
     * Parses the shop's offers and returns them as a mapping.
     * @param {string} raw The console output.
     * @returns {(item: CsvItem) => ShopItem | null} A mapping from items to their amount in the shop.
     */
    function parseShop(raw) {
        return functional_1.compose(csv_1.intGetter('Id'), map_1.withDefaultT(map_1.tupleAsMap(parseRawShop(raw)), null));
    }
    exports.parseShop = parseShop;
    /**
     * Parses the received loot.
     * @param {string} raw The log's lines of the adventure run.
     * @returns {{property: Index<string>; loot: Index<string>[]}[]} The received loot.
     */
    function parseLootLog(raw) {
        var results = [];
        var currentMap = { property: {}, loot: Array() };
        for (var rowID = 0; rowID < raw.length; ++rowID) {
            var row = raw[rowID];
            if (/Received extension response: currentadventure/.test(row)) {
                currentMap = { property: {}, loot: Array() };
                ++rowID; // skip "Parameters:"
                var currentProp = null;
                while ((row = raw[++rowID]).length != 0) {
                    if (/\)/.test(row)) {
                        var rowContent = row.split(/\)/)[1].split(/:/);
                        currentMap.property[currentProp = rowContent[0].trim()] = rowContent[1].trim();
                    }
                    else if (currentProp != null) {
                        currentMap.property[currentProp] += ' ' + row.trim();
                    }
                }
            }
            else if (/Received extension response: treasure/.test(row)) {
                var loot = [];
                rowID += 2; // skip "Parameters:" and "(sfs_array) items:"
                while (/\(sfs_object\)/.test(raw[++rowID])) {
                    var treasure = {};
                    while (/\)/.test(row = raw[++rowID])) {
                        var rowContent = row.split(/\)/)[1].split(/:/);
                        treasure[rowContent[0].trim()] = rowContent[1].trim();
                    }
                    loot.push(treasure);
                }
                if (loot.length > 0) { // received treasure data
                    currentMap.loot = loot;
                    results.push(currentMap);
                    currentMap = { property: {}, loot: Array() };
                }
            }
        }
        return results;
    }
    exports.parseLootLog = parseLootLog;
});

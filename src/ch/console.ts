import {CsvItem, Index, intGetter}                    from "../helper/csv";
import {compose}                                      from "../helper/functional";
import {asMap, tupleAsMap, withDefault, withDefaultT} from "../helper/map";

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
function get(text: string, marker: string, last: boolean = false): string {
    let i: number = (last) ? text.lastIndexOf(marker) : text.indexOf(marker);
    return (i < 0) ? "" : text.slice(i + marker.length);
}

/**
 * Returns all content preceding the given marker in the given text.
 * If the marker isn't found in the text at all, the whole text is returned.
 * @param {string} text The text to search in.
 * @param {string} marker The text to search for.
 * @returns {string} The content preceding the marker.
 */
function cut(text: string, marker: string): string {
    let i: number = text.indexOf(marker);
    return (i < 0) ? text : text.slice(0, i);
}

/**
 * Parses the player's collection from the console dump.
 * @param {string} raw The console output.
 * @returns {[number , number][]} The items the player possesses and their quantity.
 */
export function parseRawCollection(raw: string): [number, number][] {
    raw = get(raw, "Received extension response: collection", true);
    raw = cut(raw, "Received extension response");
    raw = cut(raw, "Sending zone extension request");
    raw = get(raw, "(sfs_object) inventory:");
    raw = cut(raw, "(sfs_object)");
    raw = get(raw, "(sfs_array) Items:");
    raw = cut(raw, "(sfs_array)");
    return raw.replace(/\s*\(int\)\s*(\d*)\s*\(int\)\s*(\d*)\s*/g, ",$1:$2").slice(1).split(/,/).map((row: string) => {
        let arr: number[] = row.split(/:/).map((v: string) => parseInt(v));
        return [arr[0], arr[1]] as [number, number];
    });
}

/**
 * Parses the player's collection from the console dump and returns them as a mapping.
 * @param {string} raw The console output.
 * @returns {(item: CsvItem) => number} A mapping from items to their collected quantity.
 */
export function parseCollection(raw: string): (item: CsvItem) => number {
    return compose(intGetter('Id'), withDefault(tupleAsMap(parseRawCollection(raw)), 0));
}

/**
 * Parses the flags indicating the player's progress in the campaign.
 * @param {string} raw The console output.
 * @returns {(f: string) => boolean} A mapping from flags to their completion status.
 */
export function parseCampaignFlags(raw: string): (f: string) => boolean {
    raw = get(raw, "getlocalcampaignflags", true);
    raw = raw.replace(/^\s*/, '');
    raw = cut(raw, "Received extension response");
    raw = cut(raw, "Sending zone extension request");
    raw = cut(raw, '> ');
    return withDefault(asMap(raw.split(/[\n\r]+\s*/), (f: string) => f, (_: string) => true), false);
}

/**
 * A type describing the amount of items present in the visited shop.
 */
export interface ShopItem {
    readonly sell: number
    readonly resell: number
}

/**
 * Parses the shop's offers.
 * @param {string} raw The console output.
 * @returns {[number , ShopItem][]} Tuples of item ids to their amount in the shop.
 */
export function parseRawShop(raw: string): [number, ShopItem][] {
    raw = get(raw, "Received extension response: storeitems", true);
    raw = cut(raw, "Received extension response");
    raw = cut(raw, "Sending zone extension request");
    raw = get(raw, "Parameters:");
    raw = get(raw, "(sfs_array) stock:");
    return raw.replace(
        /\s*\(sfs_object\)\s*\(int\)\s*(item_id|quantity|sold_quantity):\s*(\d*)\s*\(int\)\s*(item_id|quantity|sold_quantity):\s*(\d*)\s*\(int\)\s*(item_id|quantity|sold_quantity):\s*(\d*)\s*/g,
        (...args: string[]) => {
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
        }).slice(1).split(/,/).map((row: string) => {
        let arr: number[] = row.split(/:/).map((v: string) => parseInt(v));
        return [arr[0], { sell: arr[1], resell: arr[2] }] as [number, ShopItem];
    });
}

/**
 * Parses the shop's offers and returns them as a mapping.
 * @param {string} raw The console output.
 * @returns {(item: CsvItem) => ShopItem | null} A mapping from items to their amount in the shop.
 */
export function parseShop(raw: string): (item: CsvItem) => ShopItem | null {
    return compose(intGetter('Id'), withDefaultT(tupleAsMap(parseRawShop(raw)), null));
}

/**
 * Parses the received loot.
 * @param {string} raw The log's lines of the adventure run.
 * @returns {{property: Index<string>; loot: Index<string>[]}[]} The received loot.
 */
export function parseLootLog(raw: string[]): { property: Index<string>, loot: Index<string>[] }[] {
    let results: { property: Index<string>, loot: Index<string>[] }[] = [];
    let currentMap: { property: Index<string>, loot: Index<string>[] } = { property: {}, loot: Array<Index<string>>() };

    for (let rowID: number = 0; rowID < raw.length; ++rowID) {
        let row: string = raw[rowID];
        if (/Received extension response: currentadventure/.test(row)) {
            currentMap = { property: {}, loot: Array<Index<string>>() };
            ++rowID; // skip "Parameters:"
            let currentProp: string | null = null;
            while ((row = raw[++rowID]).length != 0) {
                if (/\)/.test(row)) {
                    let rowContent: string[] = row.split(/\)/)[1].split(/:/);
                    currentMap.property[currentProp = rowContent[0].trim()] = rowContent[1].trim();
                } else if (currentProp != null) {
                    currentMap.property[currentProp] += ' ' + row.trim();
                }
            }
        } else if (/Received extension response: treasure/.test(row)) {
            let loot: Index<string>[] = [];
            rowID += 2; // skip "Parameters:" and "(sfs_array) items:"
            while(/\(sfs_object\)/.test(raw[++rowID])) {
                let treasure: Index<string> = {};
                while (/\)/.test(row = raw[++rowID])) {
                    let rowContent = row.split(/\)/)[1].split(/:/);
                    treasure[rowContent[0].trim()] = rowContent[1].trim();
                }
                loot.push(treasure);
            }
            if (loot.length > 0) { // received treasure data
                currentMap.loot = loot;
                results.push(currentMap);
                currentMap = { property: {}, loot: Array<Index<string>>() };
            }
        }
    }

    return results;
}

import {flatMap} from "../helper/map";

/**
 * Contains information describing available figures/costumes.
 */

/**
 * Lists all playable races.
 * @type {ReadonlyArray<string>}
 */
export const RACES: ReadonlyArray<string> = Object.freeze(["Dwarf","Human","Elf"]);

/**
 * Lists all playable classes.
 * @type {ReadonlyArray<string>}
 */
export const CLASSES: ReadonlyArray<string> = Object.freeze(["Warrior","Wizard","Priest"]);

/**
 * Lists all playable genders.
 * @type {ReadonlyArray<string>}
 */
export const GENDERS: ReadonlyArray<string> = Object.freeze(["F","M"]);

/**
 * Lists all color variants.
 * @type {ReadonlyArray<string>}
 */
export const COLORS: ReadonlyArray<string> = Object.freeze(["A", "B", "C"]);

/**
 * Constructs all possible figures based on the given sets of alternative values for the three components.
 * @param {ReadonlyArray<string>} races The races to consider.
 * @param {ReadonlyArray<string>} classes The classes to consider.
 * @param {ReadonlyArray<string>} gender The genders to consider.
 * @returns {[string , string , string][]} All possible figures from the given parts.
 */
export function figureBases(races: ReadonlyArray<string> = RACES, classes: ReadonlyArray<string> = CLASSES, gender: ReadonlyArray<string> = GENDERS): [string, string, string][] {
    return flatMap(races, (r: string) => flatMap(classes, (c: string) => gender.map((g: string) => [r, c, g] as [string, string, string])));
}

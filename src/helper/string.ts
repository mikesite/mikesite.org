/**
 * Defines functionality to apply to string-based objects.
 * These helper functions will typically return string predicates.
 * This way you can either directly apply the predicate to a singular string or use it to operate on collections.
 */

/**
 * Checks whether a text starts with another text.
 * @param {string} query The text that every accepted string must start with.
 * @returns {boolean} A predicate for strings checking their start.
 */
export function startsWith(query: string): (t: string) => boolean {
    return (t: string) => t.indexOf(query) === 0;
}

/**
 * Checks whether a text includes another text.
 * @param {string} query The text that every accepted string must contain.
 * @returns {boolean} A predicate for strings checking their content.
 */
export function includes(query: string): (t: string) => boolean {
    return (t: string) => t.indexOf(query) >= 0;
}

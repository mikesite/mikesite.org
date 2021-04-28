import {CsvItem, Index} from "../helper/csv";
import {parse}          from "./parser";

/**
 * This file eases the usage of custom filters by providing a wrapper that converts the parser filter string into a proper function.
 * In addition this wrapper also adds the helper functions that the parser assumes to be available.
 * All those helper functions aren't documented here because their documentation is done in the full parser documentation in the parser-declaration-file.
 * Here, only local functions and variables are described.
 */

 /**
  * This type represents an extractor method that can extract several CsvItems from one CvItem.
  */
 export type Extractor = Index<(o: CsvItem) => CsvItem[]>;

 /**
  * Extractor that may be added as the last element of an extractor array to prevent cycling extraction.
  */
 export const stopExtractor: Extractor = { };

 /**
  * This type represents a collection of extractor methods that each can extract several CsvItems from one CvItem.
  */
 export type Extractors = Extractor[];

/**
 * Builds a custom filter from a string-based rule.
 * @param {string} rule The rule to parse.
 * @returns {(o: CsvItem, e: Extractors) => boolean} The built filter.
 * @throws Error if given rule string wasn't parsable.
 */
export function parseCustomFilter(rule: string): (o: CsvItem, e: Extractors) => boolean {
    let f: (o: CsvItem, e: Extractors) => boolean = new Function('o', 'e', t.toString() + n.toString() + r.toString() + b.toString() + 'var i = [];' + parse(rule)) as (o: CsvItem, e: Extractors) => boolean;
    return (o: CsvItem, e: Extractors) => {
        if (!o)
            return true;
        if (e.length)
            return f(o, e);
        else
            return f(o, [stopExtractor]);
    };
}

/**
 * The type of predicates that are used by several helper functions.
 * A predicate usually take all meta-variables.
 */
type Predicate = (o: CsvItem, e: Extractors, i: string[]) => boolean;

/*
m: matching predicate - checks whether the given value matches the expected value
a: actual - the actual value(s) the field(s) contain
 */
function t(o: CsvItem, f: string | null, v: string, n: boolean, e: boolean): boolean {
    function m(a: string): boolean {
        return n == (e ? (a == v) : ((a || "").indexOf(v) > -1));
    }
    let a: string[] = f ? [o.get(f)] : (o as any).row;
    return (f || n) ? a.some(m) : a.every(m);
}

/*
a: actual - the actual number value the field contains
 */
function n(o: CsvItem, f: string, v: number, c: boolean[]): boolean {
    let a: number = parseInt(o.get(f));
    return (a != v) && c[0] && !c[1] || (a == v) && c[1] || !c[0] && ((v > a) && c[2] || (a > v) && !c[2]);
}

/*
b: (new) base - the elements the extractor yields when applied to 'o'
n: next extractor - rotates the extractors to move the next extractor up front
l: length - length of 'b'
m: matching - number of elements in 'b' fulfilling 'p'
a: applied number - resolves a signed nat by applying it to 'l'
r: range - checks whether 'm' is in a given range
t: trend match - checks whether 'm' matches the pivot or has the given trend
 */
function r(o: CsvItem, e: Extractors, i: string[], c: string, q: any[], p: Predicate): boolean {
    let b: CsvItem[] = e[0][c] ? e[0][c](o) : [];
    let n: Extractors = (c[0] === '+') ? e.map((_, i: number) => e[(i + 1) % e.length]) :
        (c[0] === '-') ? e.map((_, i: number) => e[(i + e.length - 1) % e.length]) : e;
    let l: number = b.length;
    let m: number = b.filter((o: CsvItem) => p(o, n, i)).length;
    function a(v: [number, boolean]): number {
        return v[1] ? v[0] : (l - v[0]);
    }
    function r(f: number, t: number): boolean {
        return (f <= m || t <= m) && (m <= f || m <= t);
    }
    function t(p: number, t: number): boolean {
        return (p == m) || (((p - m) * t) < 0);
    }
    switch (q[0]) {
        case 0: return l == m;
        case 1: return m > 0;
        case 2: return r(a(q[1]), a(q[2]));
        case 3: return t(a(q[1]), q[2]);
        default: return false;
    }
}

/*
n: updated indexed bindings - all given bindings are either added or updated if the index was already in use before
 */
function b(o: CsvItem, e: Extractors, i: string[], b:[number, string][], p: Predicate): boolean {
    let n: string[] = b.reduce((i: string[], b: [number, string]) => {i[b[0]] = o.get(b[1]); return i;}, i.slice());
    return p(o, e, n);
}

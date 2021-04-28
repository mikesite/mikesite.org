import {asLazyMap, withDefault} from "./map";

/**
 * Defines functionality that stem from functional programming.
 */

/**
 * Inverts the return value from a given predicate.
 * @param {(t: T) => boolean} fun The predicate to invert.
 * @returns {(t: T) => boolean} The inverted predicate.
 */
export function not<T>(fun: (t: T) => boolean): (t: T) => boolean {
    return (t: T) => !fun(t);
}

/**
 * Conjuncts several predicates.
 * @param {(t: T) => boolean} fun The predicates to conjunct.
 * @returns {(t: T) => boolean} The conjuncted predicate.
 */
export function and<T>(...fun: ((t: T) => boolean)[]): (t: T) => boolean {
    return (t: T) => fun.reduce((r: boolean, f: (t: T) => boolean) => r && f(t), true);
}

/**
 * Disjuncts several predicates.
 * @param {(t: T) => boolean} fun The predicates to disjunct.
 * @returns {(t: T) => boolean} The disjuncted predicate.
 */
export function or<T>(...fun: ((t: T) => boolean)[]): (t: T) => boolean {
    return (t: T) => fun.reduce((r: boolean, f: (t: T) => boolean) => r || f(t), false);
}

/**
 * Requires exactly one of the predicates to return true for some element to be accepted.
 * @param {(t: T) => boolean} p1 The first predicate.
 * @param {(t: T) => boolean} p2 The second predicate.
 * @returns {(t: T) => boolean} The resulted predicate.
 */
export function xor<T>(p1: (t: T) => boolean, p2: (t: T) => boolean): (t: T) => boolean {
    return (t: T) => p1(t) !== p2(t)
}

/**
 * Applies the given predicates based on the given state.
 * @param {boolean} c The condition for the conditional predicate execution.
 * @param {(t: T) => boolean} t The predicate to execute if the condition was true.
 * @param {(t: T) => boolean} e The predicate to execute if the condition was false.
 * @returns {(t: T) => boolean} The predicate matching the condition.
 */
export function cond<T>(c: boolean, t: (t: T) => boolean, e: (t: T) => boolean): (t: T) => boolean {
    return c ? t : e;
}

/**
 * Returns a predicate that always produces the given value.
 * Avoid using cnst with a boolean terminal. Some rewrite rules:
 * - cond(c, cnst(true), e) => or(cnst(c), e)
 * - cond(c, cnst(false), e) => and(cnst(!c), e)
 * - cond(c, t, cnst(true)) => or(cnst(!c), t)
 * - cond(c, t, cnst(false)) => and(cnst(c), t)
 * @param {boolean} v The value to return for every argument.
 * @returns {(t: T) => boolean} The constructed predicate.
 */
export function cnst<T>(v: boolean): (t: T) => boolean {
    return (_: T) => v;
}

/**
 * Composes two functions to a single function by pipelining the result of the first function to the argument of the second.
 * @param {(x: X) => Y} f1 The first function to execute in order to produce the intermediate result.
 * @param {(y: Y) => Z} f2 The second function that consumes the intermediate result and produces the final result.
 * @returns {(x: X) => Z} The composed function.
 */
export function compose<X, Y, Z>(f1: (x: X) => Y, f2: (y: Y) => Z): (x: X) => Z {
    return (x: X) => f2(f1(x));
}

/**
 * Returns a predicate that checks the equality of the received value with the given value.
 * @param {T} t The value to be compared with.
 * @returns {(t: T) => boolean} The constructed predicate.
 */
export function eql<T>(t: T): (t: T) => boolean {
    return (tt: T) => t === tt;
}

/**
 * Partitions a given collection of items into the ones fulfilling the given predicate and those that doesn't.
 * @param {T[]} arr The items to partition.
 * @param {(t: T, index?: number, array?: T[]) => boolean} filter The predicate for the partition decision.
 * @returns {[T[] , T[]]} The partitioned items.
 */
export function partition<T>(arr: T[], filter: (t: T, index?: number, array?: T[]) => boolean): [T[], T[]] {
    return arr.reduce((r: [T[], T[]], e: T, i: number, a: T[]) => {
        r[filter(e, i, a) ? 0 : 1].push(e);
        return r;
        }, [[], []] as [T[], T[]]);
}

/**
 * Groups a given collection of items into several groups based on some indexer function.
 * @param {T[]} arr The item to group.
 * @param {(f: T) => K} indexer The function that produces an index for each item.
 * @returns {[K[] , ((k: K) => T[])]} A collection of indices and a mapping from this indices to their associated items.
 */
export function groupBy<T, K>(arr: T[], indexer: (f: T) => K): [K[], (k: K) => T[]] {
    let keys: K[] = arr.map(indexer).filter(distinct());
    return [keys, withDefault(asLazyMap(keys, (k: K) => arr.filter((i: T) => indexer(i) === k)), [])];
}

/**
 * Defines a function that sums up numerical values. To be used with a collection's reduce method and an initial value.
 */
export const sum: (x: number, y: number) => number = (x: number, y: number) => x + y;

/**
 * Returns every contained item exactly once. To be used with a collection's filter method.
 * @returns {(value: T, index: number, array: T[]) => boolean} A collection of the provided items without duplications.
 */
export function distinct<T>(): (value: T, index: number, array: T[]) => boolean {
    return (value: T, index: number, array: T[]) => index === array.indexOf(value);
}

/**
 * Sorts a collection of items based on a sorting policy that involves a field of the items. To be used with the collection's sort method.
 * As this method doesn't make use of caches the field extractor should be reasonable simple and fast.
 * @param {(e: E) => F} field The field extractor.
 * @param {(f1: F, f2: F) => number} sort The sorting policy on the fields.
 * @returns {(e1: E, e2: E) => number} The created sorting policy on the whole items.
 */
export function fieldSort<E, F>(field: (e: E) => F, sort: (f1: F, f2: F) => number): (e1: E, e2: E) => number {
    return (e1: E, e2: E) => sort(field(e1), field(e2));
}

/**
 * Creates a sorting policy that applies several single policies after each other if all previous haven't provide any preference.
 * If one policy prefers one element over the other all following policies aren't queried.
 * @param {(t1: T, t2: T) => number} sort The first policy to query.
 * @param {(t1: T, t2: T) => number} sorts All following policies to query if necessary.
 * @returns {(t1: T, t2: T) => number} A sorting policy combination of the given policies.
 */
export function stageSort<T>(sort: (t1: T, t2: T) => number, ...sorts: ((t1: T, t2: T) => number)[]): (t1: T, t2: T) => number {
    if (sorts.length === 0)
        return sort;
    return (t1: T, t2: T) => {
        let diff: number = sort(t1, t2);
        if (diff)
            return diff;
        return stageSort(sorts[0], ...(sorts.slice(1)))(t1, t2);
    }
}

/**
 * Applies the given sort function in reverse order.
 * @param {(t1: T, t2: T) => number} sort The sort to reverse.
 * @returns {(t1: T, t2: T) => number} The generated sorting policy.
 */
export function reverseSort<T>(sort: (t1: T, t2: T) => number): (t1: T, t2: T) => number {
    return (t1: T, t2: T) => sort(t2, t1);
}

/**
 * Applies the given sorting policy based on the given state.
 * @param {boolean} c The condition for the conditional sorting policy execution.
 * @param {(t: T) => boolean} t The sorting policy to execute if the condition was true.
 * @param {(t: T) => boolean} e The sorting policy to execute if the condition was false.
 * @returns {(t: T) => boolean} The sorting policy matching the condition.
 */
export function condSort<T>(c: boolean, t: (t1: T, t2: T) => number, e: (t1: T, t2: T) => number): (t1: T, t2: T) => number {
    return c ? t : e;
}

/**
 * Constructs an array of given length and initialized with values according to the given initializer function.
 * @param {number} length The array's length
 * @param {(i: number) => T} val The initializer function.
 * @returns {T[]} The created array.
 */
export function array<T>(length: number, val:(i: number) => T): T[] {
    let a: T[] = Array(length);
    for (let i: number = 0; i < length; i++)
        a[i] = val(i);
    return a;
}

define(["require", "exports", "./map"], function (require, exports, map_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Defines functionality that stem from functional programming.
     */
    /**
     * Inverts the return value from a given predicate.
     * @param {(t: T) => boolean} fun The predicate to invert.
     * @returns {(t: T) => boolean} The inverted predicate.
     */
    function not(fun) {
        return function (t) { return !fun(t); };
    }
    exports.not = not;
    /**
     * Conjuncts several predicates.
     * @param {(t: T) => boolean} fun The predicates to conjunct.
     * @returns {(t: T) => boolean} The conjuncted predicate.
     */
    function and() {
        var fun = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fun[_i] = arguments[_i];
        }
        return function (t) { return fun.reduce(function (r, f) { return r && f(t); }, true); };
    }
    exports.and = and;
    /**
     * Disjuncts several predicates.
     * @param {(t: T) => boolean} fun The predicates to disjunct.
     * @returns {(t: T) => boolean} The disjuncted predicate.
     */
    function or() {
        var fun = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fun[_i] = arguments[_i];
        }
        return function (t) { return fun.reduce(function (r, f) { return r || f(t); }, false); };
    }
    exports.or = or;
    /**
     * Requires exactly one of the predicates to return true for some element to be accepted.
     * @param {(t: T) => boolean} p1 The first predicate.
     * @param {(t: T) => boolean} p2 The second predicate.
     * @returns {(t: T) => boolean} The resulted predicate.
     */
    function xor(p1, p2) {
        return function (t) { return p1(t) !== p2(t); };
    }
    exports.xor = xor;
    /**
     * Applies the given predicates based on the given state.
     * @param {boolean} c The condition for the conditional predicate execution.
     * @param {(t: T) => boolean} t The predicate to execute if the condition was true.
     * @param {(t: T) => boolean} e The predicate to execute if the condition was false.
     * @returns {(t: T) => boolean} The predicate matching the condition.
     */
    function cond(c, t, e) {
        return c ? t : e;
    }
    exports.cond = cond;
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
    function cnst(v) {
        return function (_) { return v; };
    }
    exports.cnst = cnst;
    /**
     * Composes two functions to a single function by pipelining the result of the first function to the argument of the second.
     * @param {(x: X) => Y} f1 The first function to execute in order to produce the intermediate result.
     * @param {(y: Y) => Z} f2 The second function that consumes the intermediate result and produces the final result.
     * @returns {(x: X) => Z} The composed function.
     */
    function compose(f1, f2) {
        return function (x) { return f2(f1(x)); };
    }
    exports.compose = compose;
    /**
     * Returns a predicate that checks the equality of the received value with the given value.
     * @param {T} t The value to be compared with.
     * @returns {(t: T) => boolean} The constructed predicate.
     */
    function eql(t) {
        return function (tt) { return t === tt; };
    }
    exports.eql = eql;
    /**
     * Partitions a given collection of items into the ones fulfilling the given predicate and those that doesn't.
     * @param {T[]} arr The items to partition.
     * @param {(t: T, index?: number, array?: T[]) => boolean} filter The predicate for the partition decision.
     * @returns {[T[] , T[]]} The partitioned items.
     */
    function partition(arr, filter) {
        return arr.reduce(function (r, e, i, a) {
            r[filter(e, i, a) ? 0 : 1].push(e);
            return r;
        }, [[], []]);
    }
    exports.partition = partition;
    /**
     * Groups a given collection of items into several groups based on some indexer function.
     * @param {T[]} arr The item to group.
     * @param {(f: T) => K} indexer The function that produces an index for each item.
     * @returns {[K[] , ((k: K) => T[])]} A collection of indices and a mapping from this indices to their associated items.
     */
    function groupBy(arr, indexer) {
        var keys = arr.map(indexer).filter(distinct());
        return [keys, map_1.withDefault(map_1.asLazyMap(keys, function (k) { return arr.filter(function (i) { return indexer(i) === k; }); }), [])];
    }
    exports.groupBy = groupBy;
    /**
     * Defines a function that sums up numerical values. To be used with a collection's reduce method and an initial value.
     */
    exports.sum = function (x, y) { return x + y; };
    /**
     * Returns every contained item exactly once. To be used with a collection's filter method.
     * @returns {(value: T, index: number, array: T[]) => boolean} A collection of the provided items without duplications.
     */
    function distinct() {
        return function (value, index, array) { return index === array.indexOf(value); };
    }
    exports.distinct = distinct;
    /**
     * Sorts a collection of items based on a sorting policy that involves a field of the items. To be used with the collection's sort method.
     * As this method doesn't make use of caches the field extractor should be reasonable simple and fast.
     * @param {(e: E) => F} field The field extractor.
     * @param {(f1: F, f2: F) => number} sort The sorting policy on the fields.
     * @returns {(e1: E, e2: E) => number} The created sorting policy on the whole items.
     */
    function fieldSort(field, sort) {
        return function (e1, e2) { return sort(field(e1), field(e2)); };
    }
    exports.fieldSort = fieldSort;
    /**
     * Creates a sorting policy that applies several single policies after each other if all previous haven't provide any preference.
     * If one policy prefers one element over the other all following policies aren't queried.
     * @param {(t1: T, t2: T) => number} sort The first policy to query.
     * @param {(t1: T, t2: T) => number} sorts All following policies to query if necessary.
     * @returns {(t1: T, t2: T) => number} A sorting policy combination of the given policies.
     */
    function stageSort(sort) {
        var sorts = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sorts[_i - 1] = arguments[_i];
        }
        if (sorts.length === 0)
            return sort;
        return function (t1, t2) {
            var diff = sort(t1, t2);
            if (diff)
                return diff;
            return stageSort.apply(void 0, [sorts[0]].concat((sorts.slice(1))))(t1, t2);
        };
    }
    exports.stageSort = stageSort;
    /**
     * Applies the given sort function in reverse order.
     * @param {(t1: T, t2: T) => number} sort The sort to reverse.
     * @returns {(t1: T, t2: T) => number} The generated sorting policy.
     */
    function reverseSort(sort) {
        return function (t1, t2) { return sort(t2, t1); };
    }
    exports.reverseSort = reverseSort;
    /**
     * Applies the given sorting policy based on the given state.
     * @param {boolean} c The condition for the conditional sorting policy execution.
     * @param {(t: T) => boolean} t The sorting policy to execute if the condition was true.
     * @param {(t: T) => boolean} e The sorting policy to execute if the condition was false.
     * @returns {(t: T) => boolean} The sorting policy matching the condition.
     */
    function condSort(c, t, e) {
        return c ? t : e;
    }
    exports.condSort = condSort;
    /**
     * Constructs an array of given length and initialized with values according to the given initializer function.
     * @param {number} length The array's length
     * @param {(i: number) => T} val The initializer function.
     * @returns {T[]} The created array.
     */
    function array(length, val) {
        var a = Array(length);
        for (var i = 0; i < length; i++)
            a[i] = val(i);
        return a;
    }
    exports.array = array;
});

/**
 * Defines functionality that creates mappings or refines those.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Converts a collection of items into a mapping where both key and value are extracted by given functions.
     * @param {T[]} items The items to convert into a mapping.
     * @param {(t: T) => K} key The key extractor function.
     * @param {(t: T) => V} value The value extractor function.
     * @returns {Mapping<K, V>} The created mapping.
     */
    function asMap(items, key, value) {
        var map = items.map(function (i) { return [key(i), value(i)]; });
        return function (k, fallback) {
            var matching = map.filter(function (m) { return m[0] === k; });
            if (matching.length === 0) {
                return fallback;
            }
            else {
                return matching[0][1];
            }
        };
    }
    exports.asMap = asMap;
    /**
     * Converts a collection of tuples into a mapping where the first tuple-element is the key and the second is the value.
     * @param {[K , V][]} items The items to convert into a mapping.
     * @returns {Mapping<K, V>} The created mapping.
     */
    function tupleAsMap(items) {
        return asMap(items, function (i) { return i[0]; }, function (i) { return i[1]; });
    }
    exports.tupleAsMap = tupleAsMap;
    /**
     * Converts a collection of items into a mapping where the key is extracted by a given function and the items themselves are the values.
     * @param {T[]} items The items to convert into a mapping.
     * @param {(t: T) => K} key The key extractor function.
     * @returns {Mapping<K, T>} The created mapping.
     */
    function asKMap(items, key) {
        return asMap(items, key, function (t) { return t; });
    }
    exports.asKMap = asKMap;
    /**
     * Converts a collection of items into a mapping where the items themselves are the keys and the value is extracted by a given function.
     * @param {T[]} items The items to convert into a mapping.
     * @param {(t: T) => V} value The value extractor function.
     * @returns {Mapping<T, V>} The created mapping.
     */
    function asVMap(items, value) {
        return asMap(items, function (t) { return t; }, value);
    }
    exports.asVMap = asVMap;
    /**
     * Converts a collection of keys into a lazy mapping that is only partially evaluated once if some key is requested.
     * @param {K[]} keys The valid keys for this mapping.
     * @param {(k: K) => V} value The value extractor function. This extractor is called at most once per key.
     * @returns {Mapping<K, V>} The created mapping.
     */
    function asLazyMap(keys, value) {
        var map = keys.map(function (k) { return [k, function () {
                var v = value(k);
                map.unshift([k, function () { return v; }]);
                return v;
            }]; });
        return function (k, fallback) {
            var matching = map.filter(function (m) { return m[0] === k; });
            if (matching.length === 0) {
                return fallback;
            }
            else {
                return matching[0][1]();
            }
        };
    }
    exports.asLazyMap = asLazyMap;
    /**
     * Applies a common fallback value to a constructed mapping. The user then doesn't have to care to pass this fallback value to every call.
     * @param {Mapping<K, V>} f The constructed mapping.
     * @param {V} fallback The fallback value in case the queried key isn't declared.
     * @returns {(TotalMapping<K, V>} The mapping with implicit fallback value.
     */
    function withDefault(f, fallback) {
        return function (k) { return f(k, fallback); };
    }
    exports.withDefault = withDefault;
    /**
     * Applies a common fallback value to a constructed mapping. The user then doesn't have to care to pass this fallback value to every call.
     * Uses a differently typed fallback value.
     * @param {Mapping<K, V>} f The constructed mapping.
     * @param {F} fallback The fallback value in case the queried key isn't declared.
     * @returns {(TotalMapping<K, V | F>} The mapping with implicit fallback value.
     */
    function withDefaultT(f, fallback) {
        return function (k) { return f(k, fallback); };
    }
    exports.withDefaultT = withDefaultT;
    /**
     * Tells the type checker that the fallback value isn't necessary and every access is made with a valid key.
     * Apply with care because this method circumvents the type checker and working on the return value for an unsupported key can break your code.
     * @param {Mapping<K, V>} f The constructed mapping.
     * @returns {TotalMapping<K, V>} The mapping with no fallback value.
     */
    function isTotal(f) {
        return withDefault(f, undefined);
    }
    exports.isTotal = isTotal;
    /**
     * Given a collection of items that should each be mapped to a collection of results this function constructs a single result collection.
     * @param {ReadonlyArray<T>} array The items to map.
     * @param {(t: T) => R[]} op The mapping function that returns a collection for each given element.
     * @returns {R[]} The flattened resulting collection.
     */
    function flatMap(array, op) {
        return array.map(op).reduce(function (x, y) { return x.concat(y); }, []);
    }
    exports.flatMap = flatMap;
});

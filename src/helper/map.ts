/**
 * Defines functionality that creates mappings or refines those.
 */

/**
 * Represents a mapping function that either defines some value for the given key or will answer with the given fallback value.
 */
export type Mapping<K, V> = (k: K, fallback: V) => V

/**
 * Represents a mapping function that defines some value for every key.
 */
export type TotalMapping<K, V> = (k: K) => V

/**
 * Converts a collection of items into a mapping where both key and value are extracted by given functions.
 * @param {T[]} items The items to convert into a mapping.
 * @param {(t: T) => K} key The key extractor function.
 * @param {(t: T) => V} value The value extractor function.
 * @returns {Mapping<K, V>} The created mapping.
 */
export function asMap<T, K, V>(items: T[], key: (t: T) => K, value: (t: T) => V): Mapping<K, V> {
    let map: Array<[K, V]> = items.map((i: T) => [key(i), value(i)] as [K, V]);
    return (k: K, fallback: V) => {
        let matching: Array<[K, V]> = map.filter((m: [K, V]) => m[0] === k);
        if (matching.length === 0) {
            return fallback;
        } else {
            return matching[0][1];
        }
    };
}

/**
 * Converts a collection of tuples into a mapping where the first tuple-element is the key and the second is the value.
 * @param {[K , V][]} items The items to convert into a mapping.
 * @returns {Mapping<K, V>} The created mapping.
 */
export function tupleAsMap<K, V>(items: [K, V][]): Mapping<K, V> {
    return asMap(items, (i: [K, V]) => i[0], (i: [K, V]) => i[1]);
}

/**
 * Converts a collection of items into a mapping where the key is extracted by a given function and the items themselves are the values.
 * @param {T[]} items The items to convert into a mapping.
 * @param {(t: T) => K} key The key extractor function.
 * @returns {Mapping<K, T>} The created mapping.
 */
export function asKMap<T, K>(items: T[], key: (t: T) => K): Mapping<K, T> {
    return asMap(items, key, (t: T) => t);
}

/**
 * Converts a collection of items into a mapping where the items themselves are the keys and the value is extracted by a given function.
 * @param {T[]} items The items to convert into a mapping.
 * @param {(t: T) => V} value The value extractor function.
 * @returns {Mapping<T, V>} The created mapping.
 */
export function asVMap<T, V>(items: T[], value: (t: T) => V): Mapping<T, V> {
    return asMap(items, (t: T) => t, value);
}

/**
 * Converts a collection of keys into a lazy mapping that is only partially evaluated once if some key is requested.
 * @param {K[]} keys The valid keys for this mapping.
 * @param {(k: K) => V} value The value extractor function. This extractor is called at most once per key.
 * @returns {Mapping<K, V>} The created mapping.
 */
export function asLazyMap<K, V>(keys: K[], value: (k: K) => V): Mapping<K, V> {
    let map: Array<[K, () => V]> = keys.map((k: K) => [k, () => {
        let v: V = value(k);
        map.unshift([k, () => v]);
        return v;
    }] as [K, () => V]);
    return (k: K, fallback: V) => {
        let matching: Array<[K, () => V]> = map.filter((m: [K, () => V]) => m[0] === k);
        if (matching.length === 0) {
            return fallback;
        } else {
            return matching[0][1]();
        }
    };
}

/**
 * Applies a common fallback value to a constructed mapping. The user then doesn't have to care to pass this fallback value to every call.
 * @param {Mapping<K, V>} f The constructed mapping.
 * @param {V} fallback The fallback value in case the queried key isn't declared.
 * @returns {(TotalMapping<K, V>} The mapping with implicit fallback value.
 */
export function withDefault<K, V>(f: Mapping<K, V>, fallback: V): TotalMapping<K, V> {
    return (k: K) => f(k, fallback);
}

/**
 * Applies a common fallback value to a constructed mapping. The user then doesn't have to care to pass this fallback value to every call.
 * Uses a differently typed fallback value.
 * @param {Mapping<K, V>} f The constructed mapping.
 * @param {F} fallback The fallback value in case the queried key isn't declared.
 * @returns {(TotalMapping<K, V | F>} The mapping with implicit fallback value.
 */
export function withDefaultT<K, V, F>(f: Mapping<K, V>, fallback: F): TotalMapping<K, V | F> {
    return (k: K) => f(k, fallback as any);
}

/**
 * Tells the type checker that the fallback value isn't necessary and every access is made with a valid key.
 * Apply with care because this method circumvents the type checker and working on the return value for an unsupported key can break your code.
 * @param {Mapping<K, V>} f The constructed mapping.
 * @returns {TotalMapping<K, V>} The mapping with no fallback value.
 */
export function isTotal<K, V>(f: Mapping<K, V>): TotalMapping<K, V> {
    return withDefault(f, undefined as any);
}

/**
 * Given a collection of items that should each be mapped to a collection of results this function constructs a single result collection.
 * @param {ReadonlyArray<T>} array The items to map.
 * @param {(t: T) => R[]} op The mapping function that returns a collection for each given element.
 * @returns {R[]} The flattened resulting collection.
 */
export function flatMap<T, R>(array: ReadonlyArray<T>, op: (t: T) => R[]): R[] {
    return array.map(op).reduce((x: R[], y: R[]) => x.concat(y), []);
}

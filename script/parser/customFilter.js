define(["require", "exports", "./parser"], function (require, exports, parser_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Extractor that may be added as the last element of an extractor array to prevent cycling extraction.
     */
    exports.stopExtractor = {};
    /**
     * Builds a custom filter from a string-based rule.
     * @param {string} rule The rule to parse.
     * @returns {(o: CsvItem, e: Extractors) => boolean} The built filter.
     * @throws Error if given rule string wasn't parsable.
     */
    function parseCustomFilter(rule) {
        var f = new Function('o', 'e', t.toString() + n.toString() + r.toString() + b.toString() + 'var i = [];' + parser_1.parse(rule));
        return function (o, e) {
            if (!o)
                return true;
            if (e.length)
                return f(o, e);
            else
                return f(o, [exports.stopExtractor]);
        };
    }
    exports.parseCustomFilter = parseCustomFilter;
    /*
    m: matching predicate - checks whether the given value matches the expected value
    a: actual - the actual value(s) the field(s) contain
     */
    function t(o, f, v, n, e) {
        function m(a) {
            return n == (e ? (a == v) : ((a || "").indexOf(v) > -1));
        }
        var a = f ? [o.get(f)] : o.row;
        return (f || n) ? a.some(m) : a.every(m);
    }
    /*
    a: actual - the actual number value the field contains
     */
    function n(o, f, v, c) {
        var a = parseInt(o.get(f));
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
    function r(o, e, i, c, q, p) {
        var b = e[0][c] ? e[0][c](o) : [];
        var n = (c[0] === '+') ? e.map(function (_, i) { return e[(i + 1) % e.length]; }) :
            (c[0] === '-') ? e.map(function (_, i) { return e[(i + e.length - 1) % e.length]; }) : e;
        var l = b.length;
        var m = b.filter(function (o) { return p(o, n, i); }).length;
        function a(v) {
            return v[1] ? v[0] : (l - v[0]);
        }
        function r(f, t) {
            return (f <= m || t <= m) && (m <= f || m <= t);
        }
        function t(p, t) {
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
    function b(o, e, i, b, p) {
        var n = b.reduce(function (i, b) { i[b[0]] = o.get(b[1]); return i; }, i.slice());
        return p(o, e, n);
    }
});

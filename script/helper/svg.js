define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * This fle aids you when constructing an SVG graphic in code by providing easy to use wrapper for creating SVG elements.
     */
    /**
     * Create an SVG graphic based on attributes and contained elements.
     * @param {Index<string>} attr The attributes to set
     * @param {SVGElement} elements The elements this SVG should contain
     * @returns {SVGSVGElement} The constructed SVG graphic
     */
    function svg(attr) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        if (attr)
            attributeElement(svgEl, attr);
        attributeElement(svgEl, { version: '1.1', 'xmlns:xlink': 'http://www.w3.org/1999/xlink', xmlns: 'http://www.w3.org/2000/svg' });
        elements.forEach(function (e) { return svgEl.appendChild(e); });
        return svgEl;
    }
    exports.svg = svg;
    /**
     * Sets arbitrary attributes to the given element.
     * @param {SVGElement} element The element to attribute
     * @param {Index<string>} attributes The attributes to set
     * @returns {SVGElement} The modified element
     */
    function attributeElement(element, attributes) {
        for (var _i = 0, _a = Object.keys(attributes); _i < _a.length; _i++) {
            var key = _a[_i];
            element.setAttribute(key, attributes[key]);
        }
        return element;
    }
    exports.attributeElement = attributeElement;
    /**
     * Adds a clip-path attribute to an SVG element.
     * @param {SVGElement} element The element to use a clip-path
     * @param {string} clipPath The clip-path to use
     * @returns {SVGElement} The clipped element
     */
    function svgClip(element, clipPath) {
        return attributeElement(element, { 'clip-path': 'url(#' + clipPath + ')' });
    }
    exports.svgClip = svgClip;
    /**
     * Applies a string-based style to an element.
     * @param {SVGElement} element The element to style
     * @param {string} style The style to apply
     * @returns {SVGElement} The styled element
     */
    function svgStyle(element, style) {
        return attributeElement(element, { style: style });
    }
    exports.svgStyle = svgStyle;
    /**
     * Applies several given styling options to SVG Text elements.
     * @param {SVGElement} element The text element to style
     * @param {string} fontSize The font-size of this element
     * @param {string} fontWeight The font-weight of this element
     * @param {string} textAnchor The text-anchor of this element
     * @param {string} fill The fill color for this element
     * @returns {SVGElement} The styled element
     */
    function svgTextStyle(element, fontSize, fontWeight, textAnchor, fill) {
        var attr = { 'font-size': fontSize, 'font-weight': fontWeight, 'text-anchor': textAnchor };
        if (fill)
            attr['fill'] = fill;
        return attributeElement(element, attr);
    }
    exports.svgTextStyle = svgTextStyle;
    /**
     * Creates an SVG element and applies basic operations.
     * @param {string} type The type of element to create
     * @param {Index<string>} attr The attributes to set
     * @param {SVGElement} elements The elements this element should contain
     * @returns {SVGElement} The created element
     */
    function svgElement(type, attr) {
        var elements = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            elements[_i - 2] = arguments[_i];
        }
        var svgEl = document.createElementNS("http://www.w3.org/2000/svg", type);
        if (attr)
            attributeElement(svgEl, attr);
        elements.forEach(function (e) { return svgEl.appendChild(e); });
        return svgEl;
    }
    exports.svgElement = svgElement;
    /**
     * Creates a group of elements.
     * @param {string} x The x coordinate of this group
     * @param {string} y The y coordinate of this group
     * @param {string} transform A transformation to apply
     * @param {SVGElement} elements The elements this group is made from
     * @returns {SVGElement} The created group
     */
    function svgGroup(x, y, transform) {
        var elements = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            elements[_i - 3] = arguments[_i];
        }
        var attr = { x: x, y: y };
        if (transform)
            attr['transform'] = transform;
        var svgEl = svgElement('g', attr);
        elements.forEach(function (e) { return svgEl.appendChild(e); });
        return svgEl;
    }
    exports.svgGroup = svgGroup;
    /**
     * Creates a circle.
     * @param {string} cx The x coordinate of the center
     * @param {string} cy The y coordinate of the center
     * @param {string} r The radius
     * @returns {SVGElement} The created element
     */
    function svgCircle(cx, cy, r) {
        return svgElement('circle', { cx: cx, cy: cy, r: r });
    }
    exports.svgCircle = svgCircle;
    /**
     * Creates a clip-path.
     * @param {string} id The clip-path's id.
     * @param {SVGElement} elements The elements that define this clip-path
     * @returns {SVGElement} The created clip-path
     */
    function svgClipPath(id) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        return svgElement.apply(void 0, ['clipPath', { id: id }].concat(elements));
    }
    exports.svgClipPath = svgClipPath;
    /**
     * Creates an image.
     * @param {string} x The x coordinate
     * @param {string} y The y coordinate
     * @param {string} width The width
     * @param {string} height The height
     * @param {string} url The image's URL
     * @returns {SVGElement} The created element
     */
    function svgImage(x, y, width, height, url) {
        var svgEl = svgElement('image', { x: x, y: y, width: width, height: height });
        svgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
        return svgEl;
    }
    exports.svgImage = svgImage;
    /**
     * Creates a path.
     * @param {string} desc The path's description
     * @returns {SVGElement} The created element
     */
    function svgPath(desc) {
        return svgElement('path', { d: desc });
    }
    exports.svgPath = svgPath;
    /**
     * Creates a polygon.
     * @param {string} points The points of this polygon
     * @returns {SVGElement} The created element
     */
    function svgPolygon(points) {
        return svgElement('polygon', { points: points });
    }
    exports.svgPolygon = svgPolygon;
    /**
     * Creates a rectangle.
     * @param {string} x The x coordinate
     * @param {string} y The y coordinate
     * @param {string} width The width
     * @param {string} height The height
     * @param {string} rx The amount of x-rounding the corners should have
     * @param {string} ry The amount of y-rounding the corners should have
     * @returns {SVGElement} The created element
     */
    function svgRect(x, y, width, height, rx, ry) {
        var attr = { x: x, y: y, width: width, height: height };
        if (rx)
            attr['rx'] = rx;
        if (ry)
            attr['ry'] = ry;
        return svgElement('rect', attr);
    }
    exports.svgRect = svgRect;
    /**
     * Creates a text element from given text lines.
     * @param {string} x The x coordinate
     * @param {string} y The y coordinate
     * @param {SVGElement} lines The lines this text element is made from
     * @returns {SVGElement} The created element
     */
    function svgTextFromLines(x, y) {
        var lines = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            lines[_i - 2] = arguments[_i];
        }
        return svgElement.apply(void 0, ['text', { x: x, y: y }].concat(lines));
    }
    exports.svgTextFromLines = svgTextFromLines;
    /**
     * Creates a text element.
     * @param {string} x The x coordinate
     * @param {string} y The y coordinate
     * @param {string} content The element's content
     * @returns {SVGElement} The created element
     */
    function svgText(x, y, content) {
        return svgTextFromLines(x, y, svgTSpan(content));
    }
    exports.svgText = svgText;
    /**
     * Creates a text line element.
     * @param {string} text The line's content
     * @param {[boolean , string]} x The x coordinate of the line, if x[0], x[1] is a delta-coordinate
     * @param {[boolean , string]} y The y coordinate of the line, if y[0], y[1] is a delta-coordinate
     * @returns {SVGElement} The created element
     */
    function svgTSpan(text, x, y) {
        var svgEl = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        svgEl.textContent = text;
        if (x)
            svgEl.setAttribute(x[0] ? 'dx' : 'x', x[1]);
        if (y)
            svgEl.setAttribute(y[0] ? 'dy' : 'y', y[1]);
        return svgEl;
    }
    exports.svgTSpan = svgTSpan;
});

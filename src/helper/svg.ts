import {Index} from "./csv";

/**
 * This fle aids you when constructing an SVG graphic in code by providing easy to use wrapper for creating SVG elements.
 */

/**
 * Create an SVG graphic based on attributes and contained elements.
 * @param {Index<string>} attr The attributes to set
 * @param {SVGElement} elements The elements this SVG should contain
 * @returns {SVGSVGElement} The constructed SVG graphic
 */
export function svg(attr?: Index<string>, ...elements: SVGElement[]): SVGSVGElement {
    let svgEl: SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    if (attr)
        attributeElement(svgEl, attr);
    attributeElement(svgEl, { version:'1.1', 'xmlns:xlink':'http://www.w3.org/1999/xlink', xmlns:'http://www.w3.org/2000/svg' });
    elements.forEach((e: SVGElement) => svgEl.appendChild(e));
    return svgEl;
}

/**
 * Sets arbitrary attributes to the given element.
 * @param {SVGElement} element The element to attribute
 * @param {Index<string>} attributes The attributes to set
 * @returns {SVGElement} The modified element
 */
export function attributeElement(element: SVGElement, attributes: Index<string>): SVGElement {
    for (let key of Object.keys(attributes)) {
        element.setAttribute(key, attributes[key]);
    }
    return element;
}

/**
 * Adds a clip-path attribute to an SVG element.
 * @param {SVGElement} element The element to use a clip-path
 * @param {string} clipPath The clip-path to use
 * @returns {SVGElement} The clipped element
 */
export function svgClip(element: SVGElement, clipPath: string): SVGElement {
    return attributeElement(element, { 'clip-path':'url(#'+clipPath+')' });
}

/**
 * Applies a string-based style to an element.
 * @param {SVGElement} element The element to style
 * @param {string} style The style to apply
 * @returns {SVGElement} The styled element
 */
export function svgStyle(element: SVGElement, style: string): SVGElement {
    return attributeElement(element, { style:style });
}

/**
 * Applies several given styling options to SVG Text elements.
 * @param {SVGElement} element The text element to style
 * @param {string} fontSize The font-size of this element
 * @param {string} fontWeight The font-weight of this element
 * @param {string} textAnchor The text-anchor of this element
 * @param {string} fill The fill color for this element
 * @returns {SVGElement} The styled element
 */
export function svgTextStyle(element: SVGElement, fontSize: string, fontWeight: string, textAnchor: string, fill?: string): SVGElement {
    let attr: Index<string> = { 'font-size':fontSize, 'font-weight':fontWeight, 'text-anchor':textAnchor };
    if (fill)
        attr['fill'] = fill;
    return attributeElement(element, attr)
}

/**
 * Creates an SVG element and applies basic operations.
 * @param {string} type The type of element to create
 * @param {Index<string>} attr The attributes to set
 * @param {SVGElement} elements The elements this element should contain
 * @returns {SVGElement} The created element
 */
export function svgElement(type: string, attr?: Index<string>, ...elements: SVGElement[]): SVGElement {
    let svgEl: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", type);
    if (attr)
        attributeElement(svgEl, attr);
    elements.forEach((e: SVGElement) => svgEl.appendChild(e));
    return svgEl;
}

/**
 * Creates a group of elements.
 * @param {string} x The x coordinate of this group
 * @param {string} y The y coordinate of this group
 * @param {string} transform A transformation to apply
 * @param {SVGElement} elements The elements this group is made from
 * @returns {SVGElement} The created group
 */
export function svgGroup(x: string, y: string, transform?: string, ...elements: SVGElement[]): SVGElement {
    let attr: Index<string> = { x:x, y:y };
    if (transform)
        attr['transform'] = transform;
    let svgEl: SVGElement = svgElement('g', attr);
    elements.forEach((e: SVGElement) => svgEl.appendChild(e));
    return svgEl;
}

/**
 * Creates a circle.
 * @param {string} cx The x coordinate of the center
 * @param {string} cy The y coordinate of the center
 * @param {string} r The radius
 * @returns {SVGElement} The created element
 */
export function svgCircle(cx: string, cy: string, r: string): SVGElement {
    return svgElement('circle', { cx:cx, cy:cy, r:r });
}

/**
 * Creates a clip-path.
 * @param {string} id The clip-path's id.
 * @param {SVGElement} elements The elements that define this clip-path
 * @returns {SVGElement} The created clip-path
 */
export function svgClipPath(id: string, ...elements: SVGElement[]): SVGElement {
    return svgElement('clipPath', { id:id }, ...elements);
}

/**
 * Creates an image.
 * @param {string} x The x coordinate
 * @param {string} y The y coordinate
 * @param {string} width The width
 * @param {string} height The height
 * @param {string} url The image's URL
 * @returns {SVGElement} The created element
 */
export function svgImage(x: string, y: string, width: string, height: string, url: string): SVGElement {
    let svgEl: SVGElement = svgElement('image', { x:x, y:y, width:width, height:height });
    svgEl.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
    return svgEl;
}

/**
 * Creates a path.
 * @param {string} desc The path's description
 * @returns {SVGElement} The created element
 */
export function svgPath(desc: string): SVGElement {
    return svgElement('path', { d:desc });
}

/**
 * Creates a polygon.
 * @param {string} points The points of this polygon
 * @returns {SVGElement} The created element
 */
export function svgPolygon(points: string): SVGElement {
    return svgElement('polygon', { points:points });
}

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
export function svgRect(x: string, y: string, width: string, height: string, rx?: string, ry?: string): SVGElement {
    let attr: Index<string> = { x:x, y:y, width:width, height:height };
    if (rx)
        attr['rx'] = rx;
    if (ry)
        attr['ry'] = ry;
    return svgElement('rect', attr);
}

/**
 * Creates a text element from given text lines.
 * @param {string} x The x coordinate
 * @param {string} y The y coordinate
 * @param {SVGElement} lines The lines this text element is made from
 * @returns {SVGElement} The created element
 */
export function svgTextFromLines(x: string, y: string, ...lines: SVGElement[]): SVGElement {
    return svgElement('text', { x:x, y:y }, ...lines);
}

/**
 * Creates a text element.
 * @param {string} x The x coordinate
 * @param {string} y The y coordinate
 * @param {string} content The element's content
 * @returns {SVGElement} The created element
 */
export function svgText(x: string, y: string, content: string): SVGElement {
    return svgTextFromLines(x, y, svgTSpan(content));
}

/**
 * Creates a text line element.
 * @param {string} text The line's content
 * @param {[boolean , string]} x The x coordinate of the line, if x[0], x[1] is a delta-coordinate
 * @param {[boolean , string]} y The y coordinate of the line, if y[0], y[1] is a delta-coordinate
 * @returns {SVGElement} The created element
 */
export function svgTSpan(text: string, x?: [boolean, string], y?: [boolean, string]): SVGElement {
    let svgEl: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    svgEl.textContent = text;
    if (x)
        svgEl.setAttribute(x[0] ? 'dx' : 'x', x[1]);
    if (y)
        svgEl.setAttribute(y[0] ? 'dy' : 'y', y[1]);
    return svgEl;
}

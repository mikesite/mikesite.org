/**
 * Defines functionality that constructs HTMLElements dynamically.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    /**
     * Creates an anchor to move the page's focus.
     * @param {string} id The id of this anchor.
     * @returns {HTMLAnchorElement} The constructed HTMLElement.
     */
    function anchor(id) {
        var anchor = document.createElement('A');
        anchor.id = id;
        anchor.classList.add('anchor');
        return anchor;
    }
    exports.anchor = anchor;
    /**
     * Creates a link that moves the page's focus to an anchor.
     * @param {string} id The anchor's id.
     * @param {string | HTMLElement} label The link's label.
     * @returns {HTMLAnchorElement} The constructed HTMLElement.
     */
    function toAnchor(id, label) {
        if (label === void 0) { label = id; }
        var toAnchor = document.createElement('A');
        toAnchor.href = '#' + id;
        if (typeof label === 'string') {
            toAnchor.text = label;
        }
        else {
            toAnchor.appendChild(label);
        }
        return toAnchor;
    }
    exports.toAnchor = toAnchor;
    /**
     * Creates a checkbox.
     * @returns {HTMLInputElement} The constructed HTMLElement.
     */
    function checkbox() {
        var checkbox = document.createElement('INPUT');
        checkbox.type = 'checkbox';
        return checkbox;
    }
    exports.checkbox = checkbox;
    /**
     * Creates a link to an external page.
     * @param {string} target The link's target URL.
     * @param {string | HTMLElement} label The display text for this link.
     * @param {boolean} newTab Whether the target should be opened in a new tab.
     * @returns {HTMLAnchorElement} The constructed HTMLElement.
     */
    function href(target, label, newTab) {
        if (newTab === void 0) { newTab = false; }
        var href = document.createElement('A');
        href.href = target;
        if (newTab) {
            href.target = '_blank';
        }
        if (typeof label === 'string') {
            href.text = label;
        }
        else {
            href.appendChild(label);
        }
        return href;
    }
    exports.href = href;
    /**
     * Creates a text-element with the given content.
     * @param {string} content The text to display.
     * @returns {HTMLElement} The constructed HTMLElement.
     */
    function text(content) {
        var text = document.createElement('SPAN');
        text.innerText = content;
        return text;
    }
    exports.text = text;
    /**
    * Appends the given text as child to the given element.
    * @param {HTMLElement} el The parent element of the given text.
    * @param {string | HTMLElement} txt The text to append.
    * @returns {HTMLElement} The given element with a new child.
    */
    function appendTextChild(el, txt) {
        if (typeof txt === 'string') {
            el.appendChild(text(txt));
        }
        else {
            el.appendChild(txt);
        }
        return el;
    }
    exports.appendTextChild = appendTextChild;
    /**
     * Puts the given text in bold style.
     * @param {string | HTMLElement} content The text to format.
     * @returns {HTMLElement} The formatted text.
     */
    function bold(content) {
        return appendTextChild(document.createElement('B'), content);
    }
    exports.bold = bold;
    /**
     * Creates a header-element with the given content.
     * @param {number} level The level of header to create.
     * @param {string | HTMLElement} content The content of the header.
     * @returns {HTMLElement} The constructed HTMLElement.
     */
    function header(level, content) {
        return appendTextChild(document.createElement('H' + level), content);
    }
    exports.header = header;
    /**
     * Puts the given text in italic style.
     * @param {string | HTMLElement} content The text to format.
     * @returns {HTMLElement} The formatted text.
     */
    function italic(content) {
        return appendTextChild(document.createElement('I'), content);
    }
    exports.italic = italic;
    /**
     * Adds a label to a checkbox element.
     * @param {HTMLInputElement} checkbox The checkbox to add a label to.
     * @param {string | HTMLElement} label The text to label the checkbox with.
     * @returns {HTMLElement} The constructed HTMLElement.
     */
    function addLabel(checkbox, label) {
        var labelElement = document.createElement('LABEL');
        labelElement.appendChild(checkbox);
        return appendTextChild(labelElement, label);
    }
    exports.addLabel = addLabel;
    /**
     * Prevents text-based elements from being broken into several lines.
     * @param {T} element The element to protect against line breaks.
     * @returns {T} The constructed HTMLElement.
     */
    function notBreakable(element) {
        element.classList.add('no-break');
        return element;
    }
    exports.notBreakable = notBreakable;
    /**
     * Removes all children of the given element and afterwards adds all given elements as new children.
     * @param {HTMLElement} element The element to process.
     * @param {Element[]} newChildren The elements to add as children.
     */
    function replaceAllChildren(element, newChildren) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        newChildren.forEach(function (child) { return element.appendChild(child); });
    }
    exports.replaceAllChildren = replaceAllChildren;
});

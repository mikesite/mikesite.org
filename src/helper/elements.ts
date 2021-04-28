/**
 * Defines functionality that constructs HTMLElements dynamically.
 */

/**
 * Creates an anchor to move the page's focus.
 * @param {string} id The id of this anchor.
 * @returns {HTMLAnchorElement} The constructed HTMLElement.
 */
export function anchor(id: string): HTMLAnchorElement {
    let anchor: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
    anchor.id = id;
    anchor.classList.add('anchor');
    return anchor
}

/**
 * Creates a link that moves the page's focus to an anchor.
 * @param {string} id The anchor's id.
 * @param {string | HTMLElement} label The link's label.
 * @returns {HTMLAnchorElement} The constructed HTMLElement.
 */
export function toAnchor(id: string, label: string | HTMLElement = id): HTMLAnchorElement {
    let toAnchor: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
    toAnchor.href = '#' + id;
    if (typeof label === 'string') {
        toAnchor.text = label;
    } else {
        toAnchor.appendChild(label);
    }
    return toAnchor;
}

/**
 * Creates a checkbox.
 * @returns {HTMLInputElement} The constructed HTMLElement.
 */
export function checkbox(): HTMLInputElement {
    let checkbox: HTMLInputElement = document.createElement('INPUT') as HTMLInputElement;
    checkbox.type = 'checkbox';
    return checkbox;
}

/**
 * Creates a link to an external page.
 * @param {string} target The link's target URL.
 * @param {string | HTMLElement} label The display text for this link.
 * @param {boolean} newTab Whether the target should be opened in a new tab.
 * @returns {HTMLAnchorElement} The constructed HTMLElement.
 */
export function href(target: string, label: string | HTMLElement, newTab: boolean = false): HTMLAnchorElement {
    let href: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
    href.href = target;
    if (newTab) {
        href.target = '_blank';
    }
    if (typeof label === 'string') {
        href.text = label;
    } else {
        href.appendChild(label);
    }
    return href;
}

/**
 * Creates a text-element with the given content.
 * @param {string} content The text to display.
 * @returns {HTMLElement} The constructed HTMLElement.
 */
export function text(content: string): HTMLElement {
    let text: HTMLElement = document.createElement('SPAN');
    text.innerText = content;
    return text;
}

/**
* Appends the given text as child to the given element.
* @param {HTMLElement} el The parent element of the given text.
* @param {string | HTMLElement} txt The text to append.
* @returns {HTMLElement} The given element with a new child.
*/
export function appendTextChild(el: HTMLElement, txt: string | HTMLElement): HTMLElement {
   if (typeof txt === 'string') {
       el.appendChild(text(txt));
   } else {
       el.appendChild(txt);
   }
   return el;
}

/**
 * Puts the given text in bold style.
 * @param {string | HTMLElement} content The text to format.
 * @returns {HTMLElement} The formatted text.
 */
export function bold(content: string | HTMLElement): HTMLElement {
    return appendTextChild(document.createElement('B'), content);
}

/**
 * Creates a header-element with the given content.
 * @param {number} level The level of header to create.
 * @param {string | HTMLElement} content The content of the header.
 * @returns {HTMLElement} The constructed HTMLElement.
 */
export function header(level: number, content: string | HTMLElement): HTMLElement {
    return appendTextChild(document.createElement('H' + level), content);
}

/**
 * Puts the given text in italic style.
 * @param {string | HTMLElement} content The text to format.
 * @returns {HTMLElement} The formatted text.
 */
export function italic(content: string | HTMLElement): HTMLElement {
    return appendTextChild(document.createElement('I'), content);
}

/**
 * Adds a label to a checkbox element.
 * @param {HTMLInputElement} checkbox The checkbox to add a label to.
 * @param {string | HTMLElement} label The text to label the checkbox with.
 * @returns {HTMLElement} The constructed HTMLElement.
 */
export function addLabel(checkbox: HTMLInputElement, label: string | HTMLElement): HTMLElement {
    let labelElement: HTMLElement = document.createElement('LABEL');
    labelElement.appendChild(checkbox);
    return appendTextChild(labelElement, label);
}

/**
 * Prevents text-based elements from being broken into several lines.
 * @param {T} element The element to protect against line breaks.
 * @returns {T} The constructed HTMLElement.
 */
export function notBreakable<T extends HTMLElement>(element: T): T {
    element.classList.add('no-break');
    return element;
}

/**
 * Removes all children of the given element and afterwards adds all given elements as new children.
 * @param {HTMLElement} element The element to process.
 * @param {Element[]} newChildren The elements to add as children.
 */
export function replaceAllChildren(element: HTMLElement, newChildren: Element[]): void {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
    newChildren.forEach((child: Element) => element.appendChild(child));
}

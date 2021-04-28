import {getQualifiedName, rarityNameSort} from "../ch/equipment";
import {CsvItem, textSort}                from "../helper/csv";
import {replaceAllChildren, text}         from "../helper/elements";
import {fieldSort, groupBy, sum}          from "../helper/functional";

/**
 * Capsules functionality to dynamically create HTMLElements to represent excessing items.
 */

/**
 * Defines a type that represents excess in some generic way.
 * The first element of this tuple is the Equipment-information,
 * the second part describes the amount but can be further differentiated.
 * If the sum of this amount array is positive the Equipment is assumed to be exceeding some limit.
 */
export type ExcessItem = [CsvItem, number[]]

/**
 * Constructs an HTMLElement containing the overall value of the given elements.
 * @param {Array<ExcessItem>} content The items to analyze.
 * @param {(i: ExcessItem) => number} costFunction The function computing the value of a single item.
 * @returns {HTMLElement} The text-element representing the overall value.
 */
function getValue(content: Array<ExcessItem>, costFunction: (i: ExcessItem) => number): HTMLElement {
    return text(content.map((i: ExcessItem) => costFunction(i)).reduce(sum, 0) + ' Gold');
}

/**
 * Accepts a collection of Equipment-items exceeding some limit and formats them in a HTML-representable style.
 * @param {HTMLElement} parent The element the constructed element should be added to. All existing children of this element are removed in this process.
 * @param {Array<ExcessItem>} content The items to format and show.
 * @param {(i: ExcessItem) => number} costFunction The function computing the value of a single item.
 * @param {string} valueKind Describes the kind of value that the items have. Usually either 'Value' (for items that could be sold) or 'Cost' (for items that could be bought).
 */
export function formatExcess(parent: HTMLElement, content: Array<ExcessItem>, costFunction: (i: ExcessItem) => number, valueKind: string = 'Value'): void {
    let table: HTMLTableElement = document.createElement('table') as HTMLTableElement;
    table.classList.add('excess');
    table.cellSpacing = '0';

    content = content.filter((i: ExcessItem) => i[1].reduce(sum, 0) > 0);

    let head: HTMLTableRowElement = table.createTHead().insertRow();
    head.insertCell().appendChild(text('Total ' + valueKind + ':'));
    head.insertCell().appendChild(getValue(content, costFunction));

    let body: HTMLTableSectionElement = table.createTBody();

    let slots: [string[], (s: string) => Array<ExcessItem>] = groupBy(content, (i: ExcessItem) => i[0].get('Slot'));
    slots[0].sort();

    for (let slot of slots[0]) {
        let slotRow: HTMLTableRowElement = body.insertRow();
        slotRow.classList.add('slot');
        slotRow.insertCell().appendChild(text(slot));
        slotRow.insertCell().appendChild(getValue(slots[1](slot), costFunction));

        let rarities: [string[], (r: string) => Array<ExcessItem>] = groupBy(slots[1](slot), (i: ExcessItem) => i[0].get('Rarity'));
        rarities[0].sort(rarityNameSort);

        for (let rarity of rarities[0]) {
            let rarityRow: HTMLTableRowElement = body.insertRow();
            rarityRow.classList.add('rarity');
            rarityRow.insertCell().appendChild(text(rarity));
            rarityRow.insertCell().appendChild(getValue(rarities[1](rarity), costFunction));

            let items: Array<ExcessItem> = rarities[1](rarity).sort(fieldSort((i: ExcessItem) => i[0], textSort('Equipment Name')));

            items.forEach((item: ExcessItem) => {
                let itemRow: HTMLTableRowElement = body.insertRow();
                itemRow.classList.add('item');
                itemRow.insertCell().appendChild(text(getQualifiedName(item[0])));
                itemRow.insertCell().appendChild(text(item[1].reduce(sum, 0) + 'x'));
            });
        }
    }

    replaceAllChildren(parent, [table]);
}

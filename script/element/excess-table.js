define(["require", "exports", "../ch/equipment", "../helper/csv", "../helper/elements", "../helper/functional"], function (require, exports, equipment_1, csv_1, elements_1, functional_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Constructs an HTMLElement containing the overall value of the given elements.
     * @param {Array<ExcessItem>} content The items to analyze.
     * @param {(i: ExcessItem) => number} costFunction The function computing the value of a single item.
     * @returns {HTMLElement} The text-element representing the overall value.
     */
    function getValue(content, costFunction) {
        return elements_1.text(content.map(function (i) { return costFunction(i); }).reduce(functional_1.sum, 0) + ' Gold');
    }
    /**
     * Accepts a collection of Equipment-items exceeding some limit and formats them in a HTML-representable style.
     * @param {HTMLElement} parent The element the constructed element should be added to. All existing children of this element are removed in this process.
     * @param {Array<ExcessItem>} content The items to format and show.
     * @param {(i: ExcessItem) => number} costFunction The function computing the value of a single item.
     * @param {string} valueKind Describes the kind of value that the items have. Usually either 'Value' (for items that could be sold) or 'Cost' (for items that could be bought).
     */
    function formatExcess(parent, content, costFunction, valueKind) {
        if (valueKind === void 0) { valueKind = 'Value'; }
        var table = document.createElement('table');
        table.classList.add('excess');
        table.cellSpacing = '0';
        content = content.filter(function (i) { return i[1].reduce(functional_1.sum, 0) > 0; });
        var head = table.createTHead().insertRow();
        head.insertCell().appendChild(elements_1.text('Total ' + valueKind + ':'));
        head.insertCell().appendChild(getValue(content, costFunction));
        var body = table.createTBody();
        var slots = functional_1.groupBy(content, function (i) { return i[0].get('Slot'); });
        slots[0].sort();
        for (var _i = 0, _a = slots[0]; _i < _a.length; _i++) {
            var slot = _a[_i];
            var slotRow = body.insertRow();
            slotRow.classList.add('slot');
            slotRow.insertCell().appendChild(elements_1.text(slot));
            slotRow.insertCell().appendChild(getValue(slots[1](slot), costFunction));
            var rarities = functional_1.groupBy(slots[1](slot), function (i) { return i[0].get('Rarity'); });
            rarities[0].sort(equipment_1.rarityNameSort);
            for (var _b = 0, _c = rarities[0]; _b < _c.length; _b++) {
                var rarity = _c[_b];
                var rarityRow = body.insertRow();
                rarityRow.classList.add('rarity');
                rarityRow.insertCell().appendChild(elements_1.text(rarity));
                rarityRow.insertCell().appendChild(getValue(rarities[1](rarity), costFunction));
                var items = rarities[1](rarity).sort(functional_1.fieldSort(function (i) { return i[0]; }, csv_1.textSort('Equipment Name')));
                items.forEach(function (item) {
                    var itemRow = body.insertRow();
                    itemRow.classList.add('item');
                    itemRow.insertCell().appendChild(elements_1.text(equipment_1.getQualifiedName(item[0])));
                    itemRow.insertCell().appendChild(elements_1.text(item[1].reduce(functional_1.sum, 0) + 'x'));
                });
            }
        }
        elements_1.replaceAllChildren(parent, [table]);
    }
    exports.formatExcess = formatExcess;
});

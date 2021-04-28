define(["require", "exports", "../ch/csvHandling", "../ch/equipment", "../helper/csv", "../helper/elements", "../helper/event", "../helper/functional", "../helper/map", "../helper/string"], function (require, exports, csvHandling_1, equipment_1, csv_1, elements_1, event_1, functional_1, map_1, string_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        function generateItemFilter() {
            function generateFilter(slots) {
                return function (item) { return slots.indexOf(item.get('Slot')) >= 0; };
            }
            var raceIndex = document.getElementById('raceOption').selectedIndex;
            var races = (raceIndex === 0) ? [] : ((raceIndex > 3) ? ['Dwarf Skill', 'Elf Skill', 'Human Skill'] :
                [document.getElementById('raceOption').value + " Skill"]);
            var raceFilter = generateFilter(races);
            var classEquipment = {
                'Warrior': ['Weapon', 'Heavy Armor', 'Helmet', 'Martial Skill', 'Shield', 'Boots'],
                'Wizard': ['Staff', 'Robes', 'Arcane Item', 'Arcane Skill', 'Boots'],
                'Priest': ['Divine Weapon', 'Divine Armor', 'Divine Item', 'Divine Skill', 'Shield', 'Boots']
            };
            var classFilter = generateFilter(classEquipment[document.getElementById('classOption').value]);
            return functional_1.and(functional_1.not(functional_1.or(equipment_1.slotDefaultFilter, equipment_1.noLootFilter, equipment_1.specialItemFilter, equipment_1.seasonalItemFilter)), functional_1.or(classFilter, raceFilter));
        }
        var itemData = csv_1.parseRawCsvData(csvHandling_1.loadCsvContent('equipmentData'));
        var cardMap = map_1.isTotal(map_1.asKMap(csv_1.parseCsvData(csvHandling_1.loadCsvContent('cardData')), csv_1.getter('Card Name')));
        var qualities = [['Gold', 'A'], ['Silver', 'B'], ['Bronze', 'C'], ['Paper', 'D'], ['Black', 'E']];
        var cardFields = itemData[0].filter(string_1.startsWith('Card '));
        var cardExtractor = function (i) { return cardFields.map(function (h) { return i.get(h); }); };
        function formatTypeClasses(c) {
            var types = c.get("Types").toLowerCase();
            if (string_1.includes(',')(types)) {
                var hybrid = types.split(/,/);
                return ["l_" + hybrid[0], "r_" + hybrid[1]];
            }
            else {
                return [types];
            }
        }
        document.getElementById('bProcess').addEventListener('click', function () {
            try {
                var items = itemData[1].filter(generateItemFilter());
                var cards_1 = map_1.flatMap(items, cardExtractor).filter(function (i) { return i; });
                var pool = cards_1.filter(functional_1.distinct()).map(cardMap);
                var cardQuantity_1 = function (c) { return cards_1.filter(function (cc) { return cc === c; }).length; };
                pool.sort(functional_1.stageSort(functional_1.fieldSort(functional_1.compose(csv_1.getter('Card Name'), cardQuantity_1), function (c1, c2) { return c2 - c1; }), csv_1.textSort('Card Name')));
                var poolByQuality_1 = functional_1.groupBy(pool, csv_1.getter('Quality'))[1];
                var poolQuantity_1 = function (q) { return poolByQuality_1(q).map(csv_1.getter('Card Name')).map(cardQuantity_1).reduce(functional_1.sum, 0); };
                var div_1 = document.getElementById('results');
                while (div_1.firstChild) {
                    div_1.removeChild(div_1.firstChild);
                }
                qualities.forEach(function (q) {
                    div_1.appendChild(elements_1.header(3, q[0]));
                    var qualityTable = document.createElement('TABLE');
                    qualityTable.classList.add('cards');
                    poolByQuality_1(q[1]).forEach(function (c) {
                        var _a;
                        var name = c.get('Card Name');
                        var cardRow = qualityTable.insertRow();
                        var cardName = cardRow.insertCell();
                        (_a = cardName.classList).add.apply(_a, ['types'].concat(formatTypeClasses(c)));
                        cardName.appendChild(elements_1.text(name));
                        cardRow.insertCell().appendChild(elements_1.text(Math.round(10000 * cardQuantity_1(name) / poolQuantity_1(q[1])) / 100 + ' %'));
                    });
                    div_1.appendChild(qualityTable);
                    div_1.appendChild(document.createElement('BR'));
                });
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

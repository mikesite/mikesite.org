import {loadCsvContent}                                                           from "../ch/csvHandling";
import {noLootFilter, seasonalItemFilter, slotDefaultFilter, specialItemFilter}   from "../ch/equipment";
import {CsvItem, CsvMap, getter, Index, parseCsvData, parseRawCsvData, textSort}  from "../helper/csv";
import {header, text}                                                             from "../helper/elements";
import {whenReady}                                                                from "../helper/event";
import {and, compose, distinct, fieldSort, groupBy, not, or, stageSort, sum}      from "../helper/functional";
import {asKMap, flatMap, isTotal}                                                 from "../helper/map";
import {includes, startsWith}                                                     from "../helper/string";

whenReady(() => {
    function generateItemFilter(): (i: CsvItem) => boolean {
        function generateFilter(slots: string[]): (i: CsvItem) => boolean {
            return (item: CsvItem) => slots.indexOf(item.get('Slot')) >= 0;
        }
        let raceIndex: number = (document.getElementById('raceOption') as HTMLSelectElement).selectedIndex;
        let races: string[] = (raceIndex === 0) ? [] : ((raceIndex > 3) ? ['Dwarf Skill', 'Elf Skill', 'Human Skill'] :
            [(document.getElementById('raceOption') as HTMLSelectElement).value + " Skill"])
        let raceFilter: (i: CsvItem) => boolean = generateFilter(races);
        let classEquipment: Index<string[]> = {
            'Warrior': ['Weapon', 'Heavy Armor', 'Helmet', 'Martial Skill', 'Shield', 'Boots'],
            'Wizard': ['Staff', 'Robes', 'Arcane Item', 'Arcane Skill', 'Boots'],
            'Priest': ['Divine Weapon', 'Divine Armor', 'Divine Item', 'Divine Skill', 'Shield', 'Boots']
        };
        let classFilter: (i: CsvItem) => boolean = generateFilter(classEquipment[(document.getElementById('classOption') as HTMLSelectElement).value]);

        return and(not(or(slotDefaultFilter, noLootFilter, specialItemFilter, seasonalItemFilter)), or(classFilter, raceFilter));
    }

    let itemData: [string[], CsvItem[]] = parseRawCsvData(loadCsvContent('equipmentData'));
    let cardMap: CsvMap = isTotal(asKMap(parseCsvData(loadCsvContent('cardData')), getter('Card Name')));
    const qualities: [string, string][] = [['Gold', 'A'], ['Silver', 'B'], ['Bronze', 'C'], ['Paper', 'D'], ['Black', 'E']];
    const cardFields: string[] = itemData[0].filter(startsWith('Card '));
    let cardExtractor: (i: CsvItem) => string[] = (i: CsvItem) => cardFields.map((h:string) => i.get(h));

    function formatTypeClasses(c: CsvItem): string[] {
        let types: string = c.get("Types").toLowerCase();
        if (includes(',')(types)) {
            let hybrid: string[] = types.split(/,/);
            return ["l_" + hybrid[0], "r_" + hybrid[1]];
        } else {
            return [types];
        }
    }

    document.getElementById('bProcess')!.addEventListener('click', () => {
        try {
            let items: CsvItem[] = itemData[1].filter(generateItemFilter());
            let cards: string[] = flatMap(items, cardExtractor).filter((i: string) => i);
            let pool: CsvItem[] = cards.filter(distinct()).map(cardMap);
            let cardQuantity: (c: string) => number = (c: string) => cards.filter((cc: string) => cc === c).length;
            pool.sort(stageSort(fieldSort(compose(getter('Card Name'), cardQuantity), (c1: number, c2: number) => c2 - c1), textSort('Card Name')));
            let poolByQuality: (q: string) => CsvItem[] = groupBy(pool, getter('Quality'))[1];
            let poolQuantity: (q: string) => number = (q: string) => poolByQuality(q).map(getter('Card Name')).map(cardQuantity).reduce(sum, 0);

            let div: HTMLElement = document.getElementById('results')!;
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }
            qualities.forEach((q: [string, string]) => {
                div.appendChild(header(3, q[0]));
                let qualityTable: HTMLTableElement = document.createElement('TABLE') as HTMLTableElement;
                qualityTable.classList.add('cards');
                poolByQuality(q[1]).forEach((c: CsvItem) => {
                    let name: string = c.get('Card Name');
                    let cardRow: HTMLTableRowElement = qualityTable.insertRow();
                    let cardName: HTMLTableCellElement = cardRow.insertCell();
                    cardName.classList.add('types', ...formatTypeClasses(c));
                    cardName.appendChild(text(name));
                    cardRow.insertCell().appendChild(text(Math.round(10000 * cardQuantity(name) / poolQuantity(q[1])) / 100 + ' %'));
                });
                div.appendChild(qualityTable);
                div.appendChild(document.createElement('BR'));
            });
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

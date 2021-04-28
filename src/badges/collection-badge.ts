import {getTeamMaxUsableItemCount}                                              from "../ch/archetype";
import {SETS, STYLE_SCHEMES, svgBadge}                                          from "../ch/badges";
import {parseCollection}                                                        from "../ch/console";
import {noLootFilter, seasonalItemFilter, slotDefaultFilter, specialItemFilter} from "../ch/equipment";
import {loadCsvContent}                                                         from "../ch/csvHandling";
import {CsvItem, getter, Index, intGetter, parseCsvData}                        from "../helper/csv";
import {whenReady}                                                              from "../helper/event";
import {and, array, cnst, compose, distinct, eql, not, or}                      from "../helper/functional";
import {svgPolygon, svgStyle}                                                   from "../helper/svg";

declare function canvg(canvas: HTMLCanvasElement, svg: string, options?: Index<boolean>): void

whenReady(() => {
    function generateItemFilter(): (i: CsvItem) => boolean {
        let noLoot: boolean = (document.getElementById("includeNoLoot") as HTMLInputElement).checked;
        let treasure: boolean = (document.getElementById("includeTreasure") as HTMLInputElement).checked;
        let gens: boolean[] = array(6, (gen: number) => (document.getElementById("includeGen" + gen) as HTMLInputElement).checked);
        let genFilter: (i: CsvItem) => boolean = (i: CsvItem) => gens[parseInt(i.get('Set'))];
        return and(genFilter, or(cnst(noLoot), not(or(noLootFilter, seasonalItemFilter))), or(cnst(treasure), compose(getter('Slot'), not(eql('Treasure')))));
    }

    function createBadge(pct: number, pcts: number[], style: Index<string>): SVGElement {
        return svgBadge(pcts, pct,
            array(SETS, (gen: number) => (document.getElementById("includeGen" + gen) as HTMLInputElement).checked),
            [(document.getElementById("includeTreasure") as HTMLInputElement).checked, [
                svgPolygon('5,10 0,3 2,0 8,0 10,3 5,10'),
                svgStyle(svgPolygon('5,10 2,3 5,0 8,3 5,10 5,3 2,0 0,3 10,3 8,0 5,3 5,10'), 'stroke-width:0.5;')
            ], 'fill:White;stroke:Grey;'],
            [(document.getElementById("includeNoLoot") as HTMLInputElement).checked, [
                svgPolygon('5,0.5 6.2,3.9 9.8,3.9 7,6.1 8,9.5 5,7.5 2,9.5 3,6.1 0.2,3.9 3.8,3.9 5,0.5')
            ], 'fill:Gold;stroke:Brown;'], style, true);
    }

    let itemData: CsvItem[] = parseCsvData(loadCsvContent("equipmentData")).filter(not(or(slotDefaultFilter, specialItemFilter)));

    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let items: CsvItem[] = itemData.filter(generateItemFilter());
            let collection: (i: CsvItem) => number = parseCollection((document.getElementById('taLogData') as HTMLTextAreaElement).value);
            let maxUsable: boolean = (document.getElementById('maxUsable') as HTMLInputElement).checked;
            let itemCount: (i: CsvItem) => number = maxUsable ? getTeamMaxUsableItemCount() : () => 1;
            let levels: CsvItem[][] = items.map(intGetter('Level')).filter(distinct()).sort((l1: number, l2: number) => l1 - l2).map(
                (l: number) => items.filter((i: CsvItem) => parseInt(i.get('Level')) === l));
            let isFull: (item: CsvItem) => boolean = (item: CsvItem) => collection(item) >= itemCount(item);
            let byLevel: number[] = levels.map((items: CsvItem[]) => items.filter(isFull).length / items.length);
            let total: number = items.length ? (items.filter(isFull).length / items.length) : 0;

            let badge: SVGElement = createBadge(total, byLevel, STYLE_SCHEMES[maxUsable ? 1 : 0]);
            let canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement;
            canvg(canvas, badge.outerHTML, { ignoreMouse: true, ignoreAnimation: true });
            document.getElementById("results")!.appendChild(canvas);
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

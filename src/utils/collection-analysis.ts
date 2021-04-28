import {parseCollection}                                                                  from "../ch/console";
import {cardAndItemExtractors, loadCsvContent}                                            from "../ch/csvHandling";
import {
    getQualifiedName, noLootFilter, rarityNameSort,
    seasonalItemFilter, slotDefaultFilter, specialItemFilter
}                                                                                         from "../ch/equipment";
import {Wiki}                                                                             from "../ch/wiki";
import {CsvItem, csvMap, getter, Index, intGetter, parseCsvData, parseRawCsvData, toCsv}  from "../helper/csv";
import {bold, header, italic, replaceAllChildren, text}                                   from "../helper/elements";
import {saveOnClick, whenReady}                                                           from "../helper/event";
import {
    and, array, cnst, compose, cond, condSort,
    distinct, eql, not, or, reverseSort, stageSort
}                                                                                         from "../helper/functional";
import {asKMap, flatMap, isTotal}                                                         from "../helper/map";
import {Extractors, parseCustomFilter}                                                    from "../parser/customFilter";

/**
 * Aspect of the analysis. Each aspect results in one table in the generated collection analysis report.
 * An aspect is typically a property of the items a player can collect. Therefore, each aspect classifies the items in some sense.
 * Each of those classes will be represented by a row in the aspect's table.
 * If - based on user-specified filtering - only one class remains in this aspect, the analysis may completely skip the aspect when reporting the results.
 * Components:
 * - aspect name (as shown as table header)
 * - classifier [optional]: extractor function applied to all items, if undefined a getter based on the aspect's name is used
 * - class sort policy [optional]: comparator to sort the classes/table-lines if the classes shouldn't be sorted alphabetically
 * - class name converter [optional]: if provided this function converts the class name as they are specified in the items into a more human-readable form that is displayed in the aspect's table.
 */
type AnalysisAspect = [string, ((o: CsvItem) => string) | undefined, ((v1: string, v2: string) => number) | undefined, ((v: string) => string) | undefined];

/**
 * Representation of an aspect's class. Hence, the data representation of a table line in the analysis report.
 * Components:
 * - class name both as specified in the items and as shown in the table. If the aspect doesn't provide a class name converter both names are identical
 * - all items of this class
 */
type AspectClass = [[string, string], CsvItem[]];

/**
 * Representation of an applied aspect class. This application causes the class to have accumulated statistics about the collection status of the contained items.
 * Components:
 * - class name both as specified in the items and as shown in the table. If the aspect doesn't provide a class name converter both names are identical
 * - all items of this class
 * - class statistics:
 *   - collection percentage [floored]
 *   - number of collected items
 *   - number of missing items
 *   - total number of items
 *   - notable items based on the 'list'-option with their count
 */
type AppliedAspectClass = [[string, string], CsvItem[], [number, number, number, number, Array<[number, CsvItem]>]];

type DomainElement = [AnalysisAspect | null, AppliedAspectClass[]];
type AnalysisDomain = Array<[AnalysisAspect | null, AppliedAspectClass[]]>;

/**
 * Describes the sorting of items in the hoverBox and the detail-page.
 */
type HoverBoxSorting = (i1: [number, CsvItem], i2: [number, CsvItem]) => number

/**
 * Describes the target item count and therefore the items to be selected for the hover box and their count.
 * Components:
 * - whether of not more than one copy per item is requested
 * - the function retrieving the target item count for an item
 * - collapsed count: an item is either fully collected (1) or not (0) in contrast to exact measurement (e.g. 4 out of 6)
 * - extractor for the number of items to be listed in the hover box
 */
type TargetItemCount = [boolean, (i: CsvItem) => number, boolean, (target: number, collected: number) => number];

/**
 * Describes the appearance of the HoverBox in terms of the shown items.
 * Components:
 * - number of max elements, if more element are present list one element less and show count of unlisted items
 * - target item count
 * - sorting policy
 */
type HoverBoxParameter = [number, TargetItemCount, HoverBoxSorting];

whenReady(() => {
    function generateItemFilter(): (i: CsvItem) => boolean {
        function ternary(index: number, only: (i: CsvItem) => boolean): (i: CsvItem) => boolean {
            return or(cnst(index == 1), cond(index > 1, only, not(only)));
        }
        let treasure: number = (document.getElementById("includeTreasure") as HTMLSelectElement).selectedIndex;
        let promo: number = (document.getElementById("includePromo") as HTMLSelectElement).selectedIndex;
        let noLoot: number = (document.getElementById("includeNoLoot") as HTMLSelectElement).selectedIndex;
        let gens: boolean[] = array(6, (gen: number) => (document.getElementById("includeGen" + gen) as HTMLInputElement).checked);
        let genFilter: (i: CsvItem) => boolean = (i: CsvItem) => gens[parseInt(i.get('Set'))];
        return and(genFilter,
            ternary(treasure, compose(getter('Slot'), eql('Treasure'))),
            ternary(promo, seasonalItemFilter),
            ternary(noLoot, noLootFilter));
    }

    function parseCustomPredicate(): (o: CsvItem) => boolean {
        let disabled: () => boolean = () => true;
        let predicate: string = (document.getElementById("customPredicate") as HTMLInputElement).value.trim();
        if (!predicate) {
            return disabled;
        }
        try {
            let filter: (o: CsvItem, e: Extractors) => boolean = parseCustomFilter(predicate);
            if (!extractors) {
                let cardData: CsvItem[] = parseCsvData(loadCsvContent('cardData'));
                let cards: (c: string) => CsvItem = csvMap(cardData, 'Card Name');
                extractors = cardAndItemExtractors(itemHeader, itemData, csvMap(itemData, "Equipment Name"), cardData, cards);
            }
            return (o: CsvItem) => filter(o, extractors!);
        } catch (exception) {
            alert("Whoops! Your custom item filter isn't a valid composed filter definition! No custom item filter is used for this analysis!");
            console.error(exception.toString());
            return disabled;
        }
    }

    let slotMaxVariants: (id: number) => CsvItem = isTotal(asKMap(parseCsvData(document.getElementById('slotMaxVariants')!.innerHTML.trim().split(/[\n\r]+/)), intGetter('Id')));

    function applyTargetItemCount<T>(targetItemCount: TargetItemCount, target: number, collected: number, i: T, lst: [number, T][]): void {
        let count: number = targetItemCount[3](target, collected)
        if (count > 0) {
            lst.push([count, i]);
        }
    }

    function getTargetItemCount(): TargetItemCount {
        let selection: number = (document.getElementById('slotMax') as HTMLSelectElement).selectedIndex;
        let content: (0 | 1 | 2 | 3) = (document.getElementById('hoverBoxSelection') as HTMLSelectElement).selectedIndex  as (0 | 1 | 2 | 3);
        let contentExtractor: (target: number, collected: number) => number;
        switch (content) {
            case 0:
                contentExtractor = (target: number, collected: number) => target - collected;
                break;
            case 1:
                contentExtractor = (_target: number, collected: number) => collected;
                break;
            case 2:
                contentExtractor = (target: number, _collected: number) => target;
                break;
            case 3:default:
                contentExtractor = (target: number, collected: number) => collected - target;
                break;
        }
        if (selection === 0) {
            return [content == 3, () => 1, true, contentExtractor];
        }
        let variant: CsvItem = slotMaxVariants((selection - 1) % 3 + 1);
        return [true, (item: CsvItem)=> parseInt(variant.get(item.get('Slot'))) || 1, selection > 3, contentExtractor];
    }

    function getItemSortPolicy(): HoverBoxSorting {
        function textual(field: string): HoverBoxSorting {
            return (i1: [number, CsvItem], i2: [number, CsvItem]) => i1[1].get(field).localeCompare(i2[1].get(field));
        }
        function functional(f: (t: [number, CsvItem]) => number): HoverBoxSorting {
            return (i1: [number, CsvItem], i2: [number, CsvItem]) => f(i2) - f(i1);
        }
        // higher numbers will be sorted first as all Keep sorts use this strategy
        function numerical(field: string, fallback: number = 0): HoverBoxSorting {
            return functional((i: [number, CsvItem]) => {
                let value = parseInt(i[1].get(field));
                return isNaN(value) ? fallback : value;
            });
        }
        // the sorting policy will reverse the given ordering
        // the keep tends to sort more valuable first but the ordering is typically written from least valuable to most valuable
        function positional(field: string, ordering: string[]): HoverBoxSorting {
            return (i1: [number, CsvItem], i2: [number, CsvItem]) => ordering.indexOf(i2[1].get(field)) - ordering.indexOf(i1[1].get(field));
        }
        let name: HoverBoxSorting = textual('Equipment Name');
        let value: HoverBoxSorting = functional((i: [number, CsvItem]) => getItemCost(i[1], true));
        let rarity: HoverBoxSorting = positional('Rarity', ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']);
        let level: HoverBoxSorting = numerical('Level');
        let talent: HoverBoxSorting = stageSort(numerical('Talent 1', -1), numerical('Talent 2', -1));
        let count: HoverBoxSorting = functional((i: [number, CsvItem]) => i[0]);
        let sortIndex: number = (document.getElementById('hoverBoxSort') as HTMLSelectElement).selectedIndex;
        function reverseIfOdd(policy: HoverBoxSorting): HoverBoxSorting {
            return condSort(sortIndex % 2 == 0, policy, reverseSort(policy));
        }
        switch (Math.floor(sortIndex / 2)) {
            case 0:
                return reverseIfOdd(stageSort(value, name));
            case 1:
                return reverseIfOdd(stageSort(rarity, name));
            case 2:
                return reverseIfOdd(name);
            case 3:
                return reverseIfOdd(stageSort(level, name));
            case 4:
                return reverseIfOdd(stageSort(talent, name));
            case 5:
                return reverseIfOdd(stageSort(count, name));
            default:
                return reverseIfOdd(name);
        }
    }

    function getItemCost(item: CsvItem, sell: boolean): number {
        let equipmentCost: Index<number> = {
            Common: 5,
            Uncommon: 25,
            Rare: 100,
            Epic: 500,
            Legendary: 2500};
        let equipmentValue: Index<number> = {
            Common: 1,
            Uncommon: 2,
            Rare: 5,
            Epic: 20,
            Legendary: 100};
        let treasureValue: Index<number> = {
            Common: 2,
            Uncommon: 10,
            Rare: 40,
            Epic: 200,
            Legendary: 1000};
        return ((item.get('Slot') === 'Treasure') ? treasureValue : (sell ? equipmentValue : equipmentCost))[item.get('Rarity')] || 1;
    }

    function generateAspectClasses(items: CsvItem[], aspects: AnalysisAspect[]): Array<[AnalysisAspect | null, AspectClass[]]> {
        function generateClasses(items: CsvItem[], aspect: AnalysisAspect | null): [AnalysisAspect | null, AspectClass[]] {
            if (aspect) {
                let extractor: (i: CsvItem) => string = aspect[1] || getter(aspect[0]);
                let classes: string[] = items.map(extractor).filter(distinct()).sort(aspect[2]);
                return [aspect, classes.map((className: string) =>
                    [[className, aspect[3] ? aspect[3]!(className) : className], items.filter((i: CsvItem) => extractor(i) == className)] as AspectClass
                )];
            } else {
                return [null, [[['Total', 'Total'], items]]];
            }
        }

        return [null, ...aspects].map((a: AnalysisAspect | null) => generateClasses(items, a)).filter((a: [AnalysisAspect | null, AspectClass[]]) => a[1].length);
    }

    function applyAspectClasses(classes: Array<[AnalysisAspect | null, AspectClass[]]>, collection: (item: CsvItem) => number, targetItemCount: TargetItemCount): AnalysisDomain {
        function generateStatistics(items: CsvItem[]): [number, number, number, number, Array<[number, CsvItem]>] {
            let raw: [number, number, [number, CsvItem][]] = items.reduce((total: [number, number, [number, CsvItem][]], i: CsvItem) => {
                let target: number = targetItemCount[1](i);
                let collected: number = collection(i);
                applyTargetItemCount(targetItemCount, target, collected, i, total[2]);
                collected = Math.min(collected, target);
                if (targetItemCount[2]) {
                    collected = Math.floor(collected / target);
                    target = 1;
                }
                return [total[0] + collected, total[1] + target, total[2]] as [number, number, [number, CsvItem][]];
                }, [0, 0, []]);
            return [Math.floor(raw[0] * 100 / raw[1] || 0), raw[0], raw[1] - raw[0], raw[1], raw[2]];
        }

        function applyClass(c: AspectClass): AppliedAspectClass {
            return [c[0], c[1], generateStatistics(c[1])];
        }

        return classes.map((aspect: [AnalysisAspect | null, AspectClass[]]) =>
            [aspect[0], aspect[1].map(applyClass)] as DomainElement
        );
    }

    function costValue(itemList: [number, CsvItem][], targetItemCount: TargetItemCount): [string, number] {
        const challenge: [number, number, string][] = [[1, 0, 'cost'], [0, 1, 'value'], [0, 1, 'of'], [1, 0, 'of'], [-1, -2, 'missing'], [-2, -1, 'excessing'], [0, 1, 'collected'], [1, 0, 'all']];
        let response: [number, string][] = [];
        challenge.forEach((p: [number, number, string]) => applyTargetItemCount(targetItemCount, p[0], p[1], p[2], response));
        let label: string = response.map((e: [number, string]) => e[1]).slice(0, 3).join(' ');
        let val: number = itemList.reduce((total: number, cur: [number, CsvItem]) => total + cur[0] * getItemCost(cur[1], label[0] == 'v'), 0);
        return [label, val];
    }

    function generateHtmlReport(domain: AnalysisDomain, hoverBoxParam: HoverBoxParameter): HTMLTableElement[] {
        function generateAspectTable(aspect: DomainElement): HTMLTableElement {
            let table: HTMLTableElement = document.createElement('TABLE') as HTMLTableElement;
            table.classList.add('analysis');
            table.cellSpacing = '0';
            if (aspect[0]) {
                let header: HTMLTableCellElement = table.createTHead().insertRow().insertCell();
                header.colSpan = 7;
                header.appendChild(text(aspect[0]![0]))
            }
            let body: HTMLTableSectionElement = table.createTBody();
            aspect[1].forEach((c: AppliedAspectClass) => appendClassRow(body, c, aspect));
            return table;
        }

        function appendClassRow(table: HTMLTableSectionElement, c: AppliedAspectClass, aspect: DomainElement): void {
            const showCount: boolean = hoverBoxParam[1][0];
            function formatItem(i: [number, CsvItem]): string {
                return (showCount ? i[0] + 'x ' : '') + getQualifiedName(i[1]);
            }

            function createBar(): HTMLElement {
                let bar: HTMLElement = document.createElement('SPAN');
                bar.classList.add('bar');
                let progress: HTMLElement = document.createElement('SPAN');
                progress.style.width = c[2][0] + '%';
                bar.appendChild(progress);
                return bar;
            }

            function createExclude(): HTMLElement {
                let exclude: HTMLInputElement = document.createElement('INPUT') as HTMLInputElement;
                exclude.type = 'image';
                exclude.src = '../layout/exclude.svg';
                exclude.title = 'Exclude items from next analysis';
                exclude.addEventListener('click', () => {
                    let predicate: HTMLInputElement = document.getElementById('customPredicate') as HTMLInputElement;
                    predicate.value = (predicate.value.trim() ? '(' + predicate.value.trim() + ') AND ' : '') + '[' + aspect[0]![0] + '] != "' + c[0][0] + '"';
                });
                return exclude;
            }

            function createInfo(): HTMLElement {
                let info: HTMLInputElement = document.createElement('INPUT') as HTMLInputElement;
                info.type = 'image';
                info.src = '../layout/info.svg';
                info.title = 'Show more info ... (new tab)';
                info.addEventListener('click', () => {
                    let ip = window.open('analysis-details.php', '_blank');
                    if (ip != null) {
                        let infoPage: Window = ip;
                        infoPage.window.addEventListener('load', () => {
                            infoPage.document.body.appendChild(header(2, 'Showing details of all selected ' + (aspect[0] ? '"' + aspect[0]![0] + ' ' + c[0][1] + '" ' : '') + 'items'));
                            let items: HTMLTableElement = document.createElement('TABLE') as HTMLTableElement;
                            items.classList.add('detail');
                            let tHeader: HTMLElement = document.createElement('TH');
                            tHeader.appendChild(text('Name'));
                            items.createTHead().insertRow().appendChild(tHeader);
                            let tBody: HTMLTableSectionElement = items.createTBody();
                            c[2][4].forEach((i: [number, CsvItem]) => {
                                let link: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
                                link.href = Wiki.itemLink(i[1]);
                                link.target = '_blank';
                                link.appendChild(text(formatItem(i)));
                                tBody.insertRow().insertCell().appendChild(link)
                            });
                            infoPage.document.body.appendChild(items);
                        });
                    }
                });
                return info;
            }

            function prepareHoverBoxModification(row: HTMLTableRowElement): void {
                row.addEventListener('mouseout', () => {
                    let hoverBox: HTMLElement = document.getElementById("hover-box")!;
                    hoverBox.style.display = 'none';
                    replaceAllChildren(hoverBox, []);
                });

                if (!c[2][4].length) {
                    row.addEventListener('mouseover', () => {
                        let hoverBox: HTMLElement = document.getElementById("hover-box")!;
                        hoverBox.style.display = 'none';
                        replaceAllChildren(hoverBox, []);
                    });
                } else {
                    c[2][4].sort(hoverBoxParam[2]);
                    let costOrValue: [string, number] = costValue(c[2][4], hoverBoxParam[1]);
                    let content: string[] = [
                        'Total ' + costOrValue[0] + ' items: ' + costOrValue[1].toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,"),
                        ((c[2][1] === c[2][3])
                            ? '-- full collection --'
                            : (() => {
                                let goal: number = Math.ceil(c[2][3] * (c[2][0] + 1) / 100);
                                return 'Missing: ' + (goal - c[2][1]) + ' for ' + Math.floor(goal / c[2][3] * 100) + ' %' + ((goal === c[2][3]) ? '' : ' ; ' + c[2][2] + ' for 100 %');
                            })()),
                        ...((c[2][4].length > hoverBoxParam[0])
                            ? c[2][4].slice(0, hoverBoxParam[0] - 1).map(formatItem).concat(['... ' + (c[2][4].length - hoverBoxParam[0] + 1) + ' more omitted ...'])
                            : c[2][4].map(formatItem))
                    ];

                    row.addEventListener('mouseover', () => {
                        let lines: HTMLElement[] = [text(content[0])];
                        let hoverBox: HTMLElement = document.getElementById("hover-box")!;
                        for (let i: number = content.length - 1; i > 0; i--) {
                            lines[2 * i] = text(content[i]);
                            lines[2 * i - 1] = document.createElement('BR');
                        }
                        lines[2] = italic(content[1]);
                        replaceAllChildren(hoverBox, lines);
                        hoverBox.style.display = '';
                    });
                }
            }

            let row: HTMLTableRowElement = table.insertRow();
            if (c[2][0] >= 100) {
                row.classList.add('complete');
            }
            row.insertCell().appendChild(aspect[0] ? text(c[0][1]) : bold(c[0][1]));
            row.insertCell().appendChild(text(c[2][0] + ' %'));
            row.insertCell().appendChild(createBar());
            row.insertCell().appendChild(text('' + c[2][1]));
            row.insertCell().appendChild(text('/' + c[2][3]));
            if (aspect[0] && aspect[1].length > 1) {
                row.insertCell().appendChild(createExclude());
            } else {
                row.insertCell();
            }
            row.insertCell().appendChild(createInfo());
            prepareHoverBoxModification(row);
        }

        return domain.map(generateAspectTable);
    }

    function generateCsvReport(domain: AnalysisDomain, targetItemCount: TargetItemCount): string {
        function formatAspect(aspect: DomainElement): any[][] {
            function formatClass(c: AppliedAspectClass): any[] {
                return [aspect[0] ? aspect[0]![0]: '', c[0][1], c[2][0], c[2][1], c[2][2], c[2][3], costValue(c[2][4], targetItemCount)[1]];
            }
            return aspect[1].map(formatClass);
        }

        let header: string[] = ['Aspect', 'Class', 'Percentage', 'Collected', 'Missing', 'Total', costValue([], targetItemCount)[0]];
        let content: any[][] = flatMap(domain, formatAspect);
        return toCsv([header, ...content]);
    }

    function generateItemExport(domain: AnalysisDomain, targetItemCount: TargetItemCount): string {
        const challenge: [number, number, string][] = [[-1, -2, 'Missing'], [-2, -1, 'Excessing'], [0, 1, 'Collected'], [1, 0, 'All']];
        let response: [number, string][] = [];
        challenge.forEach((p: [number, number, string]) => applyTargetItemCount(targetItemCount, p[0], p[1], p[2], response));
        let countLabel: string = 'Count of ' + response[0][1];
        function formatLine(item: [number, CsvItem]): string[] {
            let content = aspects.map((asp: DomainElement) =>
                asp[1].filter((c: AppliedAspectClass) =>
                    c[2][4].some((cItem: [number, CsvItem]) => cItem[1].get('Id') === item[1].get('Id'))
                )[0][0][1]
            );
            content.push("" + item[0]);
            content.push(item[1].get('Equipment Name'));
            return content;
        }

        let items: [number, CsvItem][] = domain.filter((a) => !a[0])[0][1][0][2][4];
        let aspects: AnalysisDomain = domain.filter((a) => a[0]);
        let content: string[][] = items.map(formatLine);
        let header: string[] = [...aspects.map((asp: DomainElement) => asp[0]![0]), countLabel, 'Item'];
        return toCsv([header, ...content]);
    }

    let [itemHeader, itemData]: [string[], CsvItem[]] = parseRawCsvData(loadCsvContent('equipmentData'));
    itemData = itemData.filter(not(or(slotDefaultFilter, specialItemFilter)));
    let extractors: Extractors | undefined = undefined;

    function prepareReportSaving(report: string, items: string): void {
        saveOnClick(document.getElementById('bReport') as HTMLButtonElement, 'data:text/csv;charset=utf-8,' + encodeURIComponent(report), 'report.csv');
        saveOnClick(document.getElementById('bItems') as HTMLButtonElement, 'data:text/csv;charset=utf-8,' + encodeURIComponent(items), 'items.csv');
    }

    function preventReportSaving(): void {
        (document.getElementById('bReport') as HTMLButtonElement).disabled = true;
        (document.getElementById('bItems') as HTMLButtonElement).disabled = true;
    }

    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let items: CsvItem[] = itemData.filter(generateItemFilter());

            try {
                items = items.filter(parseCustomPredicate());
            } catch (exception) {
                alert("Whoops! The custom item filter didn't work as expected! The custom item filter wasn't applied this time!");
                console.error(exception.toString());
            }

            let aspects: AnalysisAspect[] = [
                ['Set', undefined, undefined, (set: string) => ['Base', 'AotA', 'EttSC', 'Aloyzo', 'AI', 'CM'][parseInt(set)]] as AnalysisAspect,
                ['Rarity', undefined, rarityNameSort, undefined] as AnalysisAspect,
                ['Slot', undefined, undefined, undefined] as AnalysisAspect,
                ['Level', undefined, (l1: string, l2: string) => parseInt(l1) - parseInt(l2), undefined] as AnalysisAspect
            ];

            let classes: Array<[AnalysisAspect | null, AspectClass[]]> = generateAspectClasses(items, aspects);

            let collection: (item: CsvItem) => number = parseCollection((document.getElementById('taLogData') as HTMLTextAreaElement).value);
            let targetItemCount: TargetItemCount = getTargetItemCount();
            let domain: AnalysisDomain = applyAspectClasses(classes, collection, targetItemCount);

            prepareReportSaving(generateCsvReport(domain, targetItemCount), generateItemExport(domain, targetItemCount));
            replaceAllChildren(document.getElementById('results')!, generateHtmlReport(domain, [16, targetItemCount, getItemSortPolicy()]));
        } catch (exception) {
            preventReportSaving();
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

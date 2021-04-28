import {SETS, STYLE_SCHEMES, svgBadge}                      from "../ch/badges";
import {parseCampaignFlags}                                 from "../ch/console";
import {loadCsvContent}                                     from "../ch/csvHandling";
import {CsvItem, getter, Index, parseCsvData}               from "../helper/csv";
import {notBreakable, replaceAllChildren, text}             from "../helper/elements";
import {whenReady}                                          from "../helper/event";
import {and, array, cnst, compose, eql, not, or, partition} from "../helper/functional";
import {flatMap}                                            from "../helper/map";
import {attributeElement, svgPath, svgRect, svgText}        from "../helper/svg";

declare function canvg(canvas: HTMLCanvasElement, svg: string, options?: Index<boolean>): void

whenReady(() => {
    type AdvMode = [string, string, (adv: CsvItem) => boolean];

    function generateAdventureFilter(): (a: CsvItem) => boolean {
        let locked: boolean = (document.getElementById("includeLocked") as HTMLInputElement).checked;
        let mm: boolean = (document.getElementById("includeMM") as HTMLInputElement).checked;
        let cOfC: boolean = (document.getElementById("includeGen3") as HTMLInputElement).checked;
        // This extra handling was requested by Force.ofWill to separate Caverns of Chaos from Base Set
        // MM and CoC define no level
        let gens: Index<boolean> = array(6, (gen: number) => (document.getElementById("includeGen" + gen) as HTMLInputElement).checked).reduce(
            (r: Index<boolean>, e: boolean, i: number) => {r[''+i] = e; return r;}, {'':true} as Index<boolean>);
        let genFilter: (i: CsvItem) => boolean = (i: CsvItem) => gens[i.get('Set')];
        return and(genFilter, or(cnst(cOfC), compose(getter('Name'), not((id: string) => /^Caverns of Chaos/.test(id)))),
            compose(getter('Type'), eql('adventure')),
            or(cnst(locked), compose(getter('Tags'), not((tags: string) => /locked/.test(tags)))),
            or(cnst(mm), compose(getter('ID'), not((id: string) => /^MM/.test(id)))));
    }

    function determineReachableAdventures(advs: CsvItem[], roots: string[]): CsvItem[] {
        let unreachable: CsvItem[] = advs;
        let reachable: CsvItem[] = [];
        let flags: Index<boolean> = {};
        roots.forEach((flag: string) => flags[flag] = true);
        while (true) {
            let parts: [CsvItem[], CsvItem[]] = partition(unreachable, (adv: CsvItem) => {
                let pre: string = adv.get('Prerequisite Flags');
                return !pre || pre.split(/,/).every((req: string) => flags[req]);
            });
            if (!parts[0].length) {
                return reachable;
            }
            reachable = reachable.concat(parts[0]);
            unreachable = parts[1];
            parts[0].forEach((adv: CsvItem) => {
                flags[adv.get('ID') + 'DONE'] = true;
                let compl: string = adv.get('Completion Flags');
                if (compl) {
                    compl.split(/,/).forEach((flag: string) => flags[flag] = true);
                }
            });
        }
    }

    function createBadge(pct: number, pcts: number[], style: Readonly<Index<string>>): SVGElement {
        return svgBadge(pcts, pct,
            array(SETS, (gen: number) => (document.getElementById("includeGen" + gen) as HTMLInputElement).checked),
            [(document.getElementById("includeLocked") as HTMLInputElement).checked, [
                svgRect('1', '5', '8', '5'), svgPath('M 1 5 A 4.125 4.125 0 1 1 9 5 L 7 5 A 2.25 2.25 0 1 0 3 5 Z')
            ], 'fill:DarkGoldenrod;stroke:Black;'],
            [(document.getElementById("includeMM") as HTMLInputElement).checked, [
                attributeElement(svgText('0', '7', 'MM'), { 'font-family':'monospace', 'font-size':'8', 'fill':'purple', 'stroke':'brown' })
            ], undefined], style);
    }

    function printAdvDetails(mode: [AdvMode, CsvItem[]]): HTMLElement[] {
        let header: HTMLElement = document.createElement('B');
        if (mode[1].length) {
            header.appendChild(text('Adventures not completed in mode "' + mode[0][0] + '":'));
            return [header,
                document.createElement('BR'),
                ... (flatMap(mode[1], (adv: CsvItem) => [notBreakable(text(adv.get('Display Name') + ' |')), text(' ')])),
                document.createElement('HR')];
        } else {
            header.appendChild(text('All adventures in mode "' + mode[0][0] + '" completed!'));
            return [header, document.createElement('HR')];
        }
    }

    let advData: CsvItem[] = parseCsvData(loadCsvContent('adventuresData'));

    function quest(predicate: (adv: CsvItem) => boolean = () => true) {
        return (adv: CsvItem) => !/noQuests/.test(adv.get('Tags')) && predicate(adv);
    }

    // process adventures
    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let advs: CsvItem[];
            // the reachability check is necessary because the csv may contain un-reachable adventures (placeholder-info)
            // but without base set no adventures are reachable as completing the tutorial only enables base set adventures
            // in case base set is included the check is done after filtering to only process actual reachables based on settings
            // in case base set is excluded the check is done before filtering to still exclude placeholder adventures
            if ((document.getElementById("includeGen0") as HTMLInputElement).checked) {
                advs = determineReachableAdventures(advData.filter(generateAdventureFilter()), ['TUTSHWAD']);
            } else {
                advs = determineReachableAdventures(advData, ['TUTSHWAD']).filter(generateAdventureFilter());
            }
            advs = advs.sort((a1, a2) => {
                function neg(val: number, n: number): number {
                    return (val < 0)?n:val;
                }
                function undef(val: number, n: number): number {
                    return val?val:n;
                }
                return (neg(parseInt(a1.get('Level')), 1000) - neg(parseInt(a2.get('Level')), 1000)) ||
                    (undef(parseInt(a1.get('Set')), 100) - undef(parseInt(a2.get('Set')), 100)) ||
                    (a1.get('Display Name').localeCompare(a2.get('Display Name')));
            });
            let flags: (f: string) => boolean = parseCampaignFlags((document.getElementById('taLogData') as HTMLTextAreaElement).value);
            let modes: Array<AdvMode> = [
                // regular
                ['Regular', 'DONE', () => true],
                // No party deaths
                ['Quest: No party deaths', 'QST0', quest()],
                // All your levels are reduced to xx
                ['Quest: Reduced levels', 'QST1', quest((adv) => parseInt(adv.get('Level')) > 8)],
                // Use only RACE CLASS
                ['Quest: Character limitation', 'QST2', quest((adv) => !!(adv.get('Quest Class Restriction') || adv.get('Quest Race Restriction')))],
                // Party has one health
                ['Quest: One health', 'QST3', quest()],
                // Equip only items with a Handicap card
                ['Quest: Handicap items', 'QST4', quest()],
                // in co-op
                ['Co-op', 'COOP', () => true]];
            let progressByMode: [AdvMode, CsvItem[], number[]][] = modes.map((mode: AdvMode) => {
                let available: CsvItem[] = advs.filter(mode[2]);
                let parts: [CsvItem[], CsvItem[]] = partition(available, (adv: CsvItem) => flags(adv.get('ID') + mode[1]));
                return [mode, parts[1], [parts[0].length, available.length, available.length ? (parts[0].length / available.length) : 0]] as [AdvMode, CsvItem[], number[]];
            });
            let total: number[] = progressByMode.reduce((total: number[], mode: [AdvMode, CsvItem[], number[]]) => [total[0] + mode[2][0], total[1] + mode[2][1]], [0, 0]);
            let totalPct: number = total[1] ? total[0] / total[1] : 0;

            let badge: SVGElement = createBadge(totalPct, progressByMode.map((mode: [AdvMode, CsvItem[], number[]]) => mode[2][2]), STYLE_SCHEMES[0]);
            replaceAllChildren(document.getElementById('details')!, flatMap(progressByMode.map((p) => [p[0], p[1]] as [AdvMode, CsvItem[]]), printAdvDetails));
            let canvas: HTMLCanvasElement = document.createElement('CANVAS') as HTMLCanvasElement;
            canvg(canvas, badge.outerHTML, { ignoreMouse: true, ignoreAnimation: true });
            document.getElementById("results")!.appendChild(canvas);
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

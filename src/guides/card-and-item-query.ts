import {cardExtractorFromItems, itemExtractorFromCards, loadCsvContent}   from "../ch/csvHandling";
import {slotDefaultFilter}                                                from "../ch/equipment";
import {Wiki}                                                             from "../ch/wiki";
import {CsvItem, csvMap, getter, parseCsvData, parseRawCsvData, textSort} from "../helper/csv";
import {href, replaceAllChildren, text}                                   from "../helper/elements";
import {whenReady}                                                        from "../helper/event";
import {not}                                                              from "../helper/functional";
import {Extractors, Extractor, parseCustomFilter}                         from "../parser/customFilter";

whenReady(() => {
    let itemRawData: [string[], CsvItem[]] = parseRawCsvData(loadCsvContent('equipmentData'));
    let itemData: CsvItem[] = itemRawData[1].filter(not(slotDefaultFilter)).sort(textSort('Equipment Name'));
    let cardData: CsvItem[] = parseCsvData(loadCsvContent('cardData')).sort(textSort('Card Name'));

    let cardExtractor: Extractor = cardExtractorFromItems(itemRawData[0], csvMap(cardData, 'Card Name'), itemData);
    let itemExtractor: Extractor = itemExtractorFromCards(cardData, itemData, csvMap(itemData, 'Equipment Name'), cardExtractor);

    document.getElementById('bProcess')!.addEventListener('click', () => {
        try {
            let cardBased: boolean = (document.getElementById('baseCard') as HTMLInputElement).checked;
            let base: CsvItem[] = cardBased ? cardData : itemData;
            let wiki: (m: CsvItem) => string = cardBased ? Wiki.cardLink : Wiki.itemLink;
            let name: (m: CsvItem) => string = cardBased ? getter('Card Name') : getter('Equipment Name');
            let extractors: Extractors = cardBased ? [itemExtractor, cardExtractor] : [cardExtractor, itemExtractor];
            let cols: string = (document.getElementById('cols') as HTMLInputElement).value;
            let colGetters: ((m: CsvItem) => string)[] = [];

            let div: HTMLElement = document.getElementById('results')!;

            let filter: ((o: CsvItem, e: Extractors) => boolean);
            try {
                filter = parseCustomFilter((document.getElementById('query') as HTMLTextAreaElement).value);
            } catch (exception) {
                alert("The given query wasn't parsable: " + exception);
                console.error(exception);
                return;
            }

            let matching: CsvItem[];
            try {
                matching = base.filter((o: CsvItem) => filter(o, extractors));
            } catch (exception) {
                alert("The given query wasn't executable: " + exception);
                console.error(exception);
                return;
            }

            let resultTable: HTMLTableElement = document.createElement('TABLE') as HTMLTableElement;
            resultTable.align = 'center';
            let tableBody: HTMLTableElement | HTMLTableSectionElement = resultTable;
            if (cols.trim()) {
                let header: HTMLTableRowElement = resultTable.createTHead().insertRow();
                header.insertCell().appendChild(text('Name'));
                colGetters = cols.split(/,/).filter((c: string) => c.trim()).map((c: string) => {
                    header.insertCell().appendChild(text(c.trim()));
                    return getter(c.trim());
                }, [])
                tableBody = resultTable.createTBody();
            }
            matching.forEach((m: CsvItem) => {
                let row: HTMLTableRowElement = tableBody.insertRow();
                row.insertCell().appendChild(href(wiki(m), name(m), true));
                colGetters.forEach((g: (m: CsvItem) => string) => row.insertCell().appendChild(text(g(m))));
            });
            replaceAllChildren(div, [resultTable]);
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

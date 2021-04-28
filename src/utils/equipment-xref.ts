import {loadCsvContent}                   from "../ch/csvHandling";
import {CsvItem, getter, parseRawCsvData} from "../helper/csv";
import {whenReady}                        from "../helper/event";
import {asKMap, isTotal}                  from "../helper/map";

whenReady(() => {
    let itemData: [string[], CsvItem[]] = parseRawCsvData(loadCsvContent('equipmentData'));
    let itemMap: (id: string) => CsvItem = isTotal(asKMap(itemData[1], (item: CsvItem) => item.get("Id")));

    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let data: [string[], CsvItem[]] = parseRawCsvData((document.getElementById("taInput") as HTMLTextAreaElement).value.trim().split(/[\n\r]+/));
            let dataMap: (item: string) => CsvItem = isTotal(asKMap(data[1], getter("Item")));
            let headers: [string[], string[]] = [data[0], itemData[0].filter((h: string) => h !== 'Id')];

            let content: [string, CsvItem, CsvItem][] = ((document.getElementById("doReverseMerge") as HTMLInputElement).checked) ?
                itemData[1].map((item: CsvItem) => [item.get("Id"), dataMap(item.get("Id")), item] as [string, CsvItem, CsvItem]) :
                data[1].map((data: CsvItem) => [data.get("Item"), data, itemMap(data.get("Item"))] as [string, CsvItem, CsvItem]);

            let lines: [string[], string[]][] = content.map((tuple: [string, CsvItem, CsvItem]) => [
                headers[0].map((h: string) => (tuple[1] !== undefined) ? tuple[1].get(h) : ((h === "Item") ? tuple[0] : "")) as string[],
                headers[1].map((h: string) => (tuple[2] === undefined) ? "" : tuple[2].get(h)) as string[]
                ] as [string[], string[]]);

            (document.getElementById("taOutput") as HTMLTextAreaElement).value =
                ([headers, ...lines] as [string[], string[]][]).map(
                    (line: [string[], string[]]) => line.map((segment: string[]) => segment.join('\t')).join('\t')
                    ).join('\n');
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

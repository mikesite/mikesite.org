import {getTeamMaxUsableItemCount}      from "../ch/archetype";
import {parseCollection}                from "../ch/console";
import {loadCsvContent}                 from "../ch/csvHandling";
import {getValue, slotDefaultFilter}    from "../ch/equipment";
import {ExcessItem, formatExcess}       from "../element/excess-table";
import {CsvItem, getter, parseCsvData}  from "../helper/csv";
import {whenReady}                      from "../helper/event";
import {cnst, compose, eql, not, or}    from "../helper/functional";

whenReady(() => {
    let itemData: CsvItem[] = parseCsvData(loadCsvContent('equipmentData')).filter(not(slotDefaultFilter));

    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let collection: (i: CsvItem) => number = parseCollection((document.getElementById('taLogData') as HTMLTextAreaElement).value);
            let includeTreasures: boolean = (document.getElementById("includeTreasure") as HTMLInputElement).checked;
            let items: CsvItem[] = itemData.filter(or(cnst(includeTreasures), compose(getter('Slot'), not(eql('Treasure')))));
            let maxUsableItemCount: (i: CsvItem) => number = getTeamMaxUsableItemCount();
            let excesses: ExcessItem[] = items.map((i: CsvItem) => [i, [collection(i) - maxUsableItemCount(i)]] as ExcessItem);
            formatExcess(document.getElementById("results")!, excesses, (i: [CsvItem, number[]]) => i[1][0] * getValue(i[0]));
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

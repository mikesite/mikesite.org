import {getTeamMaxUsableItemCount}            from "../ch/archetype";
import {parseCollection, parseShop, ShopItem} from "../ch/console";
import {loadCsvContent}                       from "../ch/csvHandling";
import {getCost, slotDefaultFilter}           from "../ch/equipment";
import {ExcessItem, formatExcess}             from "../element/excess-table";
import {CsvItem, getter, parseCsvData}        from "../helper/csv";
import {whenReady}                            from "../helper/event";
import {cnst, compose, eql, not, or}          from "../helper/functional";

whenReady(() => {
    let itemData: CsvItem[] = parseCsvData(loadCsvContent('equipmentData')).filter(not(slotDefaultFilter));

    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let log: string = (document.getElementById('taLogData') as HTMLTextAreaElement).value;
            let collection: (i: CsvItem) => number = parseCollection(log);
            let shop: (i: CsvItem) => (ShopItem | null) = parseShop(log);
            let includeTreasures: boolean = (document.getElementById("includeTreasure") as HTMLInputElement).checked;
            let items: CsvItem[] = itemData.filter(or(cnst(includeTreasures), compose(getter('Slot'), not(eql('Treasure')))));
            let maxUsableItemCount: (i: CsvItem) => number = getTeamMaxUsableItemCount();
            let excesses: ExcessItem[] = items.map((i: CsvItem) => {
                let shopItem: ShopItem | null = shop(i);
                if (shopItem) {
                    let missing: number = Math.max(0, maxUsableItemCount(i) - collection(i));
                    let rebuy: number = Math.min(missing, shopItem.resell);
                    return [i, [rebuy, Math.min(missing - rebuy, shopItem.sell)]] as ExcessItem;
                } else {
                    return [i, [0]] as ExcessItem;
                }
            });
            formatExcess(document.getElementById("results")!, excesses, (i: [CsvItem, number[]]) => i[1][0] * getCost(i[0], true) + i[1][1] * getCost(i[0]), 'Cost');
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

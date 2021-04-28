define(["require", "exports", "../ch/archetype", "../ch/console", "../ch/csvHandling", "../ch/equipment", "../element/excess-table", "../helper/csv", "../helper/event", "../helper/functional"], function (require, exports, archetype_1, console_1, csvHandling_1, equipment_1, excess_table_1, csv_1, event_1, functional_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        var itemData = csv_1.parseCsvData(csvHandling_1.loadCsvContent('equipmentData')).filter(functional_1.not(equipment_1.slotDefaultFilter));
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var log = document.getElementById('taLogData').value;
                var collection_1 = console_1.parseCollection(log);
                var shop_1 = console_1.parseShop(log);
                var includeTreasures = document.getElementById("includeTreasure").checked;
                var items = itemData.filter(functional_1.or(functional_1.cnst(includeTreasures), functional_1.compose(csv_1.getter('Slot'), functional_1.not(functional_1.eql('Treasure')))));
                var maxUsableItemCount_1 = archetype_1.getTeamMaxUsableItemCount();
                var excesses = items.map(function (i) {
                    var shopItem = shop_1(i);
                    if (shopItem) {
                        var missing = Math.max(0, maxUsableItemCount_1(i) - collection_1(i));
                        var rebuy = Math.min(missing, shopItem.resell);
                        return [i, [rebuy, Math.min(missing - rebuy, shopItem.sell)]];
                    }
                    else {
                        return [i, [0]];
                    }
                });
                excess_table_1.formatExcess(document.getElementById("results"), excesses, function (i) { return i[1][0] * equipment_1.getCost(i[0], true) + i[1][1] * equipment_1.getCost(i[0]); }, 'Cost');
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

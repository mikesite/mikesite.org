define(["require", "exports", "../ch/csvHandling", "../ch/equipment", "../ch/wiki", "../helper/csv", "../helper/elements", "../helper/event", "../helper/functional", "../parser/customFilter"], function (require, exports, csvHandling_1, equipment_1, wiki_1, csv_1, elements_1, event_1, functional_1, customFilter_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        var itemRawData = csv_1.parseRawCsvData(csvHandling_1.loadCsvContent('equipmentData'));
        var itemData = itemRawData[1].filter(functional_1.not(equipment_1.slotDefaultFilter)).sort(csv_1.textSort('Equipment Name'));
        var cardData = csv_1.parseCsvData(csvHandling_1.loadCsvContent('cardData')).sort(csv_1.textSort('Card Name'));
        var cardExtractor = csvHandling_1.cardExtractorFromItems(itemRawData[0], csv_1.csvMap(cardData, 'Card Name'), itemData);
        var itemExtractor = csvHandling_1.itemExtractorFromCards(cardData, itemData, csv_1.csvMap(itemData, 'Equipment Name'), cardExtractor);
        document.getElementById('bProcess').addEventListener('click', function () {
            try {
                var cardBased = document.getElementById('baseCard').checked;
                var base = cardBased ? cardData : itemData;
                var wiki_2 = cardBased ? wiki_1.Wiki.cardLink : wiki_1.Wiki.itemLink;
                var name_1 = cardBased ? csv_1.getter('Card Name') : csv_1.getter('Equipment Name');
                var extractors_1 = cardBased ? [itemExtractor, cardExtractor] : [cardExtractor, itemExtractor];
                var cols = document.getElementById('cols').value;
                var colGetters_1 = [];
                var div = document.getElementById('results');
                var filter_1;
                try {
                    filter_1 = customFilter_1.parseCustomFilter(document.getElementById('query').value);
                }
                catch (exception) {
                    alert("The given query wasn't parsable: " + exception);
                    console.error(exception);
                    return;
                }
                var matching = void 0;
                try {
                    matching = base.filter(function (o) { return filter_1(o, extractors_1); });
                }
                catch (exception) {
                    alert("The given query wasn't executable: " + exception);
                    console.error(exception);
                    return;
                }
                var resultTable = document.createElement('TABLE');
                resultTable.align = 'center';
                var tableBody_1 = resultTable;
                if (cols.trim()) {
                    var header_1 = resultTable.createTHead().insertRow();
                    header_1.insertCell().appendChild(elements_1.text('Name'));
                    colGetters_1 = cols.split(/,/).filter(function (c) { return c.trim(); }).map(function (c) {
                        header_1.insertCell().appendChild(elements_1.text(c.trim()));
                        return csv_1.getter(c.trim());
                    }, []);
                    tableBody_1 = resultTable.createTBody();
                }
                matching.forEach(function (m) {
                    var row = tableBody_1.insertRow();
                    row.insertCell().appendChild(elements_1.href(wiki_2(m), name_1(m), true));
                    colGetters_1.forEach(function (g) { return row.insertCell().appendChild(elements_1.text(g(m))); });
                });
                elements_1.replaceAllChildren(div, [resultTable]);
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

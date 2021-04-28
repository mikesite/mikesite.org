define(["require", "exports", "../ch/csvHandling", "../helper/csv", "../helper/event", "../helper/map"], function (require, exports, csvHandling_1, csv_1, event_1, map_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        var itemData = csv_1.parseRawCsvData(csvHandling_1.loadCsvContent('equipmentData'));
        var itemMap = map_1.isTotal(map_1.asKMap(itemData[1], function (item) { return item.get("Id"); }));
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var data = csv_1.parseRawCsvData(document.getElementById("taInput").value.trim().split(/[\n\r]+/));
                var dataMap_1 = map_1.isTotal(map_1.asKMap(data[1], csv_1.getter("Item")));
                var headers_1 = [data[0], itemData[0].filter(function (h) { return h !== 'Id'; })];
                var content = (document.getElementById("doReverseMerge").checked) ?
                    itemData[1].map(function (item) { return [item.get("Id"), dataMap_1(item.get("Id")), item]; }) :
                    data[1].map(function (data) { return [data.get("Item"), data, itemMap(data.get("Item"))]; });
                var lines = content.map(function (tuple) { return [
                    headers_1[0].map(function (h) { return (tuple[1] !== undefined) ? tuple[1].get(h) : ((h === "Item") ? tuple[0] : ""); }),
                    headers_1[1].map(function (h) { return (tuple[2] === undefined) ? "" : tuple[2].get(h); })
                ]; });
                document.getElementById("taOutput").value =
                    [headers_1].concat(lines).map(function (line) { return line.map(function (segment) { return segment.join('\t'); }).join('\t'); }).join('\n');
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

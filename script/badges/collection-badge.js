define(["require", "exports", "../ch/archetype", "../ch/badges", "../ch/console", "../ch/equipment", "../ch/csvHandling", "../helper/csv", "../helper/event", "../helper/functional", "../helper/svg"], function (require, exports, archetype_1, badges_1, console_1, equipment_1, csvHandling_1, csv_1, event_1, functional_1, svg_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        function generateItemFilter() {
            var noLoot = document.getElementById("includeNoLoot").checked;
            var treasure = document.getElementById("includeTreasure").checked;
            var gens = functional_1.array(6, function (gen) { return document.getElementById("includeGen" + gen).checked; });
            var genFilter = function (i) { return gens[parseInt(i.get('Set'))]; };
            return functional_1.and(genFilter, functional_1.or(functional_1.cnst(noLoot), functional_1.not(functional_1.or(equipment_1.noLootFilter, equipment_1.seasonalItemFilter))), functional_1.or(functional_1.cnst(treasure), functional_1.compose(csv_1.getter('Slot'), functional_1.not(functional_1.eql('Treasure')))));
        }
        function createBadge(pct, pcts, style) {
            return badges_1.svgBadge(pcts, pct, functional_1.array(badges_1.SETS, function (gen) { return document.getElementById("includeGen" + gen).checked; }), [document.getElementById("includeTreasure").checked, [
                    svg_1.svgPolygon('5,10 0,3 2,0 8,0 10,3 5,10'),
                    svg_1.svgStyle(svg_1.svgPolygon('5,10 2,3 5,0 8,3 5,10 5,3 2,0 0,3 10,3 8,0 5,3 5,10'), 'stroke-width:0.5;')
                ], 'fill:White;stroke:Grey;'], [document.getElementById("includeNoLoot").checked, [
                    svg_1.svgPolygon('5,0.5 6.2,3.9 9.8,3.9 7,6.1 8,9.5 5,7.5 2,9.5 3,6.1 0.2,3.9 3.8,3.9 5,0.5')
                ], 'fill:Gold;stroke:Brown;'], style, true);
        }
        var itemData = csv_1.parseCsvData(csvHandling_1.loadCsvContent("equipmentData")).filter(functional_1.not(functional_1.or(equipment_1.slotDefaultFilter, equipment_1.specialItemFilter)));
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var items_1 = itemData.filter(generateItemFilter());
                var collection_1 = console_1.parseCollection(document.getElementById('taLogData').value);
                var maxUsable = document.getElementById('maxUsable').checked;
                var itemCount_1 = maxUsable ? archetype_1.getTeamMaxUsableItemCount() : function () { return 1; };
                var levels = items_1.map(csv_1.intGetter('Level')).filter(functional_1.distinct()).sort(function (l1, l2) { return l1 - l2; }).map(function (l) { return items_1.filter(function (i) { return parseInt(i.get('Level')) === l; }); });
                var isFull_1 = function (item) { return collection_1(item) >= itemCount_1(item); };
                var byLevel = levels.map(function (items) { return items.filter(isFull_1).length / items.length; });
                var total = items_1.length ? (items_1.filter(isFull_1).length / items_1.length) : 0;
                var badge = createBadge(total, byLevel, badges_1.STYLE_SCHEMES[maxUsable ? 1 : 0]);
                var canvas = document.createElement('CANVAS');
                canvg(canvas, badge.outerHTML, { ignoreMouse: true, ignoreAnimation: true });
                document.getElementById("results").appendChild(canvas);
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

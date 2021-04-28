define(["require", "exports", "../ch/console", "../helper/event", "../helper/map"], function (require, exports, console_1, event_1, map_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var data = document.getElementById("taLogData").value.trim().split(/\n/);
                var results = console_1.parseLootLog(data);
                var output = [['AdventureId', 'AdventureName', 'AdventureLevel', 'BattleId', 'BattleName', 'ItemId', 'ClubSlot']].concat(map_1.flatMap(results, function (r) {
                    var battleStat = [r.property.ID, r.property.displayname, r.property.level, r.property.battle, r.property.battledisplayname];
                    return r.loot.map(function (l) { return battleStat.concat([l.item, l.club]); });
                }));
                document.getElementById("taOutput").value = output.map(function (l) { return l.join('\t'); }).join('\n');
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

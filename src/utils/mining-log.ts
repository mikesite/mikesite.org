import {parseLootLog} from "../ch/console";
import {Index}        from "../helper/csv";
import {whenReady}    from "../helper/event";
import {flatMap}      from "../helper/map";

whenReady(() => {
    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let data: string[] = (document.getElementById("taLogData") as HTMLTextAreaElement).value.trim().split(/\n/);

            let results: { property: Index<string>, loot: Index<string>[] }[] = parseLootLog(data);

            let output: string[][] = [['AdventureId', 'AdventureName', 'AdventureLevel', 'BattleId', 'BattleName', 'ItemId', 'ClubSlot'],
                ...flatMap(results, (r: { property: Index<string>, loot: Index<string>[] }) => {
                let battleStat: string[] = [r.property.ID, r.property.displayname, r.property.level, r.property.battle, r.property.battledisplayname];
                return r.loot.map((l: Index<string>) => battleStat.concat([l.item, l.club]));
            })];

            (document.getElementById("taOutput") as HTMLTextAreaElement).value = output.map((l: string[]) => l.join('\t')).join('\n');
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

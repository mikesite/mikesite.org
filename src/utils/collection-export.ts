import {parseRawCollection} from "../ch/console";
import {whenReady}          from "../helper/event";

whenReady(() => {
    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let data: [number, number][] = parseRawCollection((document.getElementById("taLogData") as HTMLTextAreaElement).value);
            data.sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
            let output: (string | number)[][] = [["Item", "Count"], ...data];
            (document.getElementById("taOutput") as HTMLTextAreaElement).value = output.map((row: (string | number)[]) => row.join('\t')).join('\n');
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
});

define(["require", "exports", "../ch/console", "../helper/event"], function (require, exports, console_1, event_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var data = console_1.parseRawCollection(document.getElementById("taLogData").value);
                data.sort(function (a, b) { return a[0] - b[0]; });
                var output = [["Item", "Count"]].concat(data);
                document.getElementById("taOutput").value = output.map(function (row) { return row.join('\t'); }).join('\n');
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

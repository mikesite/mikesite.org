define(["require", "exports", "../ch/csvHandling", "../ch/figures", "../helper/csv", "../helper/elements", "../helper/event"], function (require, exports, csvHandling_1, figures_1, csv_1, elements_1, event_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        var anchors = document.createElement('DIV');
        anchors.style.marginTop = '20px';
        var anchorTable = document.createElement('TABLE');
        anchorTable.style.borderSpacing = '0';
        anchorTable.style.border = 'solid 1px';
        var colorChecker = elements_1.checkbox();
        colorChecker.addEventListener('change', function () {
            if (colorChecker.checked) {
                document.body.classList.remove('primaryColor');
            }
            else {
                document.body.classList.add('primaryColor');
            }
        });
        anchors.appendChild(elements_1.anchor('top'));
        anchors.appendChild(elements_1.text('Jump to figures '));
        anchors.appendChild(anchorTable);
        anchors.appendChild(elements_1.addLabel(colorChecker, 'show all color variants'));
        document.body.appendChild(anchors);
        var sections = {};
        for (var _i = 0, RACES_1 = figures_1.RACES; _i < RACES_1.length; _i++) {
            var race = RACES_1[_i];
            var anchorRow = anchorTable.insertRow();
            for (var _a = 0, _b = figures_1.figureBases([race]); _a < _b.length; _a++) {
                var base = _b[_a];
                var section = document.createElement('DIV');
                sections[base.join('')] = section;
                section.appendChild(elements_1.anchor(base.join('')));
                section.appendChild(elements_1.text(base.join(' ') + ' '));
                section.appendChild(elements_1.toAnchor('top'));
                section.appendChild(document.createElement('BR'));
                document.body.appendChild(document.createElement('HR'));
                document.body.appendChild(section);
                var anchorCell = anchorRow.insertCell();
                anchorCell.style.border = 'solid 1px';
                var anchorLabel = elements_1.notBreakable(elements_1.text(base.join(' ')));
                anchorLabel.style.margin = '3px';
                anchorCell.appendChild(elements_1.toAnchor(base.join(''), anchorLabel));
            }
        }
        csv_1.parseCsvData(csvHandling_1.loadCsvContent('figuresData')).sort(csv_1.textSort('Name')).forEach(function (figure) {
            var base = figure.get('Name').slice(0, -1);
            var section = sections[figure.get('Race') + figure.get('Character Class') + (/F/.test(figure.get('Name')) ? 'F' : 'M')];
            figures_1.COLORS.forEach(function (color) {
                var img = document.createElement('IMG');
                img.src = 'http://live.cardhunter.com/assets/large_portraits/' + base + color + '.png';
                img.classList.add('color' + color);
                section.appendChild(img);
            });
        });
    });
});

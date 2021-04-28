import {loadCsvContent}                                           from "../ch/csvHandling";
import {COLORS, figureBases, RACES}                               from "../ch/figures";
import {CsvItem, Index, parseCsvData, textSort}                   from "../helper/csv";
import {addLabel, anchor, checkbox, notBreakable, text, toAnchor} from "../helper/elements";
import {whenReady}                                                from "../helper/event";

whenReady(() => {
    let anchors: HTMLElement = document.createElement('DIV');
    anchors.style.marginTop = '20px';

    let anchorTable: HTMLTableElement = document.createElement('TABLE') as HTMLTableElement;
    anchorTable.style.borderSpacing = '0';
    anchorTable.style.border = 'solid 1px';

    let colorChecker: HTMLInputElement = checkbox();
    colorChecker.addEventListener('change', () => {
        if (colorChecker.checked) {
            document.body.classList.remove('primaryColor');
        } else {
            document.body.classList.add('primaryColor');
        }
    });

    anchors.appendChild(anchor('top'));
    anchors.appendChild(text('Jump to figures '));
    anchors.appendChild(anchorTable);
    anchors.appendChild(addLabel(colorChecker, 'show all color variants'));
    document.body.appendChild(anchors);

    let sections: Index<HTMLElement> = {};

    for (let race of RACES) {
        let anchorRow: HTMLTableRowElement = anchorTable.insertRow();
        for (let base of figureBases([race])) {
            let section: HTMLElement = document.createElement('DIV');
            sections[base.join('')] = section;
            section.appendChild(anchor(base.join('')));
            section.appendChild(text(base.join(' ') + ' '));
            section.appendChild(toAnchor('top'));
            section.appendChild(document.createElement('BR'));
            document.body.appendChild(document.createElement('HR'));
            document.body.appendChild(section);

            let anchorCell: HTMLTableCellElement = anchorRow.insertCell();
            anchorCell.style.border = 'solid 1px';
            let anchorLabel: HTMLElement = notBreakable(text(base.join(' ')));
            anchorLabel.style.margin = '3px';
            anchorCell.appendChild(toAnchor(base.join(''), anchorLabel));
        }
    }

    parseCsvData(loadCsvContent('figuresData')).sort(textSort('Name')).forEach((figure: CsvItem) => {
        let base: string = figure.get('Name').slice(0, -1);
        let section: HTMLElement = sections[figure.get('Race') + figure.get('Character Class') + (/F/.test(figure.get('Name')) ? 'F' : 'M')];
        COLORS.forEach((color: string) => {
            let img: HTMLImageElement = document.createElement('IMG') as HTMLImageElement;
            img.src = 'http://live.cardhunter.com/assets/large_portraits/' + base + color + '.png';
            img.classList.add('color' + color);
            section.appendChild(img);
        });
    });
});

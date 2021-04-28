import {CardQuality, CardType}        from "../ch/cards";
import {CsvItem, Index, parseCsvData} from "../helper/csv";
import {replaceAllChildren}           from "../helper/elements";
import {whenReady}                    from "../helper/event";
import {sum}                          from "../helper/functional";
import {includes}                     from "../helper/string";
import {
    attributeElement, svg, svgCircle, svgClip, svgClipPath, svgGroup, svgImage,
    svgRect, svgStyle, svgText, svgTextFromLines, svgTextStyle, svgTSpan
}                                     from "../helper/svg";

whenReady(() => {
    type EffectBox = { reaction: boolean, svgEl:SVGElement, lineCount:number,
        active:{ types:string, damage:string|undefined, range:string|undefined, move:string|undefined }|undefined,
        passive:{ type:string|undefined, roll:string|undefined }|undefined,
        text:string|undefined, flavor:string|undefined };

    type StyledEffect = { text:string, i:boolean, u:boolean };
    type EffectLine = StyledEffect[];

    function parseEffectText(text: string): EffectLine[] {
        let lines: EffectLine[] = [];
        let line: EffectLine = [];
        let i: number = 0;
        let u: number = 0;
        for (let pivot: number = text.indexOf('<'); pivot >= 0; pivot = text.indexOf('<')) {
            if (pivot > 0)
                line[line.length] = { text:text.substr(0, pivot), i:!!i, u:!!u };
            switch (text.substr(pivot + 1, 2)) {
                case 'i>':
                    i += 1;
                    break;
                case '/i':
                    i -= 1;
                    break;
                case 'u>':
                    u += 1;
                    break;
                case '/u':
                    u -= 1;
                    break;
                case 'br':
                    lines[lines.length] = line;
                    line = [];
                    break;
                default:
                    alert('Unrecognized style tag in text: ' + text.substr(pivot + 1, 2));
            }
            text = text.substr(text.indexOf('>') + 1);
        }
        if (text.length) {
            line[line.length] = { text:text, i:!!i, u:!!u };
        }
        lines[lines.length] = line;
        return lines;
    }

    function wrapLines(lines: EffectLine[], limit: number = 35): SVGElement[] {
        let spans: SVGElement[] = [];
        let rem: number;
        let style: (svgEl: SVGElement, eff: StyledEffect) => SVGElement = (svgEl: SVGElement, eff: StyledEffect) => {
            let attr: Index<string> = {};
            if (eff.i) {
                attr['font-style'] = 'italic';
            }
            if (eff.u) {
                attr['text-decoration'] = 'underline';
            }
            return attributeElement(svgEl, attr);
        };
        lines.forEach((l: EffectLine) => {
            rem = limit;
            l.forEach((eff: StyledEffect) => {
                let t: string = eff.text;
                do {
                    if (t.length <= rem) {
                        if (rem == limit) {
                            spans[spans.length] = style(svgTSpan(t, [false, '12'], [true, '1em']), eff);
                        } else {
                            spans[spans.length] = style(svgTSpan(t), eff);
                        }
                        rem = (t.length == rem) ? limit : rem - t.length;
                        t = '';
                    } else {
                        let pivot: number = t.lastIndexOf(' ', rem);
                        if (pivot < 0) {
                            if (rem == limit) {
                                spans[spans.length] = style(svgTSpan(t.substr(0, limit), [false, '12'], [true, '1em']), eff);
                                t = t.substr(limit);
                            } else {
                                rem = limit;
                            }
                        } else if (pivot == 0) {
                            t = t.substr(1);
                            rem = limit;
                        } else {
                            if (rem == limit) {
                                spans[spans.length] = style(svgTSpan(t.substr(0, pivot), [false, '12'], [true, '1em']), eff);
                            } else {
                                spans[spans.length] = style(svgTSpan(t.substr(0, pivot)), eff);
                            }
                            t = t.substr(pivot + 1);
                            rem = limit;
                        }
                    }
                } while (t.length);
            });
        });
        return spans;
    }

    function generateEffectText(effect: EffectBox): void {
        let textColor: string = effect.reaction ? 'white' : 'black';
        let lines: SVGElement[] = [];
        if ((!effect.text || !effect.text.trim()) && (!effect.flavor || !effect.flavor.trim())) {
            // no text here
        } else if (effect.text && effect.text.trim() && effect.flavor && effect.flavor.trim()) {
            lines = wrapLines([...parseEffectText(effect.text), [{ text: '\xa0', i:false, u:false }], ...parseEffectText('<i>' +effect.flavor + '</i>')]);
        } else if (effect.text && effect.text.trim()) {
            lines = wrapLines(parseEffectText(effect.text));
        } else if (effect.flavor && effect.flavor.trim()) {
            lines = wrapLines(parseEffectText('<i>' +effect.flavor + '</i>'));
        }
        effect.lineCount = lines.filter((l: SVGElement) => l.hasAttribute('dy')).length;
        if (lines.length) {
            lines[0]!.removeAttribute('dy');
        }
        effect.svgEl = svgTextStyle(svgTextFromLines('12', '212', ...lines), '13px', 'normal', 'start', textColor);
    }

    function generateEffectBox(effect: EffectBox, dy:string, height:number): void {
        let style: string = (effect.reaction ? 'fill:#3c3c3c;' : 'fill:#d9d4c4;') + 'stroke:black;stroke-width:2px;';
        let textColor: string = (effect.reaction ? 'white' : 'black');
        let effectTextStyle: (svgEl: SVGElement) => SVGElement = (svgEl: SVGElement) => svgTextStyle(svgEl, '15px', 'normal', 'start', textColor);
        let icons: SVGElement[] = [];
        let iconY: number = (197 + height - 18);
        if (effect.reaction && effect.passive) {
            if (effect.passive.roll && effect.passive.roll != "0") {
                icons[icons.length] = svgStyle(svgRect('5', '' + iconY, '40', '20'), style);
                icons[icons.length] = effectTextStyle(svgText('10', '' + (iconY + 15), effect.passive.roll.replace(/-/, '') + ' +'));
            }
            let type: string;
            switch (effect.passive.type) {
                case 'Armor': type = 'Armr'; break;
                case 'Block': type = 'Blck'; break;
                case 'Handicap': type = 'Hdcp'; break;
                case 'Boost':
                case 'Move':
                case 'Special':
                default: type = 'Spcl';
            }
            icons[icons.length] = svgStyle(svgRect('188', '' + iconY, '40', '20'), style);
            icons[icons.length] = effectTextStyle(svgText('193', '' + (iconY + 15), type));
        } else if (!effect.reaction && effect.active) {
            if (effect.active.damage) {
                icons[icons.length] = svgStyle(svgRect('5', '' + iconY, '40', '20'), style);
                icons[icons.length] = effectTextStyle(svgText('10', '' + (iconY + 15), 'D ' + effect.active.damage));
            } else if (effect.active.move) {
                icons[icons.length] = svgStyle(svgRect('5', '' + iconY, '40', '20'), style);
                icons[icons.length] = effectTextStyle(svgText('10', '' + (iconY + 15), 'M ' + effect.active.move));
            }
            if (effect.active.range) {
                icons[icons.length] = svgStyle(svgRect('188', '' + iconY, '40', '20'), style);
                icons[icons.length] = effectTextStyle(svgText('193', '' + (iconY + 15), 'R ' + effect.active.range));
            }
        }
        effect.svgEl = svgGroup('7', '197', 'translate(0,'+dy+')',
            svgStyle(svgRect('7', '197', '219', '' + height), style),
            effect.svgEl, ...icons
        );
    }

    function generateCard(card: CsvItem): SVGElement {
        const actionTypes: string[] = ['Attack', 'Assist', 'Move'];
        let effectBoxes: EffectBox[] = [];
        if (card.get('Text') || actionTypes.map(includes).some((p) => p(card.get('Types') || ''))) {
            effectBoxes[effectBoxes.length] = { reaction:false, text:card.get('Text'), flavor:card.get('Flavor Text'),
                active:{ types:card.get('Types'), damage:card.get('Damage'), range:card.get('Range'), move:card.get('Move Points') }
            } as EffectBox;
            if (card.get('Trigger Text')) {
                effectBoxes[effectBoxes.length] = { reaction:true, text:card.get('Trigger Text'),
                    passive:{ type:card.get('Trigger Effect'), roll:card.get('Trigger') } } as EffectBox;
            }
            if (card.get('Trigger Text 2')) {
                effectBoxes[effectBoxes.length] = { reaction:true, text:card.get('Trigger Text 2'),
                    passive:{ type:card.get('Trigger Effect 2'), roll:card.get('Trigger 2') } } as EffectBox;
            }
        } else if (card.get('Trigger Text')) {
            effectBoxes[effectBoxes.length] = { reaction:true, text:card.get('Trigger Text'), flavor:card.get('Flavor Text'),
                passive:{ type:card.get('Trigger Effect'), roll:card.get('Trigger') } } as EffectBox;
            if (card.get('Trigger Text 2')) {
                effectBoxes[effectBoxes.length] = { reaction:true, text:card.get('Trigger Text 2'),
                    passive:{ type:card.get('Trigger Effect 2'), roll:card.get('Trigger 2') } } as EffectBox;
            }
        } else if (card.get('Trigger Text 2')) {
            effectBoxes[effectBoxes.length] = { reaction:true, text:card.get('Trigger Text 2'), flavor:card.get('Flavor Text'),
                passive:{ type:card.get('Trigger Effect 2'), roll:card.get('Trigger 2') } } as EffectBox;
        } else {
            effectBoxes[effectBoxes.length] = { reaction:true, flavor:card.get('Flavor Text') } as EffectBox;
        }

        effectBoxes.forEach(generateEffectText);
        let lines: number = effectBoxes.map((e) => e.lineCount + 2).reduce(sum, 0);
        let lineHeight: number = (136 - 6 * effectBoxes.length) / lines;
        effectBoxes.reduce((dy: number, e: EffectBox) => {
            let h: number = lineHeight * (e.lineCount + 2);
            generateEffectBox(e, '' + Math.round(dy), Math.round(h));
            return dy + 6 + h;
            }, 0);

        let types: string[] = (card.get("Types") || '').split(/,/);
        let titleColor: string = card.get('Quality') == 'E' ? 'white' : 'black';
        let rarityColor: string = card.get('Rarity') == "Rare" ? '#588fef' : card.get('Rarity') == "Uncommon" ? '#60b62e' : '#d4cba0';

        let frame: SVGElement[] = [
            svgClipPath('card',
                svgRect('0', '0', '233', '333', '5', '5')),
            svgClip(svgStyle(svgRect('0', '0', '233', '25'), 'fill:' + CardQuality[card.get("Quality") || "D"]), 'card'),
            svgTextStyle(svgText('117', '17', card.get("Card Name") || '<No Name provided>'), '16px', 'bold', 'middle', titleColor),
            svgClip(svgStyle(svgRect('0', '27', '233', '306'), 'fill:' + (CardType[types[0]]) || 'black'), 'card'),
            svgClip(svgStyle(svgRect('118', '27', '115', '306'), 'fill:' + (CardType[types[1] || types[0]]) || 'black'), 'card')
        ];
        let illustration: SVGElement[] = [
            svgStyle(svgRect('7', '32', '219', '131'), 'fill:' + (CardType[types[0]] || 'black') + ';stroke:black;stroke-width:2px;'),
            (card.get('ImageUrl') && card.get('ImageUrl').trim())
                ? svgImage('8', '33', '217', '129', card.get('ImageUrl').trim())
                : svgImage('8', '33', '217', '129', 'http://live.cardhunter.com/assets/card_illustrations/' + card.get("Card Name") + '.png')
        ];
        let setIndicator: SVGElement[] = (card.get('Set') && card.get('Set') != '0') ? [
            svgStyle(svgCircle('24', '146', '13'), 'fill:black'),
            svgStyle(svgCircle('24', '146', '10.5'), 'fill:transparent;stroke:white;stroke-width:1px;'),
            svgTextStyle(svgText('24', '151', card.get("Set")), '14px', 'bold', 'middle', 'white')
        ] : [];
        let rarityIndicator: SVGElement[] = card.get('Rarity') ? [
            svgStyle(svgCircle('209', '146', '13'), 'fill:black'),
            svgStyle(svgCircle('209', '146', '10.5'), 'fill:transparent;stroke:'+rarityColor+';stroke-width:1px;'),
            svgTextStyle(svgText('209', '151', card.get("Rarity").charAt(0)), '14px', 'bold', 'middle', rarityColor)
        ] : [];
        let infoBox: SVGElement[] = [
            svgStyle(svgRect('7', '169', '219', '22'), 'fill:#aea280;stroke:black;stroke-width:2px;'),
            svgTextStyle(svgText('11', '183', (card.get("Attack Type") || "") + ' ' + (card.get("Damage Type") || "")), '12px', 'bold', 'start'),
            svgTextStyle(svgText('222', '183', card.get("Item") || "Card Generator"), '12px', 'bold', 'end')
        ];
        let effects: SVGElement[] = effectBoxes.map((e) => e.svgEl);
        return svg({viewBox: '0 0 233 333', style: 'background-color:rgb(0,0,0)'},
            ...frame, ...illustration, ...setIndicator , ...rarityIndicator, ...infoBox, ...effects);
    }

    document.getElementById("bProcess")!.addEventListener('click', () => {
        try {
            let cardData: CsvItem[] = parseCsvData((document.getElementById("taInput") as HTMLTextAreaElement).value.trim().split(/[\n\r]+/));
            replaceAllChildren(document.getElementById("results")!, cardData.map(generateCard));
            document.getElementById("bBack")!.style.display = '';
            document.getElementById("input")!.style.display = 'none';
        } catch (exception) {
            alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
            console.error(exception);
        }
    });
    document.getElementById("bBack")!.addEventListener('click', () => {
        document.getElementById("input")!.style.display = '';
        document.getElementById("bBack")!.style.display = 'none';
    });
});

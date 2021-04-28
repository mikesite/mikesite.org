define(["require", "exports", "../ch/cards", "../helper/csv", "../helper/elements", "../helper/event", "../helper/functional", "../helper/string", "../helper/svg"], function (require, exports, cards_1, csv_1, elements_1, event_1, functional_1, string_1, svg_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        function parseEffectText(text) {
            var lines = [];
            var line = [];
            var i = 0;
            var u = 0;
            for (var pivot = text.indexOf('<'); pivot >= 0; pivot = text.indexOf('<')) {
                if (pivot > 0)
                    line[line.length] = { text: text.substr(0, pivot), i: !!i, u: !!u };
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
                line[line.length] = { text: text, i: !!i, u: !!u };
            }
            lines[lines.length] = line;
            return lines;
        }
        function wrapLines(lines, limit) {
            if (limit === void 0) { limit = 35; }
            var spans = [];
            var rem;
            var style = function (svgEl, eff) {
                var attr = {};
                if (eff.i) {
                    attr['font-style'] = 'italic';
                }
                if (eff.u) {
                    attr['text-decoration'] = 'underline';
                }
                return svg_1.attributeElement(svgEl, attr);
            };
            lines.forEach(function (l) {
                rem = limit;
                l.forEach(function (eff) {
                    var t = eff.text;
                    do {
                        if (t.length <= rem) {
                            if (rem == limit) {
                                spans[spans.length] = style(svg_1.svgTSpan(t, [false, '12'], [true, '1em']), eff);
                            }
                            else {
                                spans[spans.length] = style(svg_1.svgTSpan(t), eff);
                            }
                            rem = (t.length == rem) ? limit : rem - t.length;
                            t = '';
                        }
                        else {
                            var pivot = t.lastIndexOf(' ', rem);
                            if (pivot < 0) {
                                if (rem == limit) {
                                    spans[spans.length] = style(svg_1.svgTSpan(t.substr(0, limit), [false, '12'], [true, '1em']), eff);
                                    t = t.substr(limit);
                                }
                                else {
                                    rem = limit;
                                }
                            }
                            else if (pivot == 0) {
                                t = t.substr(1);
                                rem = limit;
                            }
                            else {
                                if (rem == limit) {
                                    spans[spans.length] = style(svg_1.svgTSpan(t.substr(0, pivot), [false, '12'], [true, '1em']), eff);
                                }
                                else {
                                    spans[spans.length] = style(svg_1.svgTSpan(t.substr(0, pivot)), eff);
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
        function generateEffectText(effect) {
            var textColor = effect.reaction ? 'white' : 'black';
            var lines = [];
            if ((!effect.text || !effect.text.trim()) && (!effect.flavor || !effect.flavor.trim())) {
                // no text here
            }
            else if (effect.text && effect.text.trim() && effect.flavor && effect.flavor.trim()) {
                lines = wrapLines(parseEffectText(effect.text).concat([[{ text: '\xa0', i: false, u: false }]], parseEffectText('<i>' + effect.flavor + '</i>')));
            }
            else if (effect.text && effect.text.trim()) {
                lines = wrapLines(parseEffectText(effect.text));
            }
            else if (effect.flavor && effect.flavor.trim()) {
                lines = wrapLines(parseEffectText('<i>' + effect.flavor + '</i>'));
            }
            effect.lineCount = lines.filter(function (l) { return l.hasAttribute('dy'); }).length;
            if (lines.length) {
                lines[0].removeAttribute('dy');
            }
            effect.svgEl = svg_1.svgTextStyle(svg_1.svgTextFromLines.apply(void 0, ['12', '212'].concat(lines)), '13px', 'normal', 'start', textColor);
        }
        function generateEffectBox(effect, dy, height) {
            var style = (effect.reaction ? 'fill:#3c3c3c;' : 'fill:#d9d4c4;') + 'stroke:black;stroke-width:2px;';
            var textColor = (effect.reaction ? 'white' : 'black');
            var effectTextStyle = function (svgEl) { return svg_1.svgTextStyle(svgEl, '15px', 'normal', 'start', textColor); };
            var icons = [];
            var iconY = (197 + height - 18);
            if (effect.reaction && effect.passive) {
                if (effect.passive.roll && effect.passive.roll != "0") {
                    icons[icons.length] = svg_1.svgStyle(svg_1.svgRect('5', '' + iconY, '40', '20'), style);
                    icons[icons.length] = effectTextStyle(svg_1.svgText('10', '' + (iconY + 15), effect.passive.roll.replace(/-/, '') + ' +'));
                }
                var type = void 0;
                switch (effect.passive.type) {
                    case 'Armor':
                        type = 'Armr';
                        break;
                    case 'Block':
                        type = 'Blck';
                        break;
                    case 'Handicap':
                        type = 'Hdcp';
                        break;
                    case 'Boost':
                    case 'Move':
                    case 'Special':
                    default: type = 'Spcl';
                }
                icons[icons.length] = svg_1.svgStyle(svg_1.svgRect('188', '' + iconY, '40', '20'), style);
                icons[icons.length] = effectTextStyle(svg_1.svgText('193', '' + (iconY + 15), type));
            }
            else if (!effect.reaction && effect.active) {
                if (effect.active.damage) {
                    icons[icons.length] = svg_1.svgStyle(svg_1.svgRect('5', '' + iconY, '40', '20'), style);
                    icons[icons.length] = effectTextStyle(svg_1.svgText('10', '' + (iconY + 15), 'D ' + effect.active.damage));
                }
                else if (effect.active.move) {
                    icons[icons.length] = svg_1.svgStyle(svg_1.svgRect('5', '' + iconY, '40', '20'), style);
                    icons[icons.length] = effectTextStyle(svg_1.svgText('10', '' + (iconY + 15), 'M ' + effect.active.move));
                }
                if (effect.active.range) {
                    icons[icons.length] = svg_1.svgStyle(svg_1.svgRect('188', '' + iconY, '40', '20'), style);
                    icons[icons.length] = effectTextStyle(svg_1.svgText('193', '' + (iconY + 15), 'R ' + effect.active.range));
                }
            }
            effect.svgEl = svg_1.svgGroup.apply(void 0, ['7', '197', 'translate(0,' + dy + ')',
                svg_1.svgStyle(svg_1.svgRect('7', '197', '219', '' + height), style),
                effect.svgEl].concat(icons));
        }
        function generateCard(card) {
            var actionTypes = ['Attack', 'Assist', 'Move'];
            var effectBoxes = [];
            if (card.get('Text') || actionTypes.map(string_1.includes).some(function (p) { return p(card.get('Types') || ''); })) {
                effectBoxes[effectBoxes.length] = { reaction: false, text: card.get('Text'), flavor: card.get('Flavor Text'),
                    active: { types: card.get('Types'), damage: card.get('Damage'), range: card.get('Range'), move: card.get('Move Points') }
                };
                if (card.get('Trigger Text')) {
                    effectBoxes[effectBoxes.length] = { reaction: true, text: card.get('Trigger Text'),
                        passive: { type: card.get('Trigger Effect'), roll: card.get('Trigger') } };
                }
                if (card.get('Trigger Text 2')) {
                    effectBoxes[effectBoxes.length] = { reaction: true, text: card.get('Trigger Text 2'),
                        passive: { type: card.get('Trigger Effect 2'), roll: card.get('Trigger 2') } };
                }
            }
            else if (card.get('Trigger Text')) {
                effectBoxes[effectBoxes.length] = { reaction: true, text: card.get('Trigger Text'), flavor: card.get('Flavor Text'),
                    passive: { type: card.get('Trigger Effect'), roll: card.get('Trigger') } };
                if (card.get('Trigger Text 2')) {
                    effectBoxes[effectBoxes.length] = { reaction: true, text: card.get('Trigger Text 2'),
                        passive: { type: card.get('Trigger Effect 2'), roll: card.get('Trigger 2') } };
                }
            }
            else if (card.get('Trigger Text 2')) {
                effectBoxes[effectBoxes.length] = { reaction: true, text: card.get('Trigger Text 2'), flavor: card.get('Flavor Text'),
                    passive: { type: card.get('Trigger Effect 2'), roll: card.get('Trigger 2') } };
            }
            else {
                effectBoxes[effectBoxes.length] = { reaction: true, flavor: card.get('Flavor Text') };
            }
            effectBoxes.forEach(generateEffectText);
            var lines = effectBoxes.map(function (e) { return e.lineCount + 2; }).reduce(functional_1.sum, 0);
            var lineHeight = (136 - 6 * effectBoxes.length) / lines;
            effectBoxes.reduce(function (dy, e) {
                var h = lineHeight * (e.lineCount + 2);
                generateEffectBox(e, '' + Math.round(dy), Math.round(h));
                return dy + 6 + h;
            }, 0);
            var types = (card.get("Types") || '').split(/,/);
            var titleColor = card.get('Quality') == 'E' ? 'white' : 'black';
            var rarityColor = card.get('Rarity') == "Rare" ? '#588fef' : card.get('Rarity') == "Uncommon" ? '#60b62e' : '#d4cba0';
            var frame = [
                svg_1.svgClipPath('card', svg_1.svgRect('0', '0', '233', '333', '5', '5')),
                svg_1.svgClip(svg_1.svgStyle(svg_1.svgRect('0', '0', '233', '25'), 'fill:' + cards_1.CardQuality[card.get("Quality") || "D"]), 'card'),
                svg_1.svgTextStyle(svg_1.svgText('117', '17', card.get("Card Name") || '<No Name provided>'), '16px', 'bold', 'middle', titleColor),
                svg_1.svgClip(svg_1.svgStyle(svg_1.svgRect('0', '27', '233', '306'), 'fill:' + (cards_1.CardType[types[0]]) || 'black'), 'card'),
                svg_1.svgClip(svg_1.svgStyle(svg_1.svgRect('118', '27', '115', '306'), 'fill:' + (cards_1.CardType[types[1] || types[0]]) || 'black'), 'card')
            ];
            var illustration = [
                svg_1.svgStyle(svg_1.svgRect('7', '32', '219', '131'), 'fill:' + (cards_1.CardType[types[0]] || 'black') + ';stroke:black;stroke-width:2px;'),
                (card.get('ImageUrl') && card.get('ImageUrl').trim())
                    ? svg_1.svgImage('8', '33', '217', '129', card.get('ImageUrl').trim())
                    : svg_1.svgImage('8', '33', '217', '129', 'http://live.cardhunter.com/assets/card_illustrations/' + card.get("Card Name") + '.png')
            ];
            var setIndicator = (card.get('Set') && card.get('Set') != '0') ? [
                svg_1.svgStyle(svg_1.svgCircle('24', '146', '13'), 'fill:black'),
                svg_1.svgStyle(svg_1.svgCircle('24', '146', '10.5'), 'fill:transparent;stroke:white;stroke-width:1px;'),
                svg_1.svgTextStyle(svg_1.svgText('24', '151', card.get("Set")), '14px', 'bold', 'middle', 'white')
            ] : [];
            var rarityIndicator = card.get('Rarity') ? [
                svg_1.svgStyle(svg_1.svgCircle('209', '146', '13'), 'fill:black'),
                svg_1.svgStyle(svg_1.svgCircle('209', '146', '10.5'), 'fill:transparent;stroke:' + rarityColor + ';stroke-width:1px;'),
                svg_1.svgTextStyle(svg_1.svgText('209', '151', card.get("Rarity").charAt(0)), '14px', 'bold', 'middle', rarityColor)
            ] : [];
            var infoBox = [
                svg_1.svgStyle(svg_1.svgRect('7', '169', '219', '22'), 'fill:#aea280;stroke:black;stroke-width:2px;'),
                svg_1.svgTextStyle(svg_1.svgText('11', '183', (card.get("Attack Type") || "") + ' ' + (card.get("Damage Type") || "")), '12px', 'bold', 'start'),
                svg_1.svgTextStyle(svg_1.svgText('222', '183', card.get("Item") || "Card Generator"), '12px', 'bold', 'end')
            ];
            var effects = effectBoxes.map(function (e) { return e.svgEl; });
            return svg_1.svg.apply(void 0, [{ viewBox: '0 0 233 333', style: 'background-color:rgb(0,0,0)' }].concat(frame, illustration, setIndicator, rarityIndicator, infoBox, effects));
        }
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var cardData = csv_1.parseCsvData(document.getElementById("taInput").value.trim().split(/[\n\r]+/));
                elements_1.replaceAllChildren(document.getElementById("results"), cardData.map(generateCard));
                document.getElementById("bBack").style.display = '';
                document.getElementById("input").style.display = 'none';
            }
            catch (exception) {
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
        document.getElementById("bBack").addEventListener('click', function () {
            document.getElementById("input").style.display = '';
            document.getElementById("bBack").style.display = 'none';
        });
    });
});

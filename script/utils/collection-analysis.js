define(["require", "exports", "../ch/console", "../ch/csvHandling", "../ch/equipment", "../ch/wiki", "../helper/csv", "../helper/elements", "../helper/event", "../helper/functional", "../helper/map", "../parser/customFilter"], function (require, exports, console_1, csvHandling_1, equipment_1, wiki_1, csv_1, elements_1, event_1, functional_1, map_1, customFilter_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        function generateItemFilter() {
            function ternary(index, only) {
                return functional_1.or(functional_1.cnst(index == 1), functional_1.cond(index > 1, only, functional_1.not(only)));
            }
            var treasure = document.getElementById("includeTreasure").selectedIndex;
            var promo = document.getElementById("includePromo").selectedIndex;
            var noLoot = document.getElementById("includeNoLoot").selectedIndex;
            var gens = functional_1.array(6, function (gen) { return document.getElementById("includeGen" + gen).checked; });
            var genFilter = function (i) { return gens[parseInt(i.get('Set'))]; };
            return functional_1.and(genFilter, ternary(treasure, functional_1.compose(csv_1.getter('Slot'), functional_1.eql('Treasure'))), ternary(promo, equipment_1.seasonalItemFilter), ternary(noLoot, equipment_1.noLootFilter));
        }
        function parseCustomPredicate() {
            var disabled = function () { return true; };
            var predicate = document.getElementById("customPredicate").value.trim();
            if (!predicate) {
                return disabled;
            }
            try {
                var filter_1 = customFilter_1.parseCustomFilter(predicate);
                if (!extractors) {
                    var cardData = csv_1.parseCsvData(csvHandling_1.loadCsvContent('cardData'));
                    var cards = csv_1.csvMap(cardData, 'Card Name');
                    extractors = csvHandling_1.cardAndItemExtractors(itemHeader, itemData, csv_1.csvMap(itemData, "Equipment Name"), cardData, cards);
                }
                return function (o) { return filter_1(o, extractors); };
            }
            catch (exception) {
                alert("Whoops! Your custom item filter isn't a valid composed filter definition! No custom item filter is used for this analysis!");
                console.error(exception.toString());
                return disabled;
            }
        }
        var slotMaxVariants = map_1.isTotal(map_1.asKMap(csv_1.parseCsvData(document.getElementById('slotMaxVariants').innerHTML.trim().split(/[\n\r]+/)), csv_1.intGetter('Id')));
        function applyTargetItemCount(targetItemCount, target, collected, i, lst) {
            var count = targetItemCount[3](target, collected);
            if (count > 0) {
                lst.push([count, i]);
            }
        }
        function getTargetItemCount() {
            var selection = document.getElementById('slotMax').selectedIndex;
            var content = document.getElementById('hoverBoxSelection').selectedIndex;
            var contentExtractor;
            switch (content) {
                case 0:
                    contentExtractor = function (target, collected) { return target - collected; };
                    break;
                case 1:
                    contentExtractor = function (_target, collected) { return collected; };
                    break;
                case 2:
                    contentExtractor = function (target, _collected) { return target; };
                    break;
                case 3:
                default:
                    contentExtractor = function (target, collected) { return collected - target; };
                    break;
            }
            if (selection === 0) {
                return [content == 3, function () { return 1; }, true, contentExtractor];
            }
            var variant = slotMaxVariants((selection - 1) % 3 + 1);
            return [true, function (item) { return parseInt(variant.get(item.get('Slot'))) || 1; }, selection > 3, contentExtractor];
        }
        function getItemSortPolicy() {
            function textual(field) {
                return function (i1, i2) { return i1[1].get(field).localeCompare(i2[1].get(field)); };
            }
            function functional(f) {
                return function (i1, i2) { return f(i2) - f(i1); };
            }
            // higher numbers will be sorted first as all Keep sorts use this strategy
            function numerical(field, fallback) {
                if (fallback === void 0) { fallback = 0; }
                return functional(function (i) {
                    var value = parseInt(i[1].get(field));
                    return isNaN(value) ? fallback : value;
                });
            }
            // the sorting policy will reverse the given ordering
            // the keep tends to sort more valuable first but the ordering is typically written from least valuable to most valuable
            function positional(field, ordering) {
                return function (i1, i2) { return ordering.indexOf(i2[1].get(field)) - ordering.indexOf(i1[1].get(field)); };
            }
            var name = textual('Equipment Name');
            var value = functional(function (i) { return getItemCost(i[1], true); });
            var rarity = positional('Rarity', ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']);
            var level = numerical('Level');
            var talent = functional_1.stageSort(numerical('Talent 1', -1), numerical('Talent 2', -1));
            var count = functional(function (i) { return i[0]; });
            var sortIndex = document.getElementById('hoverBoxSort').selectedIndex;
            function reverseIfOdd(policy) {
                return functional_1.condSort(sortIndex % 2 == 0, policy, functional_1.reverseSort(policy));
            }
            switch (Math.floor(sortIndex / 2)) {
                case 0:
                    return reverseIfOdd(functional_1.stageSort(value, name));
                case 1:
                    return reverseIfOdd(functional_1.stageSort(rarity, name));
                case 2:
                    return reverseIfOdd(name);
                case 3:
                    return reverseIfOdd(functional_1.stageSort(level, name));
                case 4:
                    return reverseIfOdd(functional_1.stageSort(talent, name));
                case 5:
                    return reverseIfOdd(functional_1.stageSort(count, name));
                default:
                    return reverseIfOdd(name);
            }
        }
        function getItemCost(item, sell) {
            var equipmentCost = {
                Common: 5,
                Uncommon: 25,
                Rare: 100,
                Epic: 500,
                Legendary: 2500
            };
            var equipmentValue = {
                Common: 1,
                Uncommon: 2,
                Rare: 5,
                Epic: 20,
                Legendary: 100
            };
            var treasureValue = {
                Common: 2,
                Uncommon: 10,
                Rare: 40,
                Epic: 200,
                Legendary: 1000
            };
            return ((item.get('Slot') === 'Treasure') ? treasureValue : (sell ? equipmentValue : equipmentCost))[item.get('Rarity')] || 1;
        }
        function generateAspectClasses(items, aspects) {
            function generateClasses(items, aspect) {
                if (aspect) {
                    var extractor_1 = aspect[1] || csv_1.getter(aspect[0]);
                    var classes = items.map(extractor_1).filter(functional_1.distinct()).sort(aspect[2]);
                    return [aspect, classes.map(function (className) {
                            return [[className, aspect[3] ? aspect[3](className) : className], items.filter(function (i) { return extractor_1(i) == className; })];
                        })];
                }
                else {
                    return [null, [[['Total', 'Total'], items]]];
                }
            }
            return [null].concat(aspects).map(function (a) { return generateClasses(items, a); }).filter(function (a) { return a[1].length; });
        }
        function applyAspectClasses(classes, collection, targetItemCount) {
            function generateStatistics(items) {
                var raw = items.reduce(function (total, i) {
                    var target = targetItemCount[1](i);
                    var collected = collection(i);
                    applyTargetItemCount(targetItemCount, target, collected, i, total[2]);
                    collected = Math.min(collected, target);
                    if (targetItemCount[2]) {
                        collected = Math.floor(collected / target);
                        target = 1;
                    }
                    return [total[0] + collected, total[1] + target, total[2]];
                }, [0, 0, []]);
                return [Math.floor(raw[0] * 100 / raw[1] || 0), raw[0], raw[1] - raw[0], raw[1], raw[2]];
            }
            function applyClass(c) {
                return [c[0], c[1], generateStatistics(c[1])];
            }
            return classes.map(function (aspect) {
                return [aspect[0], aspect[1].map(applyClass)];
            });
        }
        function costValue(itemList, targetItemCount) {
            var challenge = [[1, 0, 'cost'], [0, 1, 'value'], [0, 1, 'of'], [1, 0, 'of'], [-1, -2, 'missing'], [-2, -1, 'excessing'], [0, 1, 'collected'], [1, 0, 'all']];
            var response = [];
            challenge.forEach(function (p) { return applyTargetItemCount(targetItemCount, p[0], p[1], p[2], response); });
            var label = response.map(function (e) { return e[1]; }).slice(0, 3).join(' ');
            var val = itemList.reduce(function (total, cur) { return total + cur[0] * getItemCost(cur[1], label[0] == 'v'); }, 0);
            return [label, val];
        }
        function generateHtmlReport(domain, hoverBoxParam) {
            function generateAspectTable(aspect) {
                var table = document.createElement('TABLE');
                table.classList.add('analysis');
                table.cellSpacing = '0';
                if (aspect[0]) {
                    var header_1 = table.createTHead().insertRow().insertCell();
                    header_1.colSpan = 7;
                    header_1.appendChild(elements_1.text(aspect[0][0]));
                }
                var body = table.createTBody();
                aspect[1].forEach(function (c) { return appendClassRow(body, c, aspect); });
                return table;
            }
            function appendClassRow(table, c, aspect) {
                var showCount = hoverBoxParam[1][0];
                function formatItem(i) {
                    return (showCount ? i[0] + 'x ' : '') + equipment_1.getQualifiedName(i[1]);
                }
                function createBar() {
                    var bar = document.createElement('SPAN');
                    bar.classList.add('bar');
                    var progress = document.createElement('SPAN');
                    progress.style.width = c[2][0] + '%';
                    bar.appendChild(progress);
                    return bar;
                }
                function createExclude() {
                    var exclude = document.createElement('INPUT');
                    exclude.type = 'image';
                    exclude.src = '../layout/exclude.svg';
                    exclude.title = 'Exclude items from next analysis';
                    exclude.addEventListener('click', function () {
                        var predicate = document.getElementById('customPredicate');
                        predicate.value = (predicate.value.trim() ? '(' + predicate.value.trim() + ') AND ' : '') + '[' + aspect[0][0] + '] != "' + c[0][0] + '"';
                    });
                    return exclude;
                }
                function createInfo() {
                    var info = document.createElement('INPUT');
                    info.type = 'image';
                    info.src = '../layout/info.svg';
                    info.title = 'Show more info ... (new tab)';
                    info.addEventListener('click', function () {
                        var ip = window.open('analysis-details.php', '_blank');
                        if (ip != null) {
                            var infoPage_1 = ip;
                            infoPage_1.window.addEventListener('load', function () {
                                infoPage_1.document.body.appendChild(elements_1.header(2, 'Showing details of all selected ' + (aspect[0] ? '"' + aspect[0][0] + ' ' + c[0][1] + '" ' : '') + 'items'));
                                var items = document.createElement('TABLE');
                                items.classList.add('detail');
                                var tHeader = document.createElement('TH');
                                tHeader.appendChild(elements_1.text('Name'));
                                items.createTHead().insertRow().appendChild(tHeader);
                                var tBody = items.createTBody();
                                c[2][4].forEach(function (i) {
                                    var link = document.createElement('A');
                                    link.href = wiki_1.Wiki.itemLink(i[1]);
                                    link.target = '_blank';
                                    link.appendChild(elements_1.text(formatItem(i)));
                                    tBody.insertRow().insertCell().appendChild(link);
                                });
                                infoPage_1.document.body.appendChild(items);
                            });
                        }
                    });
                    return info;
                }
                function prepareHoverBoxModification(row) {
                    row.addEventListener('mouseout', function () {
                        var hoverBox = document.getElementById("hover-box");
                        hoverBox.style.display = 'none';
                        elements_1.replaceAllChildren(hoverBox, []);
                    });
                    if (!c[2][4].length) {
                        row.addEventListener('mouseover', function () {
                            var hoverBox = document.getElementById("hover-box");
                            hoverBox.style.display = 'none';
                            elements_1.replaceAllChildren(hoverBox, []);
                        });
                    }
                    else {
                        c[2][4].sort(hoverBoxParam[2]);
                        var costOrValue = costValue(c[2][4], hoverBoxParam[1]);
                        var content_1 = [
                            'Total ' + costOrValue[0] + ' items: ' + costOrValue[1].toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,"),
                            ((c[2][1] === c[2][3])
                                ? '-- full collection --'
                                : (function () {
                                    var goal = Math.ceil(c[2][3] * (c[2][0] + 1) / 100);
                                    return 'Missing: ' + (goal - c[2][1]) + ' for ' + Math.floor(goal / c[2][3] * 100) + ' %' + ((goal === c[2][3]) ? '' : ' ; ' + c[2][2] + ' for 100 %');
                                })())
                        ].concat(((c[2][4].length > hoverBoxParam[0])
                            ? c[2][4].slice(0, hoverBoxParam[0] - 1).map(formatItem).concat(['... ' + (c[2][4].length - hoverBoxParam[0] + 1) + ' more omitted ...'])
                            : c[2][4].map(formatItem)));
                        row.addEventListener('mouseover', function () {
                            var lines = [elements_1.text(content_1[0])];
                            var hoverBox = document.getElementById("hover-box");
                            for (var i = content_1.length - 1; i > 0; i--) {
                                lines[2 * i] = elements_1.text(content_1[i]);
                                lines[2 * i - 1] = document.createElement('BR');
                            }
                            lines[2] = elements_1.italic(content_1[1]);
                            elements_1.replaceAllChildren(hoverBox, lines);
                            hoverBox.style.display = '';
                        });
                    }
                }
                var row = table.insertRow();
                if (c[2][0] >= 100) {
                    row.classList.add('complete');
                }
                row.insertCell().appendChild(aspect[0] ? elements_1.text(c[0][1]) : elements_1.bold(c[0][1]));
                row.insertCell().appendChild(elements_1.text(c[2][0] + ' %'));
                row.insertCell().appendChild(createBar());
                row.insertCell().appendChild(elements_1.text('' + c[2][1]));
                row.insertCell().appendChild(elements_1.text('/' + c[2][3]));
                if (aspect[0] && aspect[1].length > 1) {
                    row.insertCell().appendChild(createExclude());
                }
                else {
                    row.insertCell();
                }
                row.insertCell().appendChild(createInfo());
                prepareHoverBoxModification(row);
            }
            return domain.map(generateAspectTable);
        }
        function generateCsvReport(domain, targetItemCount) {
            function formatAspect(aspect) {
                function formatClass(c) {
                    return [aspect[0] ? aspect[0][0] : '', c[0][1], c[2][0], c[2][1], c[2][2], c[2][3], costValue(c[2][4], targetItemCount)[1]];
                }
                return aspect[1].map(formatClass);
            }
            var header = ['Aspect', 'Class', 'Percentage', 'Collected', 'Missing', 'Total', costValue([], targetItemCount)[0]];
            var content = map_1.flatMap(domain, formatAspect);
            return csv_1.toCsv([header].concat(content));
        }
        function generateItemExport(domain, targetItemCount) {
            var challenge = [[-1, -2, 'Missing'], [-2, -1, 'Excessing'], [0, 1, 'Collected'], [1, 0, 'All']];
            var response = [];
            challenge.forEach(function (p) { return applyTargetItemCount(targetItemCount, p[0], p[1], p[2], response); });
            var countLabel = 'Count of ' + response[0][1];
            function formatLine(item) {
                var content = aspects.map(function (asp) {
                    return asp[1].filter(function (c) {
                        return c[2][4].some(function (cItem) { return cItem[1].get('Id') === item[1].get('Id'); });
                    })[0][0][1];
                });
                content.push("" + item[0]);
                content.push(item[1].get('Equipment Name'));
                return content;
            }
            var items = domain.filter(function (a) { return !a[0]; })[0][1][0][2][4];
            var aspects = domain.filter(function (a) { return a[0]; });
            var content = items.map(formatLine);
            var header = aspects.map(function (asp) { return asp[0][0]; }).concat([countLabel, 'Item']);
            return csv_1.toCsv([header].concat(content));
        }
        var _a = csv_1.parseRawCsvData(csvHandling_1.loadCsvContent('equipmentData')), itemHeader = _a[0], itemData = _a[1];
        itemData = itemData.filter(functional_1.not(functional_1.or(equipment_1.slotDefaultFilter, equipment_1.specialItemFilter)));
        var extractors = undefined;
        function prepareReportSaving(report, items) {
            event_1.saveOnClick(document.getElementById('bReport'), 'data:text/csv;charset=utf-8,' + encodeURIComponent(report), 'report.csv');
            event_1.saveOnClick(document.getElementById('bItems'), 'data:text/csv;charset=utf-8,' + encodeURIComponent(items), 'items.csv');
        }
        function preventReportSaving() {
            document.getElementById('bReport').disabled = true;
            document.getElementById('bItems').disabled = true;
        }
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var items = itemData.filter(generateItemFilter());
                try {
                    items = items.filter(parseCustomPredicate());
                }
                catch (exception) {
                    alert("Whoops! The custom item filter didn't work as expected! The custom item filter wasn't applied this time!");
                    console.error(exception.toString());
                }
                var aspects = [
                    ['Set', undefined, undefined, function (set) { return ['Base', 'AotA', 'EttSC', 'Aloyzo', 'AI', 'CM'][parseInt(set)]; }],
                    ['Rarity', undefined, equipment_1.rarityNameSort, undefined],
                    ['Slot', undefined, undefined, undefined],
                    ['Level', undefined, function (l1, l2) { return parseInt(l1) - parseInt(l2); }, undefined]
                ];
                var classes = generateAspectClasses(items, aspects);
                var collection = console_1.parseCollection(document.getElementById('taLogData').value);
                var targetItemCount = getTargetItemCount();
                var domain = applyAspectClasses(classes, collection, targetItemCount);
                prepareReportSaving(generateCsvReport(domain, targetItemCount), generateItemExport(domain, targetItemCount));
                elements_1.replaceAllChildren(document.getElementById('results'), generateHtmlReport(domain, [16, targetItemCount, getItemSortPolicy()]));
            }
            catch (exception) {
                preventReportSaving();
                alert("Whoops! An error occurred.\nMore data can be found in the console.\n\n" + exception);
                console.error(exception);
            }
        });
    });
});

define(["require", "exports", "../ch/badges", "../ch/console", "../ch/csvHandling", "../helper/csv", "../helper/elements", "../helper/event", "../helper/functional", "../helper/map", "../helper/svg"], function (require, exports, badges_1, console_1, csvHandling_1, csv_1, elements_1, event_1, functional_1, map_1, svg_1) {
    "use strict";
    exports.__esModule = true;
    event_1.whenReady(function () {
        function generateAdventureFilter() {
            var locked = document.getElementById("includeLocked").checked;
            var mm = document.getElementById("includeMM").checked;
            var cOfC = document.getElementById("includeGen3").checked;
            // This extra handling was requested by Force.ofWill to separate Caverns of Chaos from Base Set
            // MM and CoC define no level
            var gens = functional_1.array(6, function (gen) { return document.getElementById("includeGen" + gen).checked; }).reduce(function (r, e, i) { r['' + i] = e; return r; }, { '': true });
            var genFilter = function (i) { return gens[i.get('Set')]; };
            return functional_1.and(genFilter, functional_1.or(functional_1.cnst(cOfC), functional_1.compose(csv_1.getter('Name'), functional_1.not(function (id) { return /^Caverns of Chaos/.test(id); }))), functional_1.compose(csv_1.getter('Type'), functional_1.eql('adventure')), functional_1.or(functional_1.cnst(locked), functional_1.compose(csv_1.getter('Tags'), functional_1.not(function (tags) { return /locked/.test(tags); }))), functional_1.or(functional_1.cnst(mm), functional_1.compose(csv_1.getter('ID'), functional_1.not(function (id) { return /^MM/.test(id); }))));
        }
        function determineReachableAdventures(advs, roots) {
            var unreachable = advs;
            var reachable = [];
            var flags = {};
            roots.forEach(function (flag) { return flags[flag] = true; });
            while (true) {
                var parts = functional_1.partition(unreachable, function (adv) {
                    var pre = adv.get('Prerequisite Flags');
                    return !pre || pre.split(/,/).every(function (req) { return flags[req]; });
                });
                if (!parts[0].length) {
                    return reachable;
                }
                reachable = reachable.concat(parts[0]);
                unreachable = parts[1];
                parts[0].forEach(function (adv) {
                    flags[adv.get('ID') + 'DONE'] = true;
                    var compl = adv.get('Completion Flags');
                    if (compl) {
                        compl.split(/,/).forEach(function (flag) { return flags[flag] = true; });
                    }
                });
            }
        }
        function createBadge(pct, pcts, style) {
            return badges_1.svgBadge(pcts, pct, functional_1.array(badges_1.SETS, function (gen) { return document.getElementById("includeGen" + gen).checked; }), [document.getElementById("includeLocked").checked, [
                    svg_1.svgRect('1', '5', '8', '5'), svg_1.svgPath('M 1 5 A 4.125 4.125 0 1 1 9 5 L 7 5 A 2.25 2.25 0 1 0 3 5 Z')
                ], 'fill:DarkGoldenrod;stroke:Black;'], [document.getElementById("includeMM").checked, [
                    svg_1.attributeElement(svg_1.svgText('0', '7', 'MM'), { 'font-family': 'monospace', 'font-size': '8', 'fill': 'purple', 'stroke': 'brown' })
                ], undefined], style);
        }
        function printAdvDetails(mode) {
            var header = document.createElement('B');
            if (mode[1].length) {
                header.appendChild(elements_1.text('Adventures not completed in mode "' + mode[0][0] + '":'));
                return [header,
                    document.createElement('BR')].concat((map_1.flatMap(mode[1], function (adv) { return [elements_1.notBreakable(elements_1.text(adv.get('Display Name') + ' |')), elements_1.text(' ')]; })), [document.createElement('HR')]);
            }
            else {
                header.appendChild(elements_1.text('All adventures in mode "' + mode[0][0] + '" completed!'));
                return [header, document.createElement('HR')];
            }
        }
        var advData = csv_1.parseCsvData(csvHandling_1.loadCsvContent('adventuresData'));
        function quest(predicate) {
            if (predicate === void 0) { predicate = function () { return true; }; }
            return function (adv) { return !/noQuests/.test(adv.get('Tags')) && predicate(adv); };
        }
        // process adventures
        document.getElementById("bProcess").addEventListener('click', function () {
            try {
                var advs_1;
                // the reachability check is necessary because the csv may contain un-reachable adventures (placeholder-info)
                // but without base set no adventures are reachable as completing the tutorial only enables base set adventures
                // in case base set is included the check is done after filtering to only process actual reachables based on settings
                // in case base set is excluded the check is done before filtering to still exclude placeholder adventures
                if (document.getElementById("includeGen0").checked) {
                    advs_1 = determineReachableAdventures(advData.filter(generateAdventureFilter()), ['TUTSHWAD']);
                }
                else {
                    advs_1 = determineReachableAdventures(advData, ['TUTSHWAD']).filter(generateAdventureFilter());
                }
                advs_1 = advs_1.sort(function (a1, a2) {
                    function neg(val, n) {
                        return (val < 0) ? n : val;
                    }
                    function undef(val, n) {
                        return val ? val : n;
                    }
                    return (neg(parseInt(a1.get('Level')), 1000) - neg(parseInt(a2.get('Level')), 1000)) ||
                        (undef(parseInt(a1.get('Set')), 100) - undef(parseInt(a2.get('Set')), 100)) ||
                        (a1.get('Display Name').localeCompare(a2.get('Display Name')));
                });
                var flags_1 = console_1.parseCampaignFlags(document.getElementById('taLogData').value);
                var modes = [
                    // regular
                    ['Regular', 'DONE', function () { return true; }],
                    // No party deaths
                    ['Quest: No party deaths', 'QST0', quest()],
                    // All your levels are reduced to xx
                    ['Quest: Reduced levels', 'QST1', quest(function (adv) { return parseInt(adv.get('Level')) > 8; })],
                    // Use only RACE CLASS
                    ['Quest: Character limitation', 'QST2', quest(function (adv) { return !!(adv.get('Quest Class Restriction') || adv.get('Quest Race Restriction')); })],
                    // Party has one health
                    ['Quest: One health', 'QST3', quest()],
                    // Equip only items with a Handicap card
                    ['Quest: Handicap items', 'QST4', quest()],
                    // in co-op
                    ['Co-op', 'COOP', function () { return true; }]
                ];
                var progressByMode = modes.map(function (mode) {
                    var available = advs_1.filter(mode[2]);
                    var parts = functional_1.partition(available, function (adv) { return flags_1(adv.get('ID') + mode[1]); });
                    return [mode, parts[1], [parts[0].length, available.length, available.length ? (parts[0].length / available.length) : 0]];
                });
                var total = progressByMode.reduce(function (total, mode) { return [total[0] + mode[2][0], total[1] + mode[2][1]]; }, [0, 0]);
                var totalPct = total[1] ? total[0] / total[1] : 0;
                var badge = createBadge(totalPct, progressByMode.map(function (mode) { return mode[2][2]; }), badges_1.STYLE_SCHEMES[0]);
                elements_1.replaceAllChildren(document.getElementById('details'), map_1.flatMap(progressByMode.map(function (p) { return [p[0], p[1]]; }), printAdvDetails));
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

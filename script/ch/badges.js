define(["require", "exports", "../helper/svg"], function (require, exports, svg_1) {
    "use strict";
    exports.__esModule = true;
    /**
     * Contains helper functions to ease the dynamic creation of badges.
     */
    /**
     * The number of sets that were released for the game.
     * Currently we have the base set and five expansion sets.
     * @type {number}
     */
    exports.SETS = 6;
    /**
     * Represents the number of campaign modes:
     * Regular + all possible quest modes + coop mode.
     * @type {number}
     */
    exports.CAMPAIGN_BARS = 7;
    /**
     * Represents the levels of all available items.
     * Currently there are items of level 1 to 21 plus one level 30 treasure.
     * @type {number}
     */
    exports.COLLECTION_BARS = 22;
    /**
     * Calculates the size the bars have in one dimension.
     * @param {number} bars The number of bars.
     * @returns {number} Their size.
     */
    function barSize(bars) {
        return bars * 6 - 2;
    }
    exports.barSize = barSize;
    /**
     * The height of the bar-segment. Is defined by the (maximum) number of bars in the campaign badge.
     * @type {number}
     */
    exports.BAR_HEIGHT = barSize(exports.CAMPAIGN_BARS);
    /**
     * The width of the bar-segment. Is defined by the (maximum) number of bars in the collection badge.
     * @type {number}
     */
    exports.BAR_WIDTH = barSize(exports.COLLECTION_BARS);
    /**
     * The badge's height is defined by the number of bars a campaign badge needs plus the height the summary section needs.
     * @type {number}
     */
    exports.HEIGHT = exports.BAR_HEIGHT + 2 * (3 + 5 + 1) + (24 + 2 * 3 + 5);
    /**
     * The badge's width is defined by the number of bars a collection badge needs.
     * @type {number}
     */
    exports.WIDTH = exports.BAR_WIDTH + 2 * (3 + 5 + 1);
    /**
     * Defines styling schemes for several use cases.
     * @type {ReadonlyArray<Readonly<Index<string>>>}
     */
    exports.STYLE_SCHEMES = Object.freeze([
        Object.freeze({ background: 'fill:Beige;stroke:Black;', bars: 'fill:#6666FF;', empty: 'fill:Silver;', full: 'fill:LimeGreen;', total: 'White', genMark: 'stroke:Black;stroke-width:0.5;' }),
        Object.freeze({ background: 'fill:MidnightBlue;stroke:Red;', bars: 'fill:LimeGreen;', empty: 'fill:Gold;', full: 'fill:Silver;', total: 'Navy', genMark: 'stroke:Black;stroke-width:0.5;' })
    ]);
    /**
     * Creates the bar-segment based on the given parameter.
     * @param {number} x The left most point of the segment.
     * @param {number} y The top most point of the segment.
     * @param {number[]} pcts The percentages for the individual bars.
     * @param {Readonly<Index<string>>} style The styling to use for the bars.
     * @param {boolean} vertical Whether the bars should be layouted vertically.
     * @returns {SVGElement} The created bar segment.
     */
    function svgBars(x, y, pcts, style, vertical) {
        var cnt = Math.min(pcts.length, vertical ? exports.COLLECTION_BARS : exports.CAMPAIGN_BARS);
        return svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(' + (x + (vertical ? (exports.COLLECTION_BARS - cnt) * 3 : 0)) + ',' + (y + (vertical ? 0 : (exports.CAMPAIGN_BARS - cnt) * 3)) + ')',
            svg_1.svgStyle(svg_1.svgRect('-3', '-3', '' + (exports.BAR_WIDTH + 6 - (vertical ? (exports.COLLECTION_BARS - cnt) * 6 : 0)), '' + (exports.BAR_HEIGHT + 6 - (vertical ? 0 : (exports.CAMPAIGN_BARS - cnt) * 6)), '5', '5'), style['background'])].concat(pcts.slice(0, cnt).map(function (pct, i) {
            var x = vertical ? i * 6 : 0;
            var y = vertical ? exports.BAR_HEIGHT - Math.round(pct * exports.BAR_HEIGHT) : i * 6;
            var width = vertical ? 4 : Math.round(pct * exports.BAR_WIDTH);
            var height = vertical ? Math.round(pct * exports.BAR_HEIGHT) : 4;
            return svg_1.svgStyle(svg_1.svgRect('' + x, '' + y, '' + width, '' + height), style[(pct >= 1) ? 'full' : 'bars']);
        })));
    }
    exports.svgBars = svgBars;
    /**
     * Creates the generation indicating diamonds.
     * @param {number} x The right most point of the segment.
     * @param {number} y The top most point of the segment.
     * @param {boolean[]} gens The activation status of the generations.
     * @param {Readonly<Index<string>>} style The styling to use for the segment.
     * @returns {SVGElement} The created diamond segment.
     */
    function svgGenerationDiamonds(x, y, gens, style) {
        var cnt = Math.min(gens.length, exports.SETS);
        var width = Math.ceil(cnt / 2);
        return svg_1.svgStyle(svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(' + (x - width * 11) + ',' + y + ')'].concat(gens.slice(0, cnt).map(function (gen, i) { return svg_1.svgGroup('0', '0', 'translate(' + (Math.floor(i / 2) * 11 + 6) + ',' + ((i % 2) * 11 + 2) + ')', svg_1.attributeElement(svg_1.svgRect('0', '0', '6', '6'), { transform: 'rotate(45)', style: 'fill:hsl(' + (i * 360 / cnt) + ',100%,' + (gen ? '50%' : '100%') + ');' })); }))), style['genMark']);
    }
    exports.svgGenerationDiamonds = svgGenerationDiamonds;
    /**
     * Creates a segment for additional marks that are badge specific.
     * @param {number} x The left most point of the segment.
     * @param {number} y The top most point of the segment.
     * @param {[boolean , SVGElement[] , string]} m1 The element to display and whether to display it.
     * @param {[boolean , SVGElement[] , string]} m2 The element to display and whether to display it.
     * @returns {SVGElement} The created segment with special marks.
     */
    function svgMarks(x, y, m1, m2) {
        var marks = [];
        if (m1[0]) {
            if (m1[2])
                marks[marks.length] = svg_1.svgStyle(svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(0,1)'].concat(m1[1])), m1[2]);
            else
                marks[marks.length] = svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(0,1)'].concat(m1[1]));
        }
        if (m2[0]) {
            if (m2[2])
                marks[marks.length] = svg_1.svgStyle(svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(0,13)'].concat(m2[1])), m2[2]);
            else
                marks[marks.length] = svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(0,13)'].concat(m2[1]));
        }
        return svg_1.svgGroup.apply(void 0, ['0', '0', 'translate(' + x + ',' + y + ')'].concat(marks));
    }
    exports.svgMarks = svgMarks;
    /**
     * Creates a whole badge svg element based on a common scheme.
     * @param {number[]} pcts The percentages for the individual bars.
     * @param {number} pct The overall percentage.
     * @param {boolean[]} gens The activation status of the generations.
     * @param {[boolean , SVGElement[] , string]} m1 The element to display and whether to display it.
     * @param {[boolean , SVGElement[] , string]} m2 The element to display and whether to display it.
     * @param {Readonly<Index<string>>} style The styling to use for the segment.
     * @param {boolean} vertical Whether the bars should be layouted vertically.
     * @returns {SVGElement} The created badge.
     */
    function svgBadge(pcts, pct, gens, m1, m2, style, vertical) {
        return svg_1.svg({ width: '' + exports.WIDTH, height: '' + exports.HEIGHT }, svg_1.svgStyle(svg_1.svgRect('1', '1', '' + (exports.WIDTH - 2), '' + (exports.HEIGHT - 2), '5', '5'), style['background']), svgBars(9, 9, pcts, style, vertical), svg_1.svgGroup('0', '0', 'translate(9,' + (exports.HEIGHT - 30 - 3) + ')', svg_1.svgStyle(svg_1.svgRect('-3', '-3', '' + (exports.BAR_WIDTH + 6), '' + (24 + 6), '5', '5'), style['background']), svg_1.svgStyle(svg_1.svgRect('0', '0', '' + exports.BAR_WIDTH, '24'), style['empty']), svg_1.svgStyle(svg_1.svgRect('0', '0', '' + Math.round(exports.BAR_WIDTH * pct), '24'), style[(pct >= 1) ? 'full' : 'bars']), svg_1.attributeElement(svg_1.svgText('2', '19', Math.floor(pct * 100) + '%'), { 'font-size': '24', 'font-family': 'monospace', 'fill': style['total'] }), svgGenerationDiamonds(exports.BAR_WIDTH - 13, 0, gens, style), svgMarks(exports.BAR_WIDTH - 11, 0, m1, m2)));
    }
    exports.svgBadge = svgBadge;
});

import {Index}                                                        from "../helper/csv";
import {attributeElement, svg, svgGroup, svgRect, svgStyle, svgText}  from "../helper/svg";

/**
 * Contains helper functions to ease the dynamic creation of badges.
 */

/**
 * The number of sets that were released for the game.
 * Currently we have the base set and five expansion sets.
 * @type {number}
 */
export const SETS: number = 6;

/**
 * Represents the number of campaign modes:
 * Regular + all possible quest modes + coop mode.
 * @type {number}
 */
export const CAMPAIGN_BARS: number = 7;

/**
 * Represents the levels of all available items.
 * Currently there are items of level 1 to 21 plus one level 30 treasure.
 * @type {number}
 */
export const COLLECTION_BARS: number = 22;

/**
 * Calculates the size the bars have in one dimension.
 * @param {number} bars The number of bars.
 * @returns {number} Their size.
 */
export function barSize(bars: number): number {
    return bars * 6 - 2;
}

/**
 * The height of the bar-segment. Is defined by the (maximum) number of bars in the campaign badge.
 * @type {number}
 */
export const BAR_HEIGHT: number = barSize(CAMPAIGN_BARS);

/**
 * The width of the bar-segment. Is defined by the (maximum) number of bars in the collection badge.
 * @type {number}
 */
export const BAR_WIDTH: number = barSize(COLLECTION_BARS);

/**
 * The badge's height is defined by the number of bars a campaign badge needs plus the height the summary section needs.
 * @type {number}
 */
export const HEIGHT: number = BAR_HEIGHT + 2 * (3 + 5 + 1) + (24 + 2 * 3 + 5);
/**
 * The badge's width is defined by the number of bars a collection badge needs.
 * @type {number}
 */
export const WIDTH: number = BAR_WIDTH + 2 * (3 + 5 + 1);

/**
 * Defines styling schemes for several use cases.
 * @type {ReadonlyArray<Readonly<Index<string>>>}
 */
export const STYLE_SCHEMES: ReadonlyArray<Readonly<Index<string>>> = Object.freeze([
    Object.freeze({background:'fill:Beige;stroke:Black;', bars:'fill:#6666FF;', empty:'fill:Silver;', full:'fill:LimeGreen;', total:'White', genMark:'stroke:Black;stroke-width:0.5;'}),
    Object.freeze({background:'fill:MidnightBlue;stroke:Red;', bars:'fill:LimeGreen;', empty:'fill:Gold;', full:'fill:Silver;', total:'Navy', genMark:'stroke:Black;stroke-width:0.5;'})]);

/**
 * Creates the bar-segment based on the given parameter.
 * @param {number} x The left most point of the segment.
 * @param {number} y The top most point of the segment.
 * @param {number[]} pcts The percentages for the individual bars.
 * @param {Readonly<Index<string>>} style The styling to use for the bars.
 * @param {boolean} vertical Whether the bars should be layouted vertically.
 * @returns {SVGElement} The created bar segment.
 */
export function svgBars(x: number, y: number, pcts: number[], style: Readonly<Index<string>>, vertical?: boolean): SVGElement {
    let cnt: number = Math.min(pcts.length, vertical ? COLLECTION_BARS : CAMPAIGN_BARS);
    return svgGroup('0', '0', 'translate(' + (x + (vertical ? (COLLECTION_BARS - cnt) * 3 : 0)) + ',' + (y + (vertical ? 0 : (CAMPAIGN_BARS - cnt) * 3)) + ')',
        svgStyle(svgRect('-3', '-3', '' + (BAR_WIDTH + 6 - (vertical ? (COLLECTION_BARS - cnt) * 6 : 0)), '' + (BAR_HEIGHT + 6 - (vertical ? 0 : (CAMPAIGN_BARS - cnt) * 6)), '5', '5'), style['background']),
        ...pcts.slice(0, cnt).map((pct: number, i: number) => {
        let x: number = vertical ? i * 6 : 0;
        let y: number = vertical ? BAR_HEIGHT - Math.round(pct * BAR_HEIGHT) : i * 6;
        let width: number = vertical ? 4 : Math.round(pct * BAR_WIDTH);
        let height: number = vertical ? Math.round(pct * BAR_HEIGHT) : 4;
        return svgStyle(svgRect('' + x, '' + y, '' + width, '' + height), style[(pct >= 1) ? 'full' : 'bars'])
    }));
}

/**
 * Creates the generation indicating diamonds.
 * @param {number} x The right most point of the segment.
 * @param {number} y The top most point of the segment.
 * @param {boolean[]} gens The activation status of the generations.
 * @param {Readonly<Index<string>>} style The styling to use for the segment.
 * @returns {SVGElement} The created diamond segment.
 */
export function svgGenerationDiamonds(x: number, y: number, gens: boolean[], style: Readonly<Index<string>>): SVGElement {
    let cnt: number = Math.min(gens.length, SETS);
    let width: number = Math.ceil(cnt / 2);
    return svgStyle(svgGroup('0', '0', 'translate(' + (x - width * 11) + ',' + y + ')',
        ...gens.slice(0, cnt).map((gen: boolean, i: number) => svgGroup('0', '0', 'translate(' + (Math.floor(i / 2) * 11 + 6) + ',' + ((i % 2) * 11 + 2) + ')',
            attributeElement(svgRect('0', '0', '6', '6'), { transform:'rotate(45)', style:'fill:hsl(' + (i * 360 / cnt) + ',100%,' + (gen ? '50%' : '100%') + ');' })
        ))), style['genMark']);
}

/**
 * Creates a segment for additional marks that are badge specific.
 * @param {number} x The left most point of the segment.
 * @param {number} y The top most point of the segment.
 * @param {[boolean , SVGElement[] , string]} m1 The element to display and whether to display it.
 * @param {[boolean , SVGElement[] , string]} m2 The element to display and whether to display it.
 * @returns {SVGElement} The created segment with special marks.
 */
export function svgMarks(x: number, y: number, m1: [boolean, SVGElement[], string | undefined], m2: [boolean, SVGElement[], string | undefined]): SVGElement {
    let marks: SVGElement[] = [];
    if (m1[0]) {
        if (m1[2])
            marks[marks.length] = svgStyle(svgGroup('0', '0', 'translate(0,1)', ...m1[1]), m1[2]!);
        else
            marks[marks.length] = svgGroup('0', '0', 'translate(0,1)', ...m1[1]);
    }
    if (m2[0]) {
        if (m2[2])
            marks[marks.length] = svgStyle(svgGroup('0', '0', 'translate(0,13)', ...m2[1]), m2[2]!);
        else
            marks[marks.length] = svgGroup('0', '0', 'translate(0,13)', ...m2[1]);
    }
    return svgGroup('0', '0', 'translate(' + x + ',' + y + ')', ...marks);
}

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
export function svgBadge(pcts: number[], pct: number, gens: boolean[], m1: [boolean, SVGElement[], string | undefined],
                         m2: [boolean, SVGElement[], string | undefined], style: Readonly<Index<string>>, vertical?: boolean): SVGElement {
    return svg({width: '' + WIDTH, height: '' + HEIGHT},
        svgStyle(svgRect('1', '1', '' + (WIDTH - 2), '' + (HEIGHT - 2), '5', '5'), style['background']),
        svgBars(9, 9, pcts, style, vertical),
        svgGroup('0', '0', 'translate(9,' + (HEIGHT - 30 - 3) + ')',
            svgStyle(svgRect('-3', '-3', '' + (BAR_WIDTH + 6), '' + (24 + 6), '5', '5'), style['background']),
            svgStyle(svgRect('0', '0', '' + BAR_WIDTH, '24'), style['empty']),
            svgStyle(svgRect('0', '0', '' + Math.round(BAR_WIDTH * pct), '24'), style[(pct >= 1) ? 'full' : 'bars']),
            attributeElement(svgText('2', '19', Math.floor(pct * 100) + '%'), { 'font-size': '24', 'font-family': 'monospace', 'fill': style['total'] }),
            svgGenerationDiamonds(BAR_WIDTH - 13, 0, gens, style),
            svgMarks(BAR_WIDTH - 11, 0, m1, m2)
        )
    );
}

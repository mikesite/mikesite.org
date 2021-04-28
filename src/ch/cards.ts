import {CsvItem, getter, Index} from "../helper/csv";

/**
 * This type defines the necessary information to layout a card image at different scales.
 */
export type CardDim = Readonly<{styleClass: string, width: number, height: number, border: number, hybridCut: number,
    titleHeight: number, titleSize: number, titleText: (c: CsvItem) => string, imgMargin: number, imgWidth: number, imgHeight: number, statusHeight?: number,
    indicatorBorder: number, indicatorWidth: number, indicatorHeight: number, indicatorOffset?: number, blockMargin?: number
}>;

/**
 * Defines dimensions for thumbnail sized card images.
 * @type {CardDim}
 */
export const ThumbnailDim: CardDim = Object.freeze({styleClass: 'thumbnail', width: 70, height: 97, border: 2, hybridCut: 34,
    titleHeight: 14, titleSize: 10, titleText: (c: CsvItem) => c.get('Short Name') || c.get('Card Name'), imgMargin: 2, imgWidth: 62, imgHeight: 37,
    indicatorBorder: 1, indicatorWidth: 30, indicatorHeight: 14});

/**
 * Defines dimensions for full-sized card images.
 * @type {CardDim}
 */
export const FullSizeDim: CardDim = Object.freeze({styleClass: 'fullSize', width: 234, height: 333, border: 2, hybridCut: 119,
    titleHeight: 25, titleSize: 18, titleText: getter('Card Name'), imgMargin: 4, imgWidth: 217, imgHeight: 129, statusHeight: 20,
    indicatorBorder: 2, indicatorWidth: 38, indicatorHeight: 18, indicatorOffset: 2, blockMargin: 5});

/**
 * Maps card types to their background color.
 * @type {Readonly<Index<string>>}
 */
export const CardType: Readonly<Index<string>> = Object.freeze({
    Armor: '#737f84',
    Assist: '#c8dbde',
    Attack: '#802726',
    Block: '#4c7e2d',
    Boost: '#ba520e',
    Handicap: '#1f2423',
    Move: '#29547b',
    Utility: '#5e4369'
});

/**
 * Maps card qualities to their title color.
 * @type {Readonly<Index<string>>}
 */
export const CardQuality: Readonly<Index<string>> = Object.freeze({
    AAA: '#7a24cd',
    AA: '#51b611',
    A: '#c7b058',
    B: '#98b0b9',
    C: '#b1866e',
    D: '#aca07f',
    E: '#242424'
});

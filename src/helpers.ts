import _ from 'lodash';
import chroma from 'chroma-js';
import Color from 'color';
import { easeQuadOut } from 'd3-ease';
import { interpolateNumber } from 'd3-interpolate';
import { simulate, type Deficiency } from '@bjornlu/colorblind';
import type { RGB } from '@bjornlu/colorblind/dist/types';
import { rgbToHsluv, hsluvToRgb } from './format';
import type { HSLuvColour } from './types';

// https://gist.github.com/ryancat/9972419b2a78f329ce3aebb7f1a09152
export function deltaE(hslA: HSLuvColour, hslB: HSLuvColour): number {
    const lchA = hsluvToRgb(hslA);
    const lchB = hsluvToRgb(hslB);
    return chroma.deltaE(lchA, lchB) / 100; // as 0 -> 1
}

export function getRandomColourFromColours(
    rgbColours: string[],
    minDifference = 0.2,
    saturation: [number, number] = [0.4, 1],
    lightness: [number, number] = [0.2, 0.8]
): string {
    let tries = 0;
    while (tries < 100) {
        const randomHSLuvColour: HSLuvColour = [
            Math.random() * 360,
            _.random(saturation[0], saturation[1], true) * 100,
            _.random(lightness[0], lightness[1], true) * 100
        ];

        if (!rgbColours.some(c => deltaE(randomHSLuvColour, rgbToHsluv(c)) < minDifference)) {
            return hsluvToRgb(randomHSLuvColour);
        }
        tries += 1;
    }
    return 'black';
}

export function generateRandomColours(
    numColours: number,
    initColours: string[] = [],
    minDifference = 0.2,
    saturation: [number, number] = [0.4, 1],
    lightness: [number, number] = [0.2, 0.8]
): string[] {
    if (initColours.length >= numColours) return initColours;

    const colours = [...initColours];
    _.times(numColours - colours.length, () => {
        colours.push(getRandomColourFromColours(
            colours,
            minDifference,
            saturation,
            lightness
        ));
    });
    return colours;
}

export function sequentialColourScale(
    baseColour: string | null,
    numColours: number,
    options?: {
        hueShift?: number; // -1 to +1 (0)
        saturationShift?: number; // 0 to 1 (0)
        lightnessShift?: number; // 0 to 1 (1)
        useNeutral?: boolean;
    }
): (string | null)[] | null {
    if (numColours < 2) return null;
    if (!baseColour) return Array<null>(numColours).fill(null);

    const addedExtra = options?.useNeutral === false;
    const numColoursWithWhite = numColours + (addedExtra ? 1 : 0);

    const hueS = _.clamp(options?.hueShift ?? 0, -1, 1);
    const satS = _.clamp(options?.saturationShift ?? 0, 0, 1);
    const lgtS = _.clamp(options?.lightnessShift ?? 1, 0, 1);

    const hsluvBase = rgbToHsluv(baseColour);
    const [srcHue, srcSat, srcLgt] = hsluvBase;

    const hue = interpolateNumber(srcHue, srcHue + 360 * hueS);
    const sat = interpolateNumber(srcSat, srcSat * (1 - satS));
    const lgt = interpolateNumber(srcLgt, srcLgt + (100 - srcLgt) * lgtS);

    return _.times(numColoursWithWhite, n => {
        const interp = n / (numColoursWithWhite - 1);
        const hsluvResult: HSLuvColour = [
            hue(interp) % 360,
            sat(interp),
            lgt(easeQuadOut(interp))
            // lgt(interp)
        ];
        return hsluvToRgb(hsluvResult);
    })
        .reverse()
        .filter(
            (c, i) => (!addedExtra || i > 0)
        );
}

export function divergingColourScale(
    startColour: string | null,
    endColour: string | null,
    numColours: number,
    options?: {
        hueShift?: number; // -1 to +1 (0)
        saturationShift?: number; // 0 to 1 (0)
        lightnessShift?: number; // 0 to 1 (1)
    }
) {
    if (numColours < 5) return null;
    if (!startColour && !endColour) return Array<null>(numColours).fill(null);

    const coloursPerSide = Math.floor(numColours / 2);
    const startSide = sequentialColourScale(
        startColour,
        coloursPerSide,
        {
            ...options,
            useNeutral: false
        }
    )?.reverse();
    const endSide = sequentialColourScale(
        endColour,
        coloursPerSide,
        {
            ...options,
            useNeutral: false
        }
    );
    const neutral = startSide || endSide ? 'rgb(255,255,255)' : null;

    return [
        ...startSide ?? Array<null>(coloursPerSide).fill(null),
        ...(numColours % 2 === 1
            ? [neutral]
            : []),
        ...endSide ?? Array<null>(coloursPerSide).fill(null)
    ] as (string | null)[];
}

export function getFractionalPosition(
    value: number,
    start: number,
    end: number
): number {
    if (end === start) return 0;
    return (value - start) / (end - start);
}

export function simulateColourblind(
    scale: (string | null)[],
    deficiency: Deficiency | null
): (string | null)[] {
    if (!deficiency) return scale;
    return scale.map(rgb => {
        if (!rgb) return null;

        const colour = Color(rgb).rgb();
        const cbRGB = simulate(colour.object() as RGB, deficiency);
        return Color(cbRGB).rgb().string();
    });
}

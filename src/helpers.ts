import _ from 'lodash';
import Color from 'color';
import { easeQuadOut } from 'd3-ease';
import { interpolateNumber } from 'd3-interpolate';
import { interpolateSinebow } from 'd3-scale-chromatic';
import { format } from 'd3-format';
import { hsluvToLch } from 'hsluv';
import { rgbToHsluv, hsluvToRgb } from './format';
import type { HSLuvColour } from './types';

export const gamutColours = _.range(0, 0.876, 0.125)
    .map(n => ({
        colour: Color(interpolateSinebow(n)).lighten(0.4).rgb().string(),
        gradientPct: format('%')(n + 0.05)
    }));

// https://gist.github.com/ryancat/9972419b2a78f329ce3aebb7f1a09152
export function deltaE(hslA: HSLuvColour, hslB: HSLuvColour): number {
    const labA = hsluvToLch(hslA);
    const labB = hsluvToLch(hslB);
    const deltaL = labA[0] - labB[0];
    const deltaA = labA[1] - labB[1];
    const deltaB = labA[2] - labB[2];
    const c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
    const c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
    const deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    const sc = 1.0 + 0.045 * c1;
    const sh = 1.0 + 0.015 * c1;
    const deltaLKlsl = deltaL / (1.0);
    const deltaCkcsc = deltaC / (sc);
    const deltaHkhsh = deltaH / (sh);
    const i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i) / 100; // as 0 -> 1
}

export function getRandomColourFromColours(
    rgbColours: string[],
    minDifference = 0.1,
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

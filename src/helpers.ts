import _ from 'lodash';
import Color from 'color';
import { easeQuadOut } from 'd3-ease'
import { interpolateNumber } from 'd3-interpolate';
import { interpolateSinebow } from 'd3-scale-chromatic';
import { format } from 'd3-format';
import hsluv from 'hsluv';

export const gamutColours = _.range(0, 0.876, 0.125)
    .map(n => ({
        colour: Color(interpolateSinebow(n)).lighten(0.4).rgb().string(),
        gradientPct: format('%')(n + 0.05)
    }));

export function rgbToHsluv(hexOrRgb: string): [number, number, number] {
    const colour = Color.rgb(hexOrRgb);
    return hsluv.rgbToHsluv([
        colour.red() / 255,
        colour.green() / 255,
        colour.blue() / 255
    ]);
}

export function hsluvToRgb(parts: [number, number, number]): string {
    const pcts = hsluv.hsluvToRgb(parts);
    return Color.rgb([
        pcts[0] * 255,
        pcts[1] * 255,
        pcts[2] * 255
    ]).string();
}

export function sequentialColourScale(
    baseColour: string,
    numColours: number,
    options?: {
        hueShift: number, // -1 to +1 (0)
        saturationShift?: number, // 0 to 1 (0)
        lightnessShift?: number // 0 to 1 (1)
    }
): string[] | null {
    if (numColours < 3) return null;
    const hueS = _.clamp(options?.hueShift ?? 0, -1, 1);
    const satS = _.clamp(options?.saturationShift ?? 0, 0, 1);
    const lgtS = _.clamp(options?.lightnessShift ?? 1, 0, 1);

    const hsluvBase = rgbToHsluv(baseColour);
    const [srcHue, srcSat, srcLgt] = hsluvBase;

    const hue = interpolateNumber(srcHue, srcHue + 360 * hueS);
    const sat = interpolateNumber(srcSat, srcSat * (1 - satS));
    const lgt = interpolateNumber(srcLgt, srcLgt + (100 - srcLgt) * lgtS);

    return _.times(numColours, n => {
        const interp = n / (numColours - 1);
        const hsluvResult: [number, number, number] = [
            hue(interp) % 360,
            sat(interp),
            lgt(easeQuadOut(interp))
            // lgt(interp)
        ];
        return hsluvToRgb(hsluvResult);
    });
}

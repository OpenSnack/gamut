import Color from 'color';
import hsluv, { type ColorTuple } from 'hsluv';
import type { ExportFormat, HSLuvColour } from '@/types';

export function optionalZeros(n: number, maxDecimals = 3): string {
    return (new Intl.NumberFormat(
        'en-US',
        {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: maxDecimals
        }
    )).format(n);
}

/* RGB <-> HSLuv for colour generation */

export function rgbToHsluv(hexOrRgb: string): HSLuvColour {
    const colour = Color.rgb(hexOrRgb);
    return hsluv.rgbToHsluv([
        colour.red() / 255,
        colour.green() / 255,
        colour.blue() / 255
    ]);
}

export function hsluvToRgb(parts: HSLuvColour): string {
    const pcts = hsluv.hsluvToRgb(parts);
    return Color.rgb([
        pcts[0] * 255,
        pcts[1] * 255,
        pcts[2] * 255
    ]).string();
}

/* RGB to other CSS-friendly formats */
export function formatHSL(c: Color): string {
    return `hsl(${optionalZeros(c.hue())}, ${optionalZeros(c.saturationl())}%, ${optionalZeros(c.lightness())}%)`;
}

export function formatHWB(c: Color): string {
    return `hwb(${optionalZeros(c.hue())}, ${optionalZeros(c.white())}%, ${optionalZeros(c.black())}%)`;
}

export function formatLAB(c: Color): string {
    return `lab(${optionalZeros(c.l())}%, ${optionalZeros(c.a())}, ${optionalZeros(c.b())})`;
}

export function formatLCHParts(c: ColorTuple): string {
    return `lch(${optionalZeros(c[0])}%, ${optionalZeros(c[1])}, ${optionalZeros(c[2])})`;
}

export const rgbToFormat: Record<ExportFormat, (rgb: string) => string> = {
    HEX: (rgb: string) => Color(rgb).hex(),
    RGB: (rgb: string) => rgb,
    HSL: (rgb: string) => {
        const c = Color(rgb).hsl();
        return formatHSL(c);
    },
    HWB: (rgb: string) => {
        const c = Color(rgb).hwb();
        return formatHWB(c);
    },
    LAB: (rgb: string) => {
        const c = Color(rgb);
        return formatLAB(c);
    }
};

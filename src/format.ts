import Color from 'color';
import hsluv from 'hsluv';
import type { ExportFormat, HSLuvColour } from '@/types';

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

export const rgbToFormat: Record<ExportFormat, (rgb: string) => string> = {
    HEX: (rgb: string) => Color(rgb).hex(),
    RGB: (rgb: string) => rgb,
    HSL: (rgb: string) => Color(rgb).hsl().string(),
    HWB: (rgb: string) => Color(rgb).hwb().string(),
    LAB: (rgb: string) => {
        const c = Color(rgb);
        return `lab(${c.l().toFixed(3)}%, ${c.a().toFixed(3)}, ${c.b().toFixed(3)})`;
    }
};

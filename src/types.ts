export type HSLuvColour = [number, number, number];

export type Coords = {
    x: number;
    y: number;
};

export type ScaleMode = 'sequential' | 'diverging';

export type Swatches = {
    start: string | null;
    end: string | null;
    neutral: string;
};

export type ExportFormat = 'HEX' | 'RGB' | 'HSL' | 'HWB' | 'LAB';

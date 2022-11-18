import _ from 'lodash';
import Color from 'color';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import {
    divergingColourScale,
    divergingCorrectLightness,
    generateRandomColours,
    getDarkerSide,
    getDivergingColourConflicts,
    sequentialColourScale,
    simulateColourblind
} from '@/helpers';
import type { Swatches, ExportFormat } from '@/types';
import type { ScaleMode, LightnessLock } from '@/components/ScaleDisplay/types';
import { rgbToFormat } from '@/format';
import type { Deficiency } from '@bjornlu/colorblind';

const NUM_RANDOM_COLOURS = 5 as const;
const CONFLICT_TOLERANCE = 0.05;
type NumRandomColours = typeof NUM_RANDOM_COLOURS;
type Tuple<T, N extends number> = [T, ...T[]] & { length: N };
type Locks = Tuple<boolean, NumRandomColours>;
type ColourblindScales = Record<Deficiency, (string | null)[]>;

export default defineStore('main', () => {
    /* **** COLOUR SELECT **** */
    const randomColours = ref(generateRandomColours(NUM_RANDOM_COLOURS));
    const randomLocks = ref<Locks>([false, false, false, false, false]);

    const setRandomColour = (i: number, colour: string) => {
        try {
            const c = Color(colour);
            if (i >= 0 && i < NUM_RANDOM_COLOURS) {
                // color-strnng was able to parse the colour
                const colourArr = randomColours.value;
                colourArr[i] = c.rgb().string();
                randomColours.value = colourArr;
            }
        } catch {
            // do nothing
        }
    };

    const setRandomLock = (i: number, value: boolean) => {
        if (i >= 0 && i < NUM_RANDOM_COLOURS) {
            const locks = [...randomLocks.value] as Locks;
            locks[i] = value;
            randomLocks.value = locks;
        }
    };

    const refreshRandom = () => {
        const lockedColours = [...randomColours.value].filter((c, i) => randomLocks.value[i]);
        const newColours = generateRandomColours(NUM_RANDOM_COLOURS, lockedColours)
            .slice(lockedColours.length);
        randomColours.value = randomColours.value.map((colour, i) => {
            if (randomLocks.value[i]) return colour;
            return newColours.pop() ?? 'black';
        });
    };

    // TODO: Add reaction when user types new colour into ColourBlock

    /* **** SCALE BUILDER **** */
    const scaleMode = ref<ScaleMode>('sequential');
    const numClasses = ref('5');
    const useNeutral = ref(false);
    const lightnessLock = ref<LightnessLock | null>(null);
    const hueShift = ref(0);
    const satShift = ref(0);
    const lgtShift = ref(1);
    const deficiency = ref<Deficiency | null>(null);
    const swatches = ref<Swatches>({
        start: null,
        end: null,
        neutral: 'rgb(255,255,255)'
    });

    const sequentialScale = computed<(string | null)[] | null>(
        () => sequentialColourScale(
            swatches.value.end,
            Number(numClasses.value),
            {
                hueShift: hueShift.value,
                saturationShift: satShift.value,
                lightnessShift: lgtShift.value,
                useNeutral: useNeutral.value
            }
        ));

    const divergingScale = computed<(string | null)[] | null>(
        () => divergingColourScale(
            swatches.value.start,
            swatches.value.end,
            Number(numClasses.value),
            {
                hueShift: hueShift.value,
                saturationShift: satShift.value,
                lightnessShift: lgtShift.value
            }
        ));

    const scale = computed(
        () => (scaleMode.value === 'diverging'
            ? divergingScale.value
            : sequentialScale.value)
    );

    const darkerScaleSide = computed<LightnessLock | null>(() => {
        if (!scale.value) return null;
        return getDarkerSide(scale.value);
    });

    const colourblindScales = computed<ColourblindScales | null>(() => (
        scale.value
            ? {
                protanopia: scale.value.map(c => simulateColourblind(c, 'protanopia')),
                deuteranopia: scale.value.map(c => simulateColourblind(c, 'deuteranopia')),
                tritanopia: scale.value.map(c => simulateColourblind(c, 'tritanopia')),
                achromatopsia: scale.value.map(c => simulateColourblind(c, 'achromatopsia')),
            } : null
    ));

    // keep lightness-corrected scales for both lightness lock sides so
    // we can pick the darker one and use it to calculate colour conflicts
    const lightnessCorrectedScales = computed(() => {
        if (!scale.value) return null;
        if (scaleMode.value === 'sequential') {
            return {
                left: scale.value,
                right: scale.value
            };
        }

        return {
            left: divergingCorrectLightness(scale.value, 'left'),
            right: divergingCorrectLightness(scale.value, 'right')
        };
    });

    const lightnessCorrectedColourblindScales = computed(() => (
        lightnessCorrectedScales.value
            ? {
                left: {
                    protanopia: lightnessCorrectedScales.value.left.map(
                        c => simulateColourblind(c, 'protanopia')
                    ),
                    deuteranopia: lightnessCorrectedScales.value.left.map(
                        c => simulateColourblind(c, 'deuteranopia')
                    ),
                    tritanopia: lightnessCorrectedScales.value.left.map(
                        c => simulateColourblind(c, 'tritanopia')
                    ),
                    achromatopsia: lightnessCorrectedScales.value.left.map(
                        c => simulateColourblind(c, 'achromatopsia')
                    ),
                },
                right: {
                    protanopia: lightnessCorrectedScales.value.right.map(
                        c => simulateColourblind(c, 'protanopia')
                    ),
                    deuteranopia: lightnessCorrectedScales.value.right.map(
                        c => simulateColourblind(c, 'deuteranopia')
                    ),
                    tritanopia: lightnessCorrectedScales.value.right.map(
                        c => simulateColourblind(c, 'tritanopia')
                    ),
                    achromatopsia: lightnessCorrectedScales.value.right.map(
                        c => simulateColourblind(c, 'achromatopsia')
                    ),
                }
            } : null
    ));

    const activeScale = computed(() => {
        if (lightnessLock.value) {
            return (deficiency.value
                ? lightnessCorrectedColourblindScales.value?.[lightnessLock.value][deficiency.value]
                : lightnessCorrectedScales.value?.[lightnessLock.value]) ?? null;
        }
        return deficiency.value
            ? colourblindScales.value?.[deficiency.value] ?? null
            : scale.value;
    });

    const noDeficiencyConflicts = computed(() => {
        if (!scale.value || scaleMode.value !== 'diverging') {
            return null;
        }
        return getDivergingColourConflicts(scale.value, CONFLICT_TOLERANCE).some(c => c);
    });

    const colourblindConflicts = computed(() => {
        if (!lightnessCorrectedScales.value
            || !lightnessCorrectedColourblindScales.value
            || !darkerScaleSide.value
            || scaleMode.value !== 'diverging'
        ) {
            return null;
        }
        const normalScale = getDivergingColourConflicts(
            lightnessCorrectedScales.value[darkerScaleSide.value],
            CONFLICT_TOLERANCE
        );
        // use lightness-corrected scales to get colour conflicts, otherwise we tend to miss out
        // on some colour similarities. use darker lightness-correction for greater colour coverage
        return _(lightnessCorrectedColourblindScales.value[darkerScaleSide.value])
            .mapValues(v => {
                const conflicts = getDivergingColourConflicts(v, CONFLICT_TOLERANCE);
                const differentConflicts = conflicts.map((c, i) => c && !normalScale[i]);
                return differentConflicts.some(c => c);
            })
            .value();
    });

    const setScaleMode = (mode: ScaleMode) => {
        scaleMode.value = mode;
    };

    const setUseNeutral = (mode: boolean) => {
        useNeutral.value = mode;
    };

    const setOrToggleLightnessLock = (lock: LightnessLock | null) => {
        if (lightnessLock.value && lightnessLock.value === lock) {
            lightnessLock.value = null;
        } else {
            lightnessLock.value = lock;
        }
    };

    const setHueShift = (value: number) => {
        // Two-directional shift, 1 == 360deg
        hueShift.value = _.clamp(value ?? 0, -1, 1);
    };

    const setSatShift = (value: number) => {
        // 1 == zero saturation at the light end
        satShift.value = _.clamp(value ?? 0, 0, 1);
    };

    const setLgtShift = (value: number) => {
        // 1 == same brightness at the light end
        lgtShift.value = _.clamp(value ?? 1, 0, 1);
    };

    const setDeficiency = (def: Deficiency | null) => {
        deficiency.value = def;
    };

    const setSwatch = (type: keyof Swatches, colour: string) => {
        swatches.value = {
            ...swatches.value,
            [type]: colour
        };
    };

    /* **** EXPORT **** */
    const exportFormat = ref<ExportFormat>('RGB');

    const convertedColours = computed(() => {
        if (!scale.value || !scale.value.every(c => c)) return null;

        return (scale.value as string[]).map(c => rgbToFormat[exportFormat.value](c));
    });

    const coloursAsList = computed(
        () => (convertedColours.value
            ? convertedColours.value.join(', ')
            : undefined)
    );

    const coloursAsArray = computed(
        () => (convertedColours.value
            ? `[${convertedColours.value.map(c => `'${c}'`).join(', ')}]`
            : undefined)
    );

    const setExportFormat = (format: ExportFormat) => {
        exportFormat.value = format;
    };

    return {
        randomColours,
        randomLocks,
        scaleMode,
        numClasses,
        useNeutral,
        lightnessLock,
        hueShift,
        satShift,
        lgtShift,
        deficiency,
        swatches,
        divergingScale,
        sequentialScale,
        scale,
        lightnessCorrectedScales,
        activeScale,
        colourblindScales,
        exportFormat,
        convertedColours,
        coloursAsList,
        coloursAsArray,
        noDeficiencyConflicts,
        colourblindConflicts,

        setRandomColour,
        refreshRandom,
        setRandomLock,
        setScaleMode,
        setUseNeutral,
        setOrToggleLightnessLock,
        setHueShift,
        setSatShift,
        setLgtShift,
        setDeficiency,
        setSwatch,
        setExportFormat
    };
});

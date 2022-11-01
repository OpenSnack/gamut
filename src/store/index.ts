import _ from 'lodash';
import Color from 'color';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { divergingColourScale, generateRandomColours, sequentialColourScale } from '@/helpers';
import type { Swatches, ScaleMode, ExportFormat } from '@/types';
import { rgbToFormat } from '@/format';

const NUM_RANDOM_COLOURS = 5 as const;
type NumRandomColours = typeof NUM_RANDOM_COLOURS;
type Tuple<T, N extends number> = [T, ...T[]] & { length: N };
type Locks = Tuple<boolean, NumRandomColours>;

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
    const hueShift = ref(0);
    const satShift = ref(0);
    const lgtShift = ref(1);
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

    const setScaleMode = (mode: ScaleMode) => {
        scaleMode.value = mode;
    };

    const setUseNeutral = (mode: boolean) => {
        useNeutral.value = mode;
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
        hueShift,
        satShift,
        lgtShift,
        swatches,
        divergingScale,
        sequentialScale,
        scale,
        exportFormat,
        convertedColours,
        coloursAsList,
        coloursAsArray,

        setRandomColour,
        refreshRandom,
        setRandomLock,
        setScaleMode,
        setUseNeutral,
        setHueShift,
        setSatShift,
        setLgtShift,
        setSwatch,
        setExportFormat
    };
});

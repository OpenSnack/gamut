import _ from 'lodash';
import { computed, ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { generateRandomColours, sequentialColourScale } from '@/helpers';
import type { Swatches, ScaleMode } from './types';

const NUM_RANDOM_COLOURS = 5 as const;
type NumRandomColours = typeof NUM_RANDOM_COLOURS;
type Tuple<T, N extends number> = [T, ...T[]] & { length: N };
type Locks = Tuple<boolean, NumRandomColours>;

export default defineStore('main', () => {
    /* **** COLOUR SELECT **** */
    const randomColours = ref(generateRandomColours(NUM_RANDOM_COLOURS));
    const randomLocks = ref<Locks>([false, false, false, false, false]);

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
    const scaleMode: Ref<ScaleMode> = ref('sequential');
    const numClasses = ref(5);
    const swatches = ref<Swatches>({
        start: null,
        middle: null,
        end: 'rgb(255,255,255)'
    });

    const sequentialScale = computed(
        () => sequentialColourScale(swatches.value.end, numClasses.value)
    );

    const setScaleMode = (mode: ScaleMode) => {
        scaleMode.value = mode;
    };

    const setClasses = (classes: number) => {
        numClasses.value = _.clamp(classes, 3, 10);
    };

    const setSwatch = (type: keyof Swatches, colour: string) => {
        swatches.value = {
            ...swatches.value,
            [type]: colour
        };
    };

    return {
        randomColours,
        randomLocks,
        scaleMode,
        swatches,
        sequentialScale,

        refreshRandom,
        setRandomLock,
        setScaleMode,
        setClasses,
        setSwatch
    };
});

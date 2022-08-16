import { ref, type Ref } from 'vue';
import _ from 'lodash';
import { generateRandomColours } from '@/helpers';
import type { ScaleMode } from './types';

const NUM_RANDOM_COLOURS = 5 as const;
type NumRandomColours = typeof NUM_RANDOM_COLOURS;
type Tuple<T, N extends number> = [T, ...T[]] & { length: N };
type Locks = Tuple<boolean, NumRandomColours>;

export default function useStore() {
    // properties
    const randomColours = ref(generateRandomColours(NUM_RANDOM_COLOURS));
    const randomLocks = ref<Locks>([false, false, false, false, false]);

    const scaleMode: Ref<ScaleMode> = ref('sequential');

    // methods
    const setRandomLock = (i: number, value: boolean) => {
        if (i >= 0 && i < NUM_RANDOM_COLOURS) {
            const locks = [...randomLocks.value] as Locks;
            locks[i] = value;
            randomLocks.value = locks;
        }
    }

    const refreshRandom = () => {
        const lockedColours = [...randomColours.value].filter((c, i) => randomLocks.value[i]);
        const newColours = generateRandomColours(NUM_RANDOM_COLOURS, lockedColours).slice(lockedColours.length);
        randomColours.value = randomColours.value.map((colour, i) => {
            if (randomLocks.value[i]) return colour;
            return newColours.pop() ?? 'black';
        });
    };

    const setScaleMode = (mode: ScaleMode) => {
        scaleMode.value = mode;
    }

    return {
        randomColours,
        randomLocks,
        scaleMode,

        refreshRandom,
        setRandomLock,
        setScaleMode
    };
}

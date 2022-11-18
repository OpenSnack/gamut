<template>
    <div id="scale-builder">
        <div class="options">
            <button-group
                label="scale mode:"
                :options="modeButtons"
                @select="onSelectMode"
            />
            <label>
                <select v-model="numClasses">
                    <option
                        v-for="num in classesOptions"
                        :key="num"
                    >
                        {{ num }}
                    </option>
                </select>
                colours
            </label>
            <label
                v-if="scaleMode === 'sequential'"
                class="checkbox"
            >
                include neutral colour
                <input
                    type="checkbox"
                    v-model="useNeutral"
                />
            </label>
            <button-group
                label="simulate deficiency:"
                :options="deficiencyButtons"
                @select="onSelectDeficiency"
            />
        </div>
        <div class="scale-row">
            <div class="scale-view">
                <scale-display
                    :scale="activeScale"
                    :scale-mode="scaleMode"
                    :lightness-lock="lightnessLock"
                    @lightness-lock="setOrToggleLightnessLock"
                />
                <div class="highlight-areas">
                    <div
                        v-for="(box, i) in highlightAreas[scaleMode]"
                        :key="i"
                        :style="{
                            visibility: active && highlightArea === i ? 'visible' : 'hidden'
                        }"
                    />
                </div>
                <div
                    ref="dropzone"
                    class="drop-zone"
                />
            </div>
            <scale-shift-view />
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useElementBounding } from '@vueuse/core';
import useStore from '@/store';
import useColourDrag from '@/store/colourDrag';
import type { Swatches } from '@/types';
import type { ScaleMode } from '@/components/ScaleDisplay/types';
import ScaleDisplay from '@/components/ScaleDisplay/ScaleDisplay.vue';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup.vue';
import ScaleShiftView from '@/views/ScaleShiftView.vue';
import { getFractionalPosition } from '@/helpers';
import 'vue-slider-component/theme/antd.css';
import type { Deficiency } from '@bjornlu/colorblind';

const dropzone = ref<HTMLDivElement>();
const bbox = useElementBounding(dropzone);

const store = useStore();
const {
    setScaleMode, setSwatch, setOrToggleLightnessLock, setDeficiency
} = store;
const {
    scaleMode, numClasses, useNeutral, lightnessLock, activeScale,
    deficiency, noDeficiencyConflicts, colourblindConflicts
} = storeToRefs(store);
const colourDragStore = useColourDrag();
const { active, colour, coords } = storeToRefs(colourDragStore);

const modeOptions = [
    { label: 'sequential', value: 'sequential' },
    { label: 'diverging', value: 'diverging' }
];

const deficiencyOptions: { label: string; value: Deficiency | '' }[] = [
    { label: 'none', value: '' },
    { label: 'prot', value: 'protanopia' },
    { label: 'deut', value: 'deuteranopia' },
    { label: 'trit', value: 'tritanopia' },
    { label: 'achro', value: 'achromatopsia' },
];

const classesOptions = _.range(3, 11);

const modeButtons = computed(
    () => modeOptions.map(op => ({
        ...op,
        selected: scaleMode.value === op.value
    }))
);

const getTextFill = (def: Deficiency | '') => {
    if (def === '') {
        return noDeficiencyConflicts.value ? 'red' : undefined;
    }
    if (def !== 'achromatopsia' && colourblindConflicts.value?.[def]) {
        return 'red';
    }
    return undefined;
};

const deficiencyButtons = computed(
    () => deficiencyOptions.map(op => ({
        ...op,
        selected: deficiency.value === (op.value || null),
        textFill: getTextFill(op.value)
    }))
);

const onSelectMode = (mode: string) => {
    setScaleMode(mode as ScaleMode);
};

const onSelectDeficiency = (def: string) => {
    setDeficiency((def || null) as Deficiency | null);
};

const highlightAreas: Record<string, (keyof Swatches)[]> = {
    sequential: ['end'],
    diverging: ['start', 'end']
};

const highlightArea = computed(() => {
    const xPos = getFractionalPosition(
        coords.value.x,
        bbox.x.value,
        bbox.x.value + bbox.width.value
    );
    const yPos = getFractionalPosition(
        coords.value.y,
        bbox.y.value,
        bbox.y.value + bbox.height.value
    );

    // outside the dropzone
    if (xPos < 0 || xPos > 1 || yPos < 0 || yPos > 1) return -1;

    // this'll switch between scaleModes
    return Math.floor(xPos * highlightAreas[scaleMode.value].length);
});

watch(active, a => {
    if (!a && highlightArea.value >= 0) {
        setSwatch(highlightAreas[scaleMode.value][highlightArea.value], colour.value);
    }
});
</script>

<style lang="postcss" scoped>
.options {
    @apply flex justify-start gap-8 mb-4;

    label {
        @apply font-sans border border-transparent;

        &.checkbox {
            @apply cursor-pointer;
        }
    }

    select {
        @apply font-sans;
    }

    input[type=checkbox] {
        @apply cursor-pointer;
    }
}

.scale-row {
    @apply flex;

    .scale-view {
        @apply relative h-24 w-full flex-1;

        .highlight-areas {
            @apply absolute top-0 flex w-full h-full pointer-events-none;

            > div {
                @apply bg-blue-200 bg-opacity-40 pointer-events-none w-full h-full;
            }
        }

        .drop-zone {
            @apply absolute top-0 w-full h-full pointer-events-none;
        }
    }
}
</style>

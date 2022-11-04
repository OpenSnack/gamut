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
                <div class="flex h-full">
                    <svg
                        v-for="(c, i) in activeScale"
                        :key="i"
                        class="flex-1"
                        width="100%"
                        height="100%"
                    >
                        <rect
                            width="calc(100% + 1px)"
                            height="100%"
                            :fill="c ? c : 'white'"
                            :stroke="c ? 'transparent' : 'rgb(229 231 235)'"
                            stroke-width="4"
                            stroke-dasharray="6 14"
                            stroke-dashoffset="3"
                            stroke-linecap="square"
                        />
                        <rect
                            v-if="!c"
                            width="4"
                            :height="bbox.height.value - 4"
                            x="100%"
                            y="2"
                            :fill="activeScale && (activeScale[i + 1] || i === activeScale.length - 1) ? 'transparent' : 'white'"
                            :style="{ transform: 'translate(-4px, 0)' }"
                        />
                    </svg>
                </div>
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
            <div id="shift-options">
                <div class="shift-label">
                    hue shift
                </div>
                <div class="shift-slider">
                    <vue-slider
                        :model-value="hueShift"
                        :min="-1"
                        :max="1"
                        :interval="0.01"
                        @change="setHueShift"
                    />
                </div>
                <alert-triangle
                    class="shift-alert"
                    :class="{ show: warnHueShift }"
                    color="rgb(153,27,27)"
                    size="20"
                />
                <div class="shift-label">
                    sat shift
                </div>
                <div class="shift-slider">
                    <vue-slider
                        :model-value="satShift"
                        :min="0"
                        :max="1"
                        :interval="0.01"
                        @change="setSatShift"
                    />
                </div>
                <alert-triangle
                    class="shift-alert"
                    :class="{ show: warnSatShift }"
                    color="rgb(153,27,27)"
                    size="20"
                />
                <div class="shift-label">
                    lgt shift
                </div>
                <div class="shift-slider">
                    <vue-slider
                        :model-value="lgtShift"
                        :min="0"
                        :max="1"
                        :interval="0.01"
                        @change="setLgtShift"
                    />
                </div>
                <alert-triangle
                    class="shift-alert"
                    :class="{ show: warnLgtShift }"
                    color="rgb(153,27,27)"
                    size="20"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { AlertTriangle } from 'lucide-vue-next';
import { useElementBounding } from '@vueuse/core';
import VueSlider from 'vue-slider-component';
import useStore from '@/store';
import useColourDrag from '@/store/colourDrag';
import type { ScaleMode, Swatches } from '@/types';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup.vue';
import {
    RECOMMENDED_HUE_SHIFT,
    RECOMMENDED_SAT_SHIFT,
    RECOMMENDED_LGT_SHIFT
} from '@/constants';
import { getFractionalPosition } from '@/helpers';
import 'vue-slider-component/theme/antd.css';
import type { Deficiency } from '@bjornlu/colorblind';

const dropzone = ref<HTMLDivElement>();
const bbox = useElementBounding(dropzone);

const store = useStore();
const {
    setScaleMode, setSwatch, setHueShift, setSatShift, setLgtShift, setDeficiency
} = store;
const {
    scaleMode, numClasses, useNeutral, activeScale, hueShift, satShift, lgtShift, deficiency
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

const deficiencyButtons = computed(
    () => deficiencyOptions.map(op => ({
        ...op,
        selected: deficiency.value === (op.value || null)
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

const warnHueShift = computed(
    () => hueShift.value !== _.clamp(hueShift.value, ...RECOMMENDED_HUE_SHIFT)
);

const warnSatShift = computed(
    () => satShift.value !== _.clamp(satShift.value, ...RECOMMENDED_SAT_SHIFT)
);

const warnLgtShift = computed(
    () => lgtShift.value !== _.clamp(lgtShift.value, ...RECOMMENDED_LGT_SHIFT)
);
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

    #shift-options {
        @apply grid items-center;
        grid-template-columns: auto auto auto;

        .shift-label {
            @apply font-sans ml-8 mr-4;
        }

        .shift-slider {
            @apply w-16;
        }

        .shift-alert {
            @apply ml-4 invisible;

            &.show {
                @apply visible;
            }
        }
    }
}

:deep(.vue-slider, .vue-slider:hover) {
    .vue-slider-process {
        @apply bg-rainbow-200;
    }

    .vue-slider-dot-handle {
        @apply border-rainbow-200;

        &:hover {
            @apply border-rainbow-200;
        }

        &.vue-slider-dot-handle-focus {
            box-shadow: none;
        }
    }

    .vue-slider-dot-tooltip-inner {
        @apply border-rainbow-200 bg-white;

        .vue-slider-dot-tooltip-text {
            @apply font-sans;
        }

        &::after {
            @apply border-t-white;
        }
    }
}
</style>

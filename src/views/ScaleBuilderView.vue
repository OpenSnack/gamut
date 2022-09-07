<template>
    <div id="scale-builder">
        <div class="options">
            <button-group
                label="scale mode:"
                :options="options"
                @select="onSelectMode"
            />
            <label>
                include neutral colour
                <input
                    id="use-neutral"
                    type="checkbox"
                    v-model="useNeutral"
                />
            </label>
        </div>
        <div class="scale-view">
            <div class="flex h-full">
                <div
                    v-for="(c, i) in sequentialScale"
                    :key="i"
                    class="flex-1"
                    :style="{ 'background-color': c ? c : 'white' }"
                />
            </div>
            <div class="highlight-areas">
                <div
                    v-for="(box, i) in highlightAreas.sequential"
                    :key="i"
                    :style="{ visibility: active && highlightArea === i ? 'visible' : 'hidden' }"
                />
            </div>
            <div
                ref="dropzone"
                class="drop-zone"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useElementBounding } from '@vueuse/core';
import useStore from '@/store';
import useColourDrag from '@/store/colourDrag';
import type { ScaleMode } from '@/store/types';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup.vue';
import { getFractionalPosition } from '@/helpers';

const dropzone = ref<HTMLDivElement>();
const bbox = useElementBounding(dropzone);

const store = useStore();
const { setScaleMode, setSwatch } = store;
const { scaleMode, useNeutral, sequentialScale } = storeToRefs(store);

const colourDragStore = useColourDrag();
const { active, colour, coords } = storeToRefs(colourDragStore);

const baseOptions = [
    { label: 'sequential', value: 'sequential' },
    { label: 'diverging', value: 'diverging' }
];

const options = computed(
    () => baseOptions.map(op => ({
        ...op,
        selected: scaleMode.value === op.value
    }))
);

const onSelectMode = (mode: string) => {
    setScaleMode(mode as ScaleMode);
};

const highlightAreas = {
    sequential: ['end']
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
    return Math.floor(xPos * highlightAreas.sequential.length);
});

watch(active, a => {
    if (!a && highlightArea.value >= 0) {
        setSwatch('end', colour.value);
    }
});
</script>

<style lang="postcss" scoped>
.options {
    @apply flex justify-start gap-4 mb-4;

    label {
        @apply font-sans border border-transparent cursor-pointer;
    }

    input[type=checkbox] {
        @apply cursor-pointer;
    }
}

.scale-view {
    @apply relative h-24 w-full;

    .highlight-areas {
        @apply absolute top-0 w-full h-full;

        > div {
            @apply bg-blue-200 bg-opacity-40 pointer-events-none h-full;
        }
    }

    .drop-zone {
        @apply absolute top-0 w-full h-full pointer-events-none;
    }
}
</style>

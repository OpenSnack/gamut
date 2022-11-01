<template>
    <!-- the mouse behaviours here will never work on screen readers etc. -->
    <!-- eslint-disable vuejs-accessibility/mouse-events-have-key-events -->
    <div
        class="colour-block"
        ref="container"
        :style="{ 'background-color': colour }"
        @mousedown="onMousedown"
        @mousemove="startDrag"
        @mouseleave="startDrag"
        @mouseup="onMouseup"
    >
        <input
            type="text"
            aria-label="RGB Colour"
            :value="colour"
            :style="{
                color: inputShade,
                'border-color': inputShade
            }"
            @input="onTextInput"
        />
        <lock
            v-if="locked"
            class="lock-icon"
            :color="inputShade"
            @click="emit('lock', false)"
        />
        <unlock
            v-else
            class="lock-icon"
            :color="inputShade"
            @click="emit('lock', true)"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Color from 'color';
import { Lock, Unlock } from 'lucide-vue-next';
import { onLongPress } from '@vueuse/core';
import type { Coords } from '@/types';

const props = defineProps<{
    colour: string;
    locked: boolean;
}>();

const emit = defineEmits<{
    (e: 'input', colour: string): void,
    (e: 'lock', locked: boolean): void,
    (e: 'colour-drag', colour: string, coords: Coords): void
}>();

const container = ref<HTMLDivElement>();

const inputShade = computed(() => {
    if (Color(props.colour).isDark()) {
        return 'white';
    }
    return 'black';
});

const mousePressed = ref(false);
const onMousedown = (e: MouseEvent) => {
    if (e.target === container.value) {
        mousePressed.value = true;
    }
};
const onMouseup = () => {
    mousePressed.value = false;
};

const startDrag = (e: MouseEvent) => {
    if (mousePressed.value) {
        mousePressed.value = false;
        emit('colour-drag', props.colour, { x: e.x, y: e.y });
    }
};

onLongPress(
    container,
    e => startDrag(e)
);

const onTextInput = (e: Event) => {
    const { value } = e.target as HTMLInputElement;
    emit('input', value);
};
</script>

<style lang="postcss" scoped>
.colour-block {
    @apply flex flex-col h-full items-center justify-around;

    input {
        @apply font-sans text-xl text-center w-4/5 max-w-[200px] bg-transparent border-b border-dotted outline-none;
    }

    .lock-icon {
        @apply cursor-pointer;
    }
}
</style>

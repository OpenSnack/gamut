<template>
    <div
        class="colour-block"
        :style="{ height: `${height}px` }"
    >
        <div
            ref="draggable"
            class="draggable"
            :class="{ 'is-dragging': isDragging }"
            :style="{
                'background-color': colour,
                left: `${isDragging ? dragLeft : realX}px`,
                top: `${isDragging ? dragTop : realY}px`,
                height: `${height}px`
            }"
        >
            <input
                type="text"
                :value="colour"
                :style="{
                    color: inputShade,
                    'border-color': inputShade
                }"
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
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Color from 'color';
import { Lock, Unlock } from 'lucide-vue-next';
import { useDraggable, useElementBounding } from '@vueuse/core';

const props = defineProps<{
    colour: string;
    locked: boolean;
    height: number;
}>();

const emit = defineEmits<{
    (e: 'select', colour: string): void,
    (e: 'lock', locked: boolean): void
}>();

const draggable = ref<HTMLDivElement>();

const realX = ref(0);
const realY = ref(0);

function updateRealCoords(x: number, y: number, dragging: boolean) {
    if (!dragging) {
        realX.value = x;
        realY.value = y;
    }
}

const { left, top } = useElementBounding(draggable);

const { x: dragLeft, y: dragTop, isDragging } = useDraggable(draggable);
onMounted(() => {
    updateRealCoords(left.value, top.value, false);
});

watch([left, top, isDragging], ([l, t, d]) => {
    updateRealCoords(l, t, d);
    dragLeft.value = realX.value;
    dragTop.value = realY.value;
});

const inputShade = computed(() => {
    if (Color(props.colour).isDark()) {
        return 'white';
    }
    return 'black';
});
</script>

<style lang="postcss" scoped>
.colour-block {
    input {
        @apply font-sans text-xl text-center w-4/5 max-w-[200px] bg-transparent border-b border-dotted outline-none;
    }

    .lock-icon {
        @apply cursor-pointer;
    }

    .draggable {
        @apply flex flex-col items-center justify-around;

        &.is-dragging {
            @apply fixed;
        }
    }
}
</style>

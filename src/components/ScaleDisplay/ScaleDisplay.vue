<template>
    <div
        ref="container"
        class="flex h-full"
    >
        <div
            v-for="(c, i) in scale"
            :key="i"
            class="flex-1 h-full"
        >
            <svg
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
                    :fill="scale && (scale[i + 1] || i === scale.length - 1) ? 'transparent' : 'white'"
                    :style="{ transform: 'translate(-4px, 0)' }"
                />
            </svg>
            <div
                v-if="scaleMode === 'diverging' && c && i === 0"
                class="lightness-lock left-1"
                @click="emit('lightnessLock', 'left')"
                @keypress="emit('lightnessLock', 'left')"
            >
                <sun
                    :color="getButtonShade(c)"
                />
                <lock
                    v-if="lightnessLock === 'left'"
                    :color="getButtonShade(c)"
                />
                <unlock
                    v-else
                    :color="getButtonShade(c)"
                />
            </div>
            <div
                v-if="scaleMode === 'diverging' && c && scale && i === scale.length - 1"
                class="lightness-lock right-1"
                @click="emit('lightnessLock', 'right')"
                @keypress="emit('lightnessLock', 'right')"
            >
                <sun
                    :color="getButtonShade(c)"
                />
                <lock
                    v-if="lightnessLock === 'right'"
                    :color="getButtonShade(c)"
                />
                <unlock
                    v-else
                    :color="getButtonShade(c)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Color from 'color';
import { ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { Sun, Lock, Unlock } from 'lucide-vue-next';
import type { ScaleMode, LightnessLock } from './types';

defineProps<{
    scale: (string | null)[] | null;
    scaleMode: ScaleMode;
    lightnessLock: LightnessLock | null;
}>();

const emit = defineEmits<{
    (event: 'lightnessLock', lock: LightnessLock): void;
}>();

const container = ref<HTMLDivElement>();
const bbox = useElementBounding(container);

const getButtonShade = (c: string) => {
    if (Color(c).isDark()) {
        return 'white';
    }
    return 'black';
};
</script>

<style lang="postcss" scoped>
.lightness-lock {
    @apply absolute flex bottom-1 cursor-pointer;
}
</style>

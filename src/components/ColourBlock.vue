<template>
    <div
        class="colour-block"
        :style="{ 'background-color': colour }"
    >
        <input
            type="text"
            aria-label="RGB Colour"
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
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Color from 'color';
import { Lock, Unlock } from 'lucide-vue-next';

const props = defineProps<{
    colour: string;
    locked: boolean;
}>();

const emit = defineEmits<{
    (e: 'select', colour: string): void,
    (e: 'lock', locked: boolean): void
}>();

const inputShade = computed(() => {
    if (Color(props.colour).isDark()) {
        return 'white';
    }
    return 'black';
});
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

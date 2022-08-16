<template>
    <div class="flex">
        <span class="mr-2">{{ label }}</span>
        <div
            class="button-group"
            role="radiogroup"
            aria-label="scale mode"
        >
            <div
                v-for="option in options"
                :key="option.value"
                role="radio"
                :aria-checked="option.selected"
                :class="{ selected: option.selected }"
                @click="emit('select', option.value)"
            >
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ButtonDatum } from './types';

defineProps<{
    label: string;
    options: ButtonDatum[];
}>();

const emit = defineEmits<{
    (event: 'select', value: string): void;
}>();
</script>

<style lang="postcss" scoped>
* {
    @apply font-sans;
}

.button-group {
    @apply flex;

    > div {
        @apply text-gray-main border border-transparent px-1;

        &:first-child {
            @apply rounded-l-[4px];
        }

        &:last-child {
            @apply rounded-r-[4px];
        }

        &.selected {
            @apply cursor-default border-gray-main bg-gray-main text-white;
        }

        &:not(.selected) {
            @apply cursor-pointer;

            &:hover {
                @apply bg-gray-100;
            }
        }
    }
}
</style>

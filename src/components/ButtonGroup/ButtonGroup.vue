<template>
    <div class="flex">
        <span class="mr-2 border border-transparent">{{ label }}</span>
        <div
            class="button-group"
            :style="{
                '--selected-colour': colour,
                '--hover-colour': hoverColour
            }"
            role="radiogroup"
            :aria-label="label"
        >
            <div
                v-for="option in options"
                :key="option.value"
                role="radio"
                :tabindex="0"
                :aria-checked="option.selected"
                :class="{
                    selected: option.selected
                }"
                :style="{
                    color: option.textFill
                }"
                @click="emit('select', option.value)"
                @keydown.enter="emit('select', option.value)"
            >
                {{ option.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Color from 'color';
import { computed } from 'vue';
import type { ButtonDatum } from './types';

const props = withDefaults(defineProps<{
    label: string;
    options: ButtonDatum[];
    colour?: string;
}>(), {
    colour: 'rgb(135, 137, 165)'
});

const emit = defineEmits<{
    (event: 'select', value: string): void;
}>();

const hoverColour = computed(() => Color(props.colour).alpha(0.25).string());
</script>

<style lang="postcss" scoped>
* {
    @apply font-sans;
}

.button-group {
    @apply flex;

    > div {
        @apply border border-transparent px-1;

        &:first-child {
            @apply rounded-l-[4px];
        }

        &:last-child {
            @apply rounded-r-[4px];
        }

        &:not(.selected):hover {
            background-color: var(--hover-colour);
        }

        &.selected {
            @apply cursor-default text-white;
            background-color: var(--selected-colour);
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

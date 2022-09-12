<template>
    <div class="export">
        <div
            class="text-display"
            :class="{ placeholder: !active }"
        >
            {{ content ?? placeholder }}
        </div>
        <clipboard-button
            class="export-copy"
            :class="{ active }"
            :content="content"
            :label="''"
        />
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import ClipboardButton from '@/components/ClipboardButton.vue';

const props = withDefaults(defineProps<{
    content?: string;
    placeholder?: string;
}>(), {
    content: undefined,
    placeholder: ''
});

const active = computed(() => !_.isNil(props.content));
</script>

<style lang="postcss" scoped>
.export {
    @apply flex items-center border max-w-3xl w-full mb-2;

    .text-display {
        @apply flex-1 font-mono p-2 border-r overflow-x-auto whitespace-nowrap;

        &.placeholder {
            @apply text-gray-300 italic;
        }
    }

    .export-copy {
        @apply px-1 py-2;

        &.active:hover {
            @apply bg-rainbow-300 bg-opacity-25;
        }
    }
}
</style>

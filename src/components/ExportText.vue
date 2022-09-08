<template>
    <div class="export">
        <div class="text-display">
            {{ content }}
        </div>
        <clipboard-button
            class="export-copy"
            :content="content"
            :label="''"
        />
    </div>
</template>

<script setup lang="ts">
import ClipboardButton from '@/components/ClipboardButton.vue';

defineProps<{
    content: string;
}>();
</script>

<style lang="postcss" scoped>
.export {
    @apply flex items-center border max-w-3xl w-full mb-2;

    .text-display {
        @apply flex-1 font-mono p-2 border-r overflow-x-auto whitespace-nowrap;
    }

    .export-copy {
        @apply px-1 py-2;

        &:hover {
            @apply bg-rainbow-300 bg-opacity-25;
        }
    }
}
</style>

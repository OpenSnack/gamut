<template>
    <div class="colour-block" :style="{ 'background-color': colour }">
        <input type="text" :value="colour" />
        <lock />
    </div>
</template>

<script setup lang="ts">
import { Lock } from 'lucide-vue-next';

defineProps<{
    colour: string
}>();

defineEmits<{
    (e: 'select', colour: string): void,
}>();
</script>

<style lang="postcss" scoped>
.colour-block {
    @apply flex flex-col h-full items-center justify-around;

    input {
        @apply text-center;
    }
}
</style>

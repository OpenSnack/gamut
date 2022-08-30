<template>
    <div
        class="colour-drag-block"
        :style="{
            'background-color': colour,
            left: `${coords.x - size / 2}px`,
            top: `${coords.y - size / 2}px`,
            width: `${size}px`,
            height: `${size}px`
        }"
    />
</template>

<script setup lang="ts">
defineProps<{
    colour: string;
    coords: { x: number; y: number; };
    size: number
}>();
</script>

<style lang="postcss" scoped>
.colour-drag-block {
    @apply absolute border-2 border-white;
}
</style>

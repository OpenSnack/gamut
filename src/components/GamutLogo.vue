<template>
    <div class="logo">
        <div class="name">Gamut</div>
        <div class="rect" :style="{ background: rectGradient }" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { gamutColours } from '@/helpers';

const rectGradient = computed(() => {
    const gradientValues = gamutColours.map(
        ({ colour, gradientPct }) => `${colour} ${gradientPct}`);

    return `linear-gradient(to right, ${gradientValues.join()})`;
});
</script>

<style lang="postcss" scoped>
.logo {
    @apply flex items-center;

    .name {
        @apply text-5xl text-gray-main font-bold mr-2;
    }

    .rect {
        flex: 0 0 40px;
        height: 40px;
    }
}
</style>

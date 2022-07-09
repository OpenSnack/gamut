<template>
    <div id="colour-select">
        <colour-block
            v-for="(colour, i) in colours"
            :key="i"
            class="select-block"
            :colour="colour"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ColourBlock from '@/components/ColourBlock/ColourBlock.vue';
import Color from 'color';
import { sequentialColourScale } from '@/helpers';

const baseColour = ref(Color.rgb('#2472ED').string())

const colours = computed(() => {
    return sequentialColourScale(
        baseColour.value,
        5,
        {
            hueShift: -0.2,
            saturationShift: 0,
            lightnessShift: 1
        }
    ) ?? []
});
</script>

<style lang="postcss" scoped>
#colour-select {
    @apply flex h-32;

    .select-block {
        @apply flex-1;
    }
}
</style>

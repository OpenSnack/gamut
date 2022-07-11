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
import { ref } from 'vue';
import ColourBlock from '@/components/ColourBlock/ColourBlock.vue';
import { generateRandomColours } from '@/helpers';

const colours = ref(generateRandomColours(5, 0.2))
</script>

<style lang="postcss" scoped>
#colour-select {
    @apply flex h-48;

    .select-block {
        @apply flex-1;
    }
}
</style>

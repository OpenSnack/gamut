<template>
    <div id="scale-builder">
        <button-group
            label="scale mode:"
            :options="options"
            @select="onSelectMode"
        />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@/store';
import type { ScaleMode } from '@/store/types';
import ButtonGroup from "@/components/ButtonGroup/ButtonGroup.vue";

const { scaleMode, setScaleMode } = useStore();

const baseOptions = [
    { label: 'sequential', value: 'sequential' },
    { label: 'diverging', value: 'diverging' }
];

const options = computed(
    () => baseOptions.map(op => ({
        ...op,
        selected: scaleMode.value === op.value
    }))
);

const onSelectMode = (mode: string) => {
    setScaleMode(mode as ScaleMode);
};
</script>

<style lang="postcss" scoped>

</style>
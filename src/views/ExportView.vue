<template>
    <div id="export-view">
        <div class="options">
            <button-group
                label="colour format:"
                :options="options"
                @select="onSelectFormat"
            />
        </div>
        <export-text :content="coloursAsList" />
        <export-text :content="coloursAsArray" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import ButtonGroup from '@/components/ButtonGroup/ButtonGroup.vue';
import ExportText from '@/components/ExportText.vue';
import useStore from '@/store';
import type { ExportFormat } from '@/types';

const store = useStore();
const { setExportFormat } = store;
const { exportFormat, coloursAsList, coloursAsArray } = storeToRefs(store);

const modeOptions = [
    { label: 'hex', value: 'HEX' },
    { label: 'rgb', value: 'RGB' },
    { label: 'hsl', value: 'HSL' },
    { label: 'hwb', value: 'HWB' },
    { label: 'lab', value: 'LAB' }
];

const options = computed(
    () => modeOptions.map(op => ({
        ...op,
        selected: exportFormat.value === op.value
    }))
);

const onSelectFormat = (format: string) => {
    setExportFormat(format as ExportFormat);
};
</script>

<style lang="postcss" scoped>
#export-view {
    .options {
        @apply flex justify-start gap-8 mb-4;
    }
}
</style>

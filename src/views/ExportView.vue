<template>
    <div id="export-view">
        <div class="options">
            <button-group
                label="colour format:"
                :options="options"
                @select="onSelectFormat"
            />
            <div
                v-if="checkSupport"
                class="support-warning"
            >
                <alert-triangle
                    class="mr-2"
                    color="rgb(153,27,27)"
                />
                check&nbsp;<a
                    :href="checkSupport"
                    target="_blank"
                    rel="noopener noreferrer"
                >browser support</a>&nbsp;before using this format
            </div>
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
import { AlertTriangle } from 'lucide-vue-next';

const store = useStore();
const { setExportFormat } = store;
const { exportFormat, coloursAsList, coloursAsArray } = storeToRefs(store);

const formatOptions = [
    { label: 'hex', value: 'HEX' },
    { label: 'rgb', value: 'RGB' },
    { label: 'hsl', value: 'HSL' },
    { label: 'hwb', value: 'HWB', check: 'https://caniuse.com/mdn-css_types_color_hwb' },
    { label: 'lab', value: 'LAB', check: 'https://caniuse.com/css-lch-lab' }
];

const options = computed(
    () => formatOptions.map(op => ({
        ...op,
        selected: exportFormat.value === op.value
    }))
);

const checkSupport = computed(() => {
    const formatOption = formatOptions.find(op => op.value === exportFormat.value);
    return formatOption?.check;
});

const onSelectFormat = (format: string) => {
    setExportFormat(format as ExportFormat);
};
</script>

<style lang="postcss" scoped>
#export-view {
    .options {
        @apply flex justify-start gap-8 mb-4;

        .support-warning {
            @apply flex items-center font-sans text-red-800;

            a {
                @apply font-sans underline text-red-700 opacity-70;
            }
        }
    }
}
</style>

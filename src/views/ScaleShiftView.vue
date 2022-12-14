<template>
    <div id="shift-options">
        <div class="shift-label">
            hue shift
        </div>
        <div class="shift-slider">
            <vue-slider
                :model-value="hueShift"
                :min="-1"
                :max="1"
                :interval="0.01"
                @change="setHueShift"
            />
        </div>
        <alert-triangle
            class="shift-alert"
            :class="{ show: warnHueShift }"
            color="rgb(153,27,27)"
            size="20"
        />
        <div class="shift-label">
            sat shift
        </div>
        <div class="shift-slider">
            <vue-slider
                :model-value="satShift"
                :min="0"
                :max="1"
                :interval="0.01"
                @change="setSatShift"
            />
        </div>
        <alert-triangle
            class="shift-alert"
            :class="{ show: warnSatShift }"
            color="rgb(153,27,27)"
            size="20"
        />
        <div class="shift-label">
            lgt shift
        </div>
        <div class="shift-slider">
            <vue-slider
                :model-value="lgtShift"
                :min="0"
                :max="1"
                :interval="0.01"
                @change="setLgtShift"
            />
        </div>
        <alert-triangle
            class="shift-alert"
            :class="{ show: warnLgtShift }"
            color="rgb(153,27,27)"
            size="20"
        />
    </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { AlertTriangle } from 'lucide-vue-next';
import VueSlider from 'vue-slider-component';
import useStore from '@/store';
import {
    RECOMMENDED_HUE_SHIFT, RECOMMENDED_LGT_SHIFT, RECOMMENDED_SAT_SHIFT
} from '@/constants';

const store = useStore();
const {
    setHueShift, setSatShift, setLgtShift
} = store;
const {
    hueShift, satShift, lgtShift
} = storeToRefs(store);

const warnHueShift = computed(
    () => hueShift.value !== _.clamp(hueShift.value, ...RECOMMENDED_HUE_SHIFT)
);

const warnSatShift = computed(
    () => satShift.value !== _.clamp(satShift.value, ...RECOMMENDED_SAT_SHIFT)
);

const warnLgtShift = computed(
    () => lgtShift.value !== _.clamp(lgtShift.value, ...RECOMMENDED_LGT_SHIFT)
);
</script>

<style lang="postcss" scoped>
#shift-options {
    @apply grid items-center;
    grid-template-columns: auto auto auto;

    .shift-label {
        @apply font-sans ml-8 mr-4;
    }

    .shift-slider {
        @apply w-16;
    }

    .shift-alert {
        @apply ml-4 invisible;

        &.show {
            @apply visible;
        }
    }

    :deep(.vue-slider, .vue-slider:hover) {
        .vue-slider-process {
            @apply bg-rainbow-200;
        }

        .vue-slider-dot-handle {
            @apply border-rainbow-200;

            &:hover {
                @apply border-rainbow-200;
            }

            &.vue-slider-dot-handle-focus {
                box-shadow: none;
            }
        }

        .vue-slider-dot-tooltip-inner {
            @apply border-rainbow-200 bg-white;

            .vue-slider-dot-tooltip-text {
                @apply font-sans;
            }

            &::after {
                @apply border-t-white;
            }
        }
    }
}
</style>

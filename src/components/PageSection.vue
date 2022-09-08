<template>
    <section>
        <div
            class="section-header"
            @click="open = !open"
            @keydown.enter="open = !open"
        >
            <div
                class="number"
                :class="numberBG"
            >
                {{ number }}
            </div>
            <div class="title">
                {{ title }}
            </div>
            <chevron-right :transform="`rotate(${open ? '90' : '0'})`" />
        </div>
        <div
            class="section-content"
            :class="{ hidden: !open }"
        >
            <slot name="content" />
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed, ref } from 'vue';
import { ChevronRight } from 'lucide-vue-next';

const props = defineProps<{
    number: number,
    title: string
}>();

const open = ref(true);

const numberBG = computed(() => `bg-rainbow-${_.round(_.clamp(props.number, 0, 8))}00`);
</script>

<style lang="postcss" scoped>
section {
    .section-header {
        @apply flex items-center font-bold my-4 cursor-pointer select-none;

        .title {
            @apply text-2xl pl-4 pr-1;
        }

        .number {
            @apply flex justify-center items-center text-3xl h-10;
            flex: 0 0 40px;
        }
    }

    .section-content {
        @apply ml-14 mb-16;
    }
}
</style>

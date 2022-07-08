<template>
    <section>
        <div class="section-header">
            <div
                class="number"
                :class="numberBG"
            >
                {{ number }}
            </div>
            <div class="title">{{ title }}</div>
            <slot name="content" />
        </div>
    </section>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { computed } from 'vue';

const props = defineProps<{
    number: number,
    title: string
}>();

const numberBG = computed(() => `bg-rainbow-${_.round(_.clamp(props.number, 0, 8))}00`)
</script>

<style lang="postcss" scoped>
section {

    .section-header {
        @apply flex items-center font-bold my-4;

        .title {
            @apply text-2xl;
        }

        .number {
            @apply flex justify-center items-center text-3xl mr-4;
            flex: 0 0 40px;
            height: 40px;
        }
    }
}
</style>
<template>
    <div
        class="clipboard-button"
        :class="{ active: content }"
        @click="onClick"
        @keydown="onClick"
    >
        <div
            ref="clickIcon"
            class="click-icon"
        >
            <clipboard-check
                class="icon"
                v-if="clicked"
            />
            <clipboard-copy
                class="icon"
                v-else
            />
        </div>
        <div
            v-if="label"
            class="button-label"
        >
            {{ label }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ClipboardCopy, ClipboardCheck } from 'lucide-vue-next';
import { onClickOutside, useClipboard } from '@vueuse/core';

const props = withDefaults(defineProps<{
    content?: string;
    label: string;
}>(), {
    content: undefined
});

const clickIcon = ref<HTMLDivElement>();
const clicked = ref(false);

const { copy, isSupported } = useClipboard();

onClickOutside(clickIcon, () => { clicked.value = false; });

const onClick = () => {
    if (isSupported.value && props.content) {
        copy(props.content);
        clicked.value = true;
    }
};
</script>

<style lang="postcss" scoped>
.clipboard-button {
    @apply flex opacity-50;

    &.active {
        @apply cursor-pointer opacity-100;
    }

    .button-label {
        @apply font-sans pl-1;
    }
}
</style>

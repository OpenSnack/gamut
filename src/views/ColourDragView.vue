<template>
    <div
        class="colour-drag-view"
        :class="{ 'pointer-events-none': !active }"
        @mouseup="reset"
        @mousemove="onDrag"
    >
        <colour-drag-block
            v-if="active"
            :colour="colour"
            :coords="coords"
            :size="50"
        />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import ColourDragBlock from '@/components/ColourDragBlock.vue';
import useColourDrag from '@/store/colourDrag';

const colourDragStore = useColourDrag();
const { reset, setDrag } = colourDragStore;
const { active, colour, coords } = storeToRefs(colourDragStore);

const onDrag = (e: MouseEvent) => {
    if (active.value) {
        setDrag(colour.value, { x: e.x, y: e.y });
    }
};
</script>

<style lang="postcss" scoped>
.colour-drag-view {
    @apply fixed top-0 left-0 w-screen h-screen;
}
</style>

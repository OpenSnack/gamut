<template>
    <div id="colour-select">
        <div class="left-side">
            <div class="blocks">
                <colour-block
                    v-for="(colour, i) in randomColours"
                    :key="i"
                    class="select-block"
                    :colour="colour"
                    :locked="randomLocks[i]"
                    @input="c => onBlockInput(c, i)"
                    @lock="bool => setRandomLock(i, bool)"
                    @colour-drag="setDrag"
                />
            </div>
            <div class="copy-palette">
                <div class="font-sans mr-2 opacity-50">
                    need a categorical scale?
                </div>
                <clipboard-button
                    label="copy palette to clipboard"
                    :content="JSON.stringify(randomColours)"
                />
            </div>
        </div>
        <div class="group-buttons">
            <refresh-icon @refresh="refreshRandom" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useStore from '@/store';
import useColourDrag from '@/store/colourDrag';
import ColourBlock from '@/components/ColourBlock.vue';
import ClipboardButton from '@/components/ClipboardButton.vue';
import RefreshIcon from '@/components/RefreshIcon.vue';

const store = useStore();
const { setDrag } = useColourDrag();
const { setRandomColour, setRandomLock, refreshRandom } = store;
const { randomColours, randomLocks } = storeToRefs(store);

const onBlockInput = (colour: string, i: number) => {
    setRandomColour(i, colour);
};
</script>

<style lang="postcss" scoped>
#colour-select {
    @apply flex;

    .left-side {
        @apply flex-1;

        .blocks {
            @apply flex mb-4;
        }

        .select-block {
            @apply flex-1 h-48;
        }

        .copy-palette {
            @apply flex justify-end;
        }
    }

    .group-buttons {
        @apply ml-4 h-48;
    }
}
</style>

<template>
    <div id="colour-select">
        <div class="top-row">
            <div class="group-buttons">
                <refresh-icon @refresh="refreshRandom" />
            </div>
            <colour-block
                v-for="(colour, i) in randomColours"
                :key="i"
                class="select-block"
                :colour="colour"
                :locked="randomLocks[i]"
                @lock="bool => setRandomLock(i, bool)"
            />
        </div>
        <div class="bottom-row">
            <clipboard-button
                label="copy palette to clipboard"
                :content="JSON.stringify(randomColours)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import ColourBlock from '@/components/ColourBlock/ColourBlock.vue';
import useStore from '@/store';
import RefreshIcon from '../components/RefreshIcon.vue';
import ClipboardButton from '../components/ClipboardButton.vue';

const { randomColours, randomLocks, setRandomLock, refreshRandom } = useStore();

</script>

<style lang="postcss" scoped>
#colour-select {
    .top-row {
        @apply flex h-48 mb-4;

        .group-buttons {
            @apply mr-4;
        }

        .select-block {
            @apply flex-1;
        }
    }

    .bottom-row {
        @apply flex justify-end;
    }
}
</style>

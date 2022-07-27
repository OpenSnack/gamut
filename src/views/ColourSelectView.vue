<template>
    <div id="colour-select">
        <div class="group-buttons">
            <refresh-cw
                class="group-button"
                size="48"
                @click="refreshRandom"
            />
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
</template>

<script setup lang="ts">
import ColourBlock from '@/components/ColourBlock/ColourBlock.vue';
import useStore from '@/store';
import { RefreshCw } from 'lucide-vue-next';

const { randomColours, randomLocks, setRandomLock, refreshRandom } = useStore();
</script>

<style lang="postcss" scoped>
#colour-select {
    @apply flex h-48;

    .group-buttons {
        @apply mr-4;
        
        .group-button {
            @apply cursor-pointer;
        }
    }

    .select-block {
        @apply flex-1;
    }
}
</style>

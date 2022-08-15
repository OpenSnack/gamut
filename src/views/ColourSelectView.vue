<template>
    <div id="colour-select">
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
</template>

<script setup lang="ts">
import ColourBlock from '@/components/ColourBlock/ColourBlock.vue';
import useStore from '@/store';
import RefreshIcon from '../components/RefreshIcon.vue';

const { randomColours, randomLocks, setRandomLock, refreshRandom } = useStore();

</script>

<style lang="postcss" scoped>
#colour-select {
    @apply flex h-48;

    .group-buttons {
        @apply mr-4;
    }

    .select-block {
        @apply flex-1;
    }
}
</style>

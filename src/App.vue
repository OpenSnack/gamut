<template>
    <main>
        <gamut-logo class="py-8" />
        <page-section
            :number="1"
            title="Select some base colours"
        >
            <template #content>
                <colour-select-view />
            </template>
        </page-section>
        <page-section
            :number="2"
            title="Build your scale"
        >
            <template #content>
                <scale-builder-view />
            </template>
        </page-section>
        <page-section
            :number="3"
            title="Export your scale"
        />
    </main>
</template>

<script setup lang="ts">
import GamutLogo from './components/GamutLogo.vue';
import PageSection from './components/PageSection.vue';
import ColourSelectView from './views/ColourSelectView.vue';
import ScaleBuilderView from './views/ScaleBuilderView.vue';
</script>

<style lang="postcss">
@import './assets/tailwind.css';

main {
    @apply container max-w-screen-xl mx-auto;

    * {
        @apply font-default text-offblack;
    }
}
</style>

<template>
    <main>
        <gamut-logo class="py-8" />
        <page-section :number="1" title="Select some base colours" />
        <page-section :number="2" title="Build your scale" />
        <page-section :number="3" title="Export your scale" />
    </main>
</template>

<script setup lang="ts">
import GamutLogo from './components/GamutLogo.vue';
import PageSection from './components/PageSection.vue';
</script>

<style lang="postcss">
@import './assets/tailwind.css';

main {
    @apply container max-w-screen-xl mx-auto;

    * {
        @apply font-default;
    }
}
</style>

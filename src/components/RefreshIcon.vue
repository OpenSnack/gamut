<template>
    <refresh-cw
        class="refresh"
        :class="{ spinning, hovering: hovering && !spinning }"
        size="48"
        @mouseenter="onRefreshEnter"
        @mouseleave="onRefreshLeave"
        @focusin="onRefreshEnter"
        @focusout="onRefreshEnter"
        @click="onRefreshClick"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { timer, type Timer } from 'd3-timer';

const SPIN_HALF_TIME = 375;

function getStopTime(n: number) {
    if (n < SPIN_HALF_TIME / 2) return SPIN_HALF_TIME - n;
    return SPIN_HALF_TIME * 2 - n;
}

const emit = defineEmits<{
    (e: 'refresh'): void
}>();

const hovering = ref(false);
const spinning = ref(false);
const spinTimer = ref<Timer>();
const spinTimeElapsed = ref(0);

const onRefreshEnter = () => {
    hovering.value = true;
};

const onRefreshLeave = () => {
    hovering.value = false;
};

const onRefreshClick = () => {
    spinning.value = true;
    if (spinTimer.value) {
        spinTimer.value.stop();
    }
    const stopTime = getStopTime(spinTimeElapsed.value);
    spinTimer.value = timer(elapsed => {
        if (elapsed > stopTime) {
            spinTimer.value?.stop();
            spinTimeElapsed.value = 0;
            spinning.value = false;
        } else {
            spinTimeElapsed.value = elapsed;
        }
    });
    emit('refresh');
};
</script>

<style lang="postcss" scoped>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes hover {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(10deg);
    }
}

.refresh {
    @apply cursor-pointer;

    &.hovering {
        animation: hover 0.25s ease-in 0s forwards;
    }

    &.spinning {
        animation: spin 0.75s linear infinite;
    }
}
</style>

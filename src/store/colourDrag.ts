import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
import type { Coords } from '@/types';

export default defineStore('colourDrag', () => {
    const active = ref(false);
    const colour = ref('black');
    const coords: Ref<Coords> = ref({ x: 0, y: 0 });

    const setDrag = (dragColour: string, dragCoords: Coords) => {
        active.value = true;
        colour.value = dragColour;
        coords.value = dragCoords;
    };

    const reset = () => {
        active.value = false;
    };

    return {
        active,
        colour,
        coords,

        setDrag,
        reset
    };
});

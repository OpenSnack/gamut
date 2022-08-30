import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export default defineStore('colourDrag', () => {
    const active = ref(false);
    const colour = ref('black');
    const coords: Ref<{ x: number; y: number; }> = ref({ x: 0, y: 0 });

    const setDrag = (dragColour: string, dragCoords: { x: number; y: number; }) => {
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

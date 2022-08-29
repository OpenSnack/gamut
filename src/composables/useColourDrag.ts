import { ref, type Ref } from 'vue';

export default function useColourDrag() {
    const active = ref(false);
    const colour = ref('black');
    const coords: Ref<{ x: number; y: number; }> = ref({ x: 0, y: 0 });

    return {
        active,
        colour,
        coords
    };
}

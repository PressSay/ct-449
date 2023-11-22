<script>
import ItemLastWid from './ItemLastWid.vue';

export default {
    components: {
        ItemLastWid
    },
    props: {
        arrLast: { type: Array, default: [] },
        backend: { type: String, required: true }
    }
};
</script>

<template>
    <div class="widget">
        <div class="section-heading heading-dark">
            <h3 class="item-heading">LATEST RECIPES</h3>
        </div>
        <div class="widget-latest">
            <ul class="block-list">
                <ItemLastWid v-for="draw in this.arrLast" :draw="draw" :backend="backend"/>
            </ul>
        </div>
    </div>
</template>
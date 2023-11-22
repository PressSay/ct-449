<script>
import ItemRandom from './ItemRandom.vue';

export default {
    components: {
        ItemRandom
    },
    props: {
        arrRandom: { type: Array, default: [] },
        backend: { type: String, required: true },
    }
};
</script>
<template>
    <section class="padding-bottom-18">
        <div class="container">
            <div class="row">
                <ItemRandom 
                    v-for="(random, index) in arrRandom"
                    :key="random._id"
                    :draw="random"
                    :backend="this.backend"/>
            </div>
        </div>
    </section>
</template>
<script>
import ItemEditor from './ItemEditor.vue';

export default {
    components: { ItemEditor },
    props: {
        arrChoice: { type: Array, default: [] },
        backend: { type: String, default: [] }
    }
}
</script>

<template>
    <section class="padding-bottom-45">
        <div class="container">
            <div class="section-heading heading-dark">
                <h2 class="item-heading">LỰA CHỌN CỦA BIÊN TẬP</h2>
            </div>
            <div class="row">
                <ItemEditor v-for="draw in this.arrChoice" :draw="draw" :backend="this.backend"/>
            </div>
        </div>
    </section>
</template>
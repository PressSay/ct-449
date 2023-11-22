<script>
import SidebarPopular from './SidebarPopular.vue';
import ItemPopular from './ItemPopular.vue';
export default {
    components: {
        SidebarPopular,
        ItemPopular
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    props: {
        arrPop: { type: Array, default: [] },
        arrCategory: { type: Array, default: [] },
        arrFeature: { type: Array, default: [] },
        backend: { type: String, required: true }
    },
    data() {
        return {
            sidebarRen: false,
            isMounted: false
        };
    },
    methods: {
        watchSidebarRen(event) {
            this.sidebarRen = event;
        }
    },
    watch: {
        sidebarRen() {
            this.$emit("renderP", this.isMounted && this.sidebarRen);
        }
    },
    mounted() {
        // console.log("popular mounted");
        this.isMounted = true;
    },
};
</script>

<template>
    <section class="padding-bottom-45">
        <div class="container">
            <div class="row gutters-60">
                <div class="col-lg-8">
                    <div class="section-heading heading-dark">
                        <h2 class="item-heading">POPULAR RECIPES</h2>
                    </div>
                    <div class="row">
                        <ItemPopular v-for="index in arrPop.length" :draw="arrPop[index - 1]" :backend="this.backend" />
                    </div>
                </div>
                <SidebarPopular @isRenderS="watchSidebarRen($event)" :arrFeature="arrFeature" :arrCategory="arrCategory"
                    :backend="this.backend" />
            </div>
        </div>
    </section>
</template>


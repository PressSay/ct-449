<script>
import ItemFeaturedWid from './ItemFeaturedWid.vue';

export default {
    components: { ItemFeaturedWid },
    computed: {
        console: () => console,
        window: () => window,
    },
    data() {
        return {
            isMounted: false, //L = local
            itemRen: false,
        };
    },
    props: {
        arrFeature: { type: Array, default: [] },
        backend: { type: String, required: true },
    },
    watch: {
        itemRen() {
            // this.console.log("arrSliderLen Change", this.arrSlider.length);
            // this.console.log("itemRen", this.itemRen);
            if (this.arrFeature.length > 0 && this.isMounted && this.itemRen) {
                this.$emit("isRenderW", true);
            }
        }
    },
    methods: {
        watchItemRender(event) {
            this.itemRen = event;
        }
    },
    mounted() {
        this.isMounted = true;
    },
};
</script>

<template>
    <div class="widget-featured-feed">
        <div class="rc-carousel nav-control-layout1" data-loop="true" data-items="3" data-margin="5" data-autoplay="true"
            data-autoplay-timeout="5000" data-smart-speed="700" data-dots="false" data-nav="true" data-nav-speed="false"
            data-r-x-small="1" data-r-x-small-nav="true" data-r-x-small-dots="false" data-r-x-medium="1"
            data-r-x-medium-nav="true" data-r-x-medium-dots="false" data-r-small="1" data-r-small-nav="true"
            data-r-small-dots="false" data-r-medium="1" data-r-medium-nav="true" data-r-medium-dots="false" data-r-large="1"
            data-r-large-nav="true" data-r-large-dots="false" data-r-extra-large="1" data-r-extra-large-nav="true"
            data-r-extra-large-dots="false">
            <ItemFeaturedWid v-for="index in arrFeature.length" :draw="arrFeature[index - 1]" :backend="backend"
                :last="index == arrFeature.length" @isRenderF="watchItemRender($event)" />
        </div>
    </div>
</template>
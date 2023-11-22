<script>
import ItemSlider from './ItemSlider.vue';


export default {
    components: {
        ItemSlider
    },
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
        arrSlider: { type: Array, default: [] },
        backend: { type: String, required: true },
    },
    watch: {
        itemRen: function () {
            // this.console.log("arrSliderLen Change", this.arrSlider.length);
            // this.console.log("itemRen", this.itemRen);
            if (this.arrSlider.length > 0 && this.isMounted && this.itemRen) {
                this.$emit("renderR", true);
            }
        }
    },
    methods: {
        watchItemRender(event) {
            this.itemRen = event;
        }
    },
    mounted() {
        // console.log("slider mounted");
        this.isMounted = true;
    },
};

</script>

<template>
    <section class="ranna-slider-area">
        <div class="container">
            <div class="rc-carousel nav-control-layout2" data-loop="true" data-items="30" data-margin="5"
                data-autoplay="false" data-autoplay-timeout="5000" data-smart-speed="700" data-dots="false" data-nav="true"
                data-nav-speed="false" data-r-x-small="1" data-r-x-small-nav="true" data-r-x-small-dots="false"
                data-r-x-medium="1" data-r-x-medium-nav="true" data-r-x-medium-dots="false" data-r-small="1"
                data-r-small-nav="true" data-r-small-dots="false" data-r-medium="1" data-r-medium-nav="true"
                data-r-medium-dots="false" data-r-large="1" data-r-large-nav="true" data-r-large-dots="false"
                data-r-extra-large="1" data-r-extra-large-nav="true" data-r-extra-large-dots="false">
                <!-- van de thang ItemSlider chua kip load. giai quyet cho no render het -->
                <ItemSlider v-for="index in arrSlider.length" :draw="arrSlider[index - 1]" :last="index == arrSlider.length"
                    :backend="this.backend" @isRenderedF="watchItemRender($event)" />
            </div>
        </div>
    </section>
</template>
<script>
import WidgetFeatured from './WidgetFeatured.vue';

export default {
    components: { WidgetFeatured },
    props: {
        arrCategory: { type: Array, default: [] },
        arrFeature: { type: Array, default: [] },
        backend: { type: String, default: [] }
    },
    data() {
        return {
            renderWidget: false,
            isMounted: false,
        }
    },
    methods: {
        watchRenderWidget(event) {
            this.renderWidget = event;
        },
        urlGenre(_id) {
            return "/genre/" + _id;
        }
    },
    watch: {
        renderWidget() {
            this.$emit("isRenderS", this.isMounted && this.renderWidget);
        }
    },
    mounted() {
        this.isMounted = true;
    },
};
</script>

<template>
    <div class="col-lg-4 sidebar-widget-area sidebar-break-md">
        <div class="widget">
            <div class="section-heading heading-dark">
                <h3 class="item-heading">FEATURED ARTICLE</h3>
            </div>
            <WidgetFeatured :arrFeature="this.arrFeature" :backend="backend" @isRenderW="watchRenderWidget($event)" />
        </div>
        <div class="widget">
            <div class="section-heading heading-dark">
                <h3 class="item-heading">POPULAR TAGS</h3>
            </div>
            <div class="widget-tag">
                <ul>
                    <li v-for="draw in this.arrCategory">
                        <a :href="urlGenre(draw.category._id)" :v-model="draw.category.name">{{ draw.category.name }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
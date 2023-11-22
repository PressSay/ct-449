<script>
import WidgetSubscribe from './WidgetSubscribe.vue';
import WidgetFeatured from './WidgetFeatured.vue';
import WidgetLast from './WidgetLast.vue';
export default {
    components: { WidgetSubscribe, WidgetFeatured, WidgetLast }
}
</script>

<template>
    <div class="col-lg-4 sidebar-widget-area sidebar-break-md">
        <div class="widget">
            <div class="section-heading heading-dark">
                <h3 class="item-heading">FEATURED ARTICLE</h3>
            </div>
            <WidgetFeatured />
        </div>
        <WidgetSubscribe />
        <WidgetLast />
    </div>
</template>
<script>
import WidgetCategory from './WidgetCategory.vue';
import WidgetLast from './WidgetLast.vue';
import WidgetSubscribe from './WidgetSubscribe.vue';
export default {
    components: {
        WidgetLast,
        WidgetCategory,
        WidgetSubscribe
    },
    props: {
        arrLast: { type: Array, default: [] },
        backend: { type: String, required: true }
    }
};
</script>

<template>
    <div class="col-lg-4 sidebar-widget-area sidebar-break-md">
        <div class="widget">
            <div class="section-heading heading-dark">
                <h3 class="item-heading">ABOUT ME</h3>
            </div>
            <div class="widget-about">
                <figure class="author-figure"><img src="/src/assets/img/figure/about.jpg" alt="about"></figure>
                <!-- <figure class="author-signature"><img src="/src/assets/img/figure/signature.png" alt="about"></figure> -->
                <h3 class="author-name">Lam Phu Qui</h3>
                <p>Web Cho "Phat Trien Ung Dung Web"</p>
            </div>
        </div>
        <WidgetSubscribe />
        <WidgetLast :arrLast="this.arrLast" :backend="this.backend" />
        <div class="widget">
            <div class="widget-ad">
                <a href="#"><img src="@/assets/img/figure/figure2.jpg" alt="Ad" class="img-fluid" /></a>
            </div>
        </div>
        <WidgetCategory />
    </div>
</template>
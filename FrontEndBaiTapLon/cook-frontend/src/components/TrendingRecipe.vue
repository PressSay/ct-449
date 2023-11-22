<script>
import SidebarTrending from "./SidebarTrending.vue";
import ItemTrending from "./ItemTrending.vue";
import ItemTrendingTop from "./ItemTrendingTop.vue";
export default {
    components: {
        SidebarTrending,
        ItemTrending,
        ItemTrendingTop
    },
    props: {
        arrTrending: { type: Array, default: [] },
        arrLast: { type: Array, default: [] },
        backend: { type: String, required: true },
    }
}
</script>

<template>
    <section class="padding-bottom-45">
        <div class="container">
            <div class="row gutters-60">
                <div class="col-lg-8">
                    <div class="section-heading heading-dark">
                        <h2 class="item-heading">TRENDING RECIPES</h2>
                    </div>
                    <div class="row">
                        <ItemTrendingTop v-if="arrTrending.length > 0"  :draw="arrTrending[0]" :backend="this.backend"/>
                        <ItemTrending v-for="draw in arrTrending" :draw="draw" :backend="this.backend"/>
                    </div>
                    <div class="ranna-ad-box">
                        <a href="#"><img src="@/assets/img/figure/figure1.jpg" alt="ad"></a>
                    </div>
                </div>
                <SidebarTrending :arrLast="this.arrLast" :backend="this.backend"/>
            </div>
        </div>
    </section>
</template>
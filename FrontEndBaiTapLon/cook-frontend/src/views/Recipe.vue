<script>
import ReviewService from "../services/review.service";
import RecipeService from "../services/recipe.service";

export default {
    data() {
        return {
            arrRecipe: [],
            backend: "localhost:3000"
        };
    },
    computed: {
        window: () => window,
        console: () => console
    },
    methods: {
        async getRvAgv(id, index) {
            let agv = 0;
            try {
                const arrReview = await ReviewService.getByRecipeId(id) ?? 1;
                const length = (arrReview.length == 0) ? 1 : arrReview.length;
                for (let k in arrReview) {
                    agv += parseInt(arrReview[k].review.rating);
                }
                agv = Math.round(agv / length);
                this.arrRecipe[index].agvReview = agv;
            } catch (err) { this.console.log(err); }
        },
        getUrlRecipe(id) {
            return "/recipes/" + id;
        },
        getImgUrl(images) {
            return (images != []) ? "http://" + this.backend + images[0].path.slice(6) : "";
        },
        getIdGenre() {
            return this.$route.params.id;
        },
        async getRecipes() {
            const searchName = this.window.localStorage.getItem("nameR");
            this.arrRecipe = (this.getIdGenre() != null) ?
                await RecipeService.getGenre(this.getIdGenre()) : (searchName != null) ?
                    await RecipeService.getRecipeByName(searchName) : [];
            this.console.log("recipes", this.arrRecipe);
        }
    },
    watch: {
        arrRecipe() {
            for (let k in this.arrRecipe) {
                this.getRvAgv(this.arrRecipe[k].recipe._id, k);
            }
        }
    },
    mounted() {
        this.getRecipes();
    }
};
</script>

<template>
    <!-- Header Area End Here -->
    <!-- Inne Page Banner Area Start Here -->
    <section class="inner-page-banner bg-common" data-bg-image="/img/figure/inner-page-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Trang công Thức</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>All Recipes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Inne Page Banner Area End Here -->
    <!-- Recipe Without Sidebar Area Start Here -->
    <section class="recipe-without-sidebar-wrap padding-top-80 padding-bottom-22">
        <div class="container">
            <div class="row">

                <div v-for="(draw, index) in this.arrRecipe" class="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div class="product-box-layout1">
                        <figure class="item-figure"><a :href="this.getUrlRecipe(draw.recipe._id)"><img
                                    style="width: 33rem; height: 27rem;"
                                    :src="getImgUrl(draw.images)" alt="Product"></a></figure>
                        <div class="item-content">
                            <span class="sub-title">{{ draw.recipe.category.name }}</span>
                            <h3 class="item-title"><a :href="this.getUrlRecipe(draw.recipe._id)">{{ draw.recipe.name }}</a></h3>
                            <ul class="item-rating">
                                <li v-for="index in (draw.agvReview ?? 1)" :key="index" class="star-fill"><i
                                        class="fas fa-star"></i></li>
                                <li v-for="index in (5 - draw.agvReview ?? 4)" :key="index" class="star-empty"><i
                                        class="fas fa-star"></i></li>
                                <li><span>{{ draw.agvReview }}<span> / 5</span></span> </li>
                            </ul>
                            <p style="width: 30rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">{{ draw.recipe.short }}</p>
                            <ul class="entry-meta">
                                <li><a href="#"><i class="fas fa-clock"></i>15 Mins</a></li>
                                <li><a href="#"><i class="fas fa-user"></i>by <span>{{ draw.recipe.author.name }}</span></a></li>
                                <li><a href="#"><i class="fas fa-heart"></i><span>02</span> Likes</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <ul class="pagination-layout1 d-flex justify-content-center">
                <li class="active">
                    <a href="#">1</a>
                </li>
                <li>
                    <a href="#">2</a>
                </li>
                <li>
                    <a href="#">3</a>
                </li>
                <li>
                    <a href="#">4</a>
                </li>
            </ul>
        </div>
    </section>
</template>
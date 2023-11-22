<script>
import CategoryService from "../services/category.service";

export default {
    data() {
        return {
            arrRecipeGenre: [],
            backend: "localhost:3000",
        };
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async retrieveRecipeGenre() {
            try {
                this.arrRecipeGenre = await CategoryService.getAllProduct();
                this.console.log("arrRecipeGenre", this.arrRecipeGenre);
            } catch (error) {
                console.log(error);
            }
        },
        genreImgUrl: (images, backend) => {
            // alert("http://" + backend + images[0]['path'].slice(6));
            // alert(images != [])
            // alert(backend);
            console.log("images", "http://" + backend + images[0]['path'].slice(6));
            return (images != null) ? "http://" + backend + images[0]['path'].slice(6) : "";
        },
        categoryUrl: (id) => {
            return "/categories/" + id + "/products";
        }
    },
    mounted() {
        this.retrieveRecipeGenre();
    },
};
</script>

<template>
    <section class="inner-page-banner bg-common" data-bg-image="/src/assets/img/figure/inner-page-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Danh Mục Sản Phẩm Gia Dụng</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Danh Mục Sản Phẩm</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="category-page-wrap padding-top-80 padding-bottom-50">
        <div class="container">
            <div class="row">
                <div v-for="draw in this.arrRecipeGenre" class="col-lg-4 col-md-6 col-sm-6 col-12">
                    <div class="category-box-layout1">
                        <figure class="item-figure"><a :href="categoryUrl(draw.category._id)"><img style="height: 399px;"
                                    :src="genreImgUrl(draw.images ?? null, this.backend)" alt="category product"></a>
                        </figure>
                        <div class="item-content">
                            <h3 class="item-title"><a :href="categoryUrl(draw.category._id)">{{ draw.category.name }}</a>
                            </h3>
                            <span class="sub-title"> {{ draw.quanProduct }} Công Thức</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import ProductService from "../services/product.service";

export default {
    computed: {
        console: () => console,
        window: () => window,
    },
    data() {
        return {
            arrProduct: [],
            backend: "localhost:3000"
        };
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        urlProd(id) {
            return "/products/" + id + "/";
        },
        getId() {
            return this.$route.params.id;
        },
        productImgUrl: (images, backend) => {
            // alert("http://" + backend + images[0]['path'].slice(6));
            // alert(images != [])
            // alert(backend);
            return (images != []) ? "http://" + backend + images[0]['path'].slice(6) : "";
        },
        async retrieveProd() {
            try {
                const nameSearch = this.window.localStorage.getItem("nameP").replaceAll(" ", "+");
                this.arrProduct = (this.getId() != null) ?
                    await ProductService.getAllByCategory(this.getId()) : await ProductService.getProductByName(nameSearch);
                // this.console.log("arrProduct", this.arrProduct);
            } catch (error) {
                console.log(error);
            }
        }
    },
    watch: {
        arrProduct() {
            // this.console.log("arrProduct", this.arrProduct);
        }
    },
    mounted() {
        this.retrieveProd();
    }
}
</script>
<template>
    <!-- Header Area End Here -->
    <!-- Inne Page Banner Area Start Here -->
    <section class="inner-page-banner bg-common" data-bg-image="/img/figure/inner-page-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Trang Sản Phẩm</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Shop</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Inne Page Banner Area End Here -->
    <!-- Shop Page Area Start Here -->
    <section class="shop-page-wrap padding-top-74 padding-bottom-50">
        <div class="container">
            <div class="row gutters-60">
                <div class="col-lg-12">
                    <div class="row">
                        <div v-for="draw in this.arrProduct" class="col-md-4 col-sm-6 col-12">
                            <div class="shop-box-layout1">
                                <div class="mask-item bg--accent">
                                    <div class="item-figure">
                                        <img :src="productImgUrl(draw.images, this.backend)" alt="image product">
                                    </div>
                                    <ul class="action-items">
                                        <li>
                                            <a :href="urlProd(draw.product._id)">
                                                <i class="fas fa-shopping-cart"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i class="fas fa-exchange-alt"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#">
                                                <i class="fas fa-heart"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="item-content">
                                    <h3 class="item-title"><a :href="urlProd(draw.product._id)">{{ draw.product.name }}</a></h3>
                                    <div class="item-price">{{ draw.product.price }} <span class="currency">đ</span></div>
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
            </div>
        </div>
    </section>
</template>
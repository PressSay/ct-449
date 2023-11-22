<script>
import AuthService from '../services/auth.service';
import ProductService from '../services/product.service';
import ReviewService from '../services/review.service';
import CartService from '../services/cart.service';
import ReviewRP from '../components/ReviewRP.vue';

export default {
    components: {
        ReviewRP,
    },
    data() {
        return {
            user: null,
            draw: null,
            backend: "localhost:3000",
            arrLast: [],
            arrReview: [],
            comment: "",
            rating: 0,
            avgRating: 0,
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        avgRatingFun() {
            let sum = 0;
            for (let k in this.arrReview) {
                const numRating = parseInt(this.arrReview[k].review.rating);
                sum += numRating;
            }
            const length = (this.arrReview.length == 0) ? 1 : this.arrReview.length;
            sum = sum / length;
            // console.log("sum", sum);
            this.avgRating = Math.round(sum);
        },
        getId() {
            return this.$route.params.id;
        },
        async retrieveProduct() {
            try {
                this.draw = await ProductService.get(this.getId());
            } catch (err) {
                this.console.log(err)
            }
        },
        async retrieveReview() {
            try {
                this.arrReview = await ReviewService.getByProductId(this.getId());
                this.console.log("arrReview", this.arrReview);
            } catch (err) {
                this.console.log(err)
            }
        },
        async getUser() {
            const token = this.window.localStorage.getItem("token") ?? "";
            // this.console.log("token", token);
            try {
                AuthService.setToken(token);
                const draw = await AuthService.auth();
                const auth = {
                    _id: draw._id,
                    name: draw.name,
                    email: draw.email,
                    token: token,
                }
                this.user = auth;
                $('#add-to-cart')[0].classList.remove('invisible');
                $('.leave-review')[0].classList.remove('invisible');
                // this.console.log(this.user.token);
                // this.console.log(auth);
            } catch (err) {
                this.user = null;
                this.console.log("no Login!!", err);
            }
        },
        async submitRev() {
            try {
                await this.getUser();
                if (this.user != null) {
                    this.rating = $('.active.rate-item')[0].getAttribute('value') ?? 0;
                    const data = {
                        _id_account: this.user._id,
                        _id_product: this.getId(),
                        rating: this.rating,
                        comment: this.comment,
                    }
                    this.console.log("sumit", data);
                    await ReviewService.create(data);
                    this.window.location.reload();
                } else {
                    alert("Bạn cần đăng nhập để đánh giá");
                }
            } catch (err) {
                this.console.log(err)
            }
        },
        refresh() {
            this.retrieveProduct();
            this.retrieveReview();
        },
        eleWrapRating() {
            // this.console.log("enRating", $('.rate-wrapper'));
            $('.rate-wrapper').on('click', '.rate .rate-item', function () {
                var self = $(this),
                    target = self.parent('.rate');
                target.addClass('selected');
                target.find('.rate-item').removeClass('active');
                self.addClass('active');
            });
        },
        holdQuantity() {
            $('#quantity-holder').on('click', '.quantity-plus', function () {

                var $holder = $(this).parents('.quantity-holder');
                var $target = $holder.find('input.quantity-input');
                var $quantity = parseInt($target.val(), 10);
                if ($.isNumeric($quantity) && $quantity > 0) {
                    $quantity = $quantity + 1;
                    $target.val($quantity);
                } else {
                    $target.val($quantity);
                }
            }).on('click', '.quantity-minus', function () {

                var $holder = $(this).parents('.quantity-holder');
                var $target = $holder.find('input.quantity-input');
                var $quantity = parseInt($target.val(), 10);
                if ($.isNumeric($quantity) && $quantity >= 2) {
                    $quantity = $quantity - 1;
                    $target.val($quantity);
                } else {
                    $target.val(1);
                }
            });
        },
        async addToCart() {
            const _id_cart = this.window.localStorage.getItem("_id_cart") ?? "";
            if (_id_cart == "") {
                alert("Bạn Chưa Có Giỏ Hàng")
                return;
            }
            const data = {
                _id_product: this.getId(),
                quantity: $('#input-quantity')[0].value,
                paid: ""
            }
            this.console.log(data);
            const cartDetail = await CartService.update(_id_cart, data);
            if (cartDetail) {
                alert("Thêm vào giỏ hàng thành công");
                this.window.location.reload();
            }
        }
    },
    watch: {
        draw() {
            this.console.log("draw", this.draw)
            // console.log("direct", this.refs['direct']);
        },
        arrReview() {
            this.avgRatingFun();
        }
    },
    mounted() {
        this.getUser();
        this.refresh();
        this.eleWrapRating();
        this.holdQuantity();
    },

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
                        <h1>Trang Chi Tiết Sản Phẩm</h1>
                        <ul>
                            <li>
                                <a href="index.html">Home</a>
                            </li>
                            <li>Chi Tiết Sản Phẩm</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Inne Page Banner Area End Here -->
    <!-- Single Shop Page Area Start Here -->
    <section class="single-shop-page-wrap padding-top-80 padding-bottom-70">
        <div class="container single-recipe-layout1">
            <div class="row">
                <div v-if="draw != null" class="col-lg-7 col-12">
                    <div class="single-shop-figure-view">
                        <div class="row">
                            <div class="col-lg-9 col-12 order-lg-2">
                                <div class="tab-content">
                                    <div v-for="img in draw.images" class="tab-pane fade active show" id="related1">
                                        <a class="d-flex justify-content-center" href="#"><img
                                                style="min-width: 30.937rem  !important; display: block;" alt="single"
                                                :src="'http://' + this.backend + img.path.slice(6)"
                                                data-zoom-image="/img/product/product27b.png"></a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-12 order-lg-1">
                                <ul class="nav tab-nav tab-nav-list">
                                    <li v-for="img in draw.images" class="nav-item">
                                        <a class="active" href="#related1" data-toggle="tab" aria-expanded="false"><img
                                                alt="related1" :src="'http://' + this.backend + img.path.slice(6)"
                                                class="img-fluid"></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5 col-12">
                    <div class="single-shop-content">
                        <h2 v-if="draw != null" class="item-title">{{ draw.product.name }}</h2>
                        <ul class="item-rate">
                            <li v-for="index in this.avgRating" :key="index"><i class="fas fa-star"></i></li>
                            <li><a href="#">( {{ this.avgRating }} Reviews )</a></li>
                        </ul>
                        <div v-if="draw != null" class="item-price">{{ draw.product.price }} đ<span>{{ draw.product.price }}
                                đ</span></div>
                        <ul v-if="draw != null" class="entry-meta d-flex">
                            <li>SKU: <span>{{ draw.product.sku }}</span></li>
                            <li>Danh Mục: <a href="#">{{ draw.product.category.name }}</a></li>
                        </ul>
                        <ul class="item-social">
                            <li>Share:</li>
                            <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
                            <li><a href="#"><i class="fab fa-twitter"></i></a></li>
                            <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
                            <li><a href="#"><i class="fab fa-google-plus-g"></i></a></li>
                            <li><a href="#"><i class="fab fa-pinterest-square"></i></a></li>
                            <li><a href="#"><i class="fab fa-youtube"></i></a></li>
                            <li><a href="#"><i class="fab fa-behance"></i></a></li>
                        </ul>
                        <div v-if="draw != null" class="item-details" v-html="draw.product.description"></div>
                        <ul id="add-to-cart" class="action-area1 invisible">
                            <li id="quantity-holder">
                                <div class="input-group quantity-holder">
                                    <input id="input-quantity" type="text" name='quantity' class="form-control quantity-input" value="1"
                                        placeholder="1">
                                    <div class="input-group-btn">
                                        <button class="quantity-btn quantity-plus" type="button"><i class="fa fa-plus"
                                                aria-hidden="true"></i></button>
                                        <button class="quantity-btn quantity-minus" type="button"><i class="fa fa-minus"
                                                aria-hidden="true"></i></button>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a @click="addToCart()" href="#" class="cart-btn">Thêm Vào Giỏ</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-12">
                    <div class="single-shop-description">
                        <ul class="nav nav-tabs tab-nav-list">
                            <li class="nav-item">
                                <a class="active" href="#related6" data-toggle="tab" aria-expanded="false">Tính Năng</a>
                            </li>
                            <li class="nav-item">
                                <a href="#related7" data-toggle="tab" aria-expanded="false">Reviews</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div v-if="draw != null" class="tab-pane fade  active show" id="related6">
                                {{ draw.product.feature }}
                            </div>
                            <div class="tab-pane fade" id="related7">
                                <ReviewRP :avgRating="this.avgRating" :arrReview="this.arrReview" :backend="this.backend" />

                                <div class="leave-review invisible">
                                    <div class="section-heading heading-dark">
                                        <h2 class="item-heading">Để Lại Đánh Giá</h2>
                                    </div>
                                    <div class="rate-wrapper">
                                        <div class="rate-label">Rating</div>
                                        <div class="rate">
                                            <div value="1" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                            <div value="2" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                            <div value="3" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                            <div value="4" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                            <div value="5" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="leave-form-box ">
                                        <div class="row">
                                            <div class="col-12 form-group">
                                                <label>Bình Luận :</label>
                                                <textarea v-model="this.comment" placeholder=""
                                                    class="textarea form-control" name="message" rows="7" cols="20"
                                                    data-error="Trường tin nhắn là bắt buộc" required></textarea>
                                                <div class="help-block with-errors"></div>
                                            </div>
                                            <div class="col-12 form-group mb-0">
                                                <button @click="submitRev()" class="item-btn">Đăng</button>
                                            </div>
                                        </div>
                                        <div class="form-response"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </section>
</template>
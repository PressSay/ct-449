<script>
import SidebarTrending from "../components/SidebarTrending.vue";
import RecipeService from "../services/recipe.service";
import ReviewRP from "../components/ReviewRP.vue";
import InfoShowRcp from "../components/InfoShowRcp.vue";
import ReviewService from "../services/review.service";
import AuthService from '../services/auth.service';


export default {
    components: {
        SidebarTrending,
        ReviewRP,
        InfoShowRcp
    },
    data() {
        return {
            user: null,
            draw: null,
            backend: "localhost:3000",
            arrReview: [],
            comment: "",
            rating: 0,
            avgRating: 0
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
        async retrieveRecipe() {
            try {
                this.draw = await RecipeService.get(this.getId());
            } catch (err) {
                this.console.log(err)
            }
        },
        async retrieveReview() {
            try {
                this.arrReview = await ReviewService.getByRecipeId(this.getId());
                console.log("arrReview", this.arrReview);
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
                $('.leave-review')[0].classList.remove('invisible');
                // this.console.log(this.user.token);
                // this.console.log(auth);
            } catch (err) {
                this.user = null;
                // this.console.log("no Login!!", err);
            }
        },
        async submitRev() {
            try {
                await this.getUser();
                if (this.user != null) {
                    this.rating = $('.active')[0].getAttribute('value') ?? 0;
                    const data = {
                        _id_account: this.user._id,
                        _id_recipe: this.getId(),
                        rating: this.rating,
                        comment: this.comment,
                    }
                    // this.console.log("sumit", data);
                    await ReviewService.create(data);
                    this.window.location.reload();
                } else {
                    alert("Bạn cần đăng nhập để đánh giá");
                }
            } catch (err) {
                this.console.log(err)
            }
        },
        recipeImgUrl: (images, backend) => {
            // alert("http://" + backend + images[0]['path'].slice(6));
            // alert(images != [])
            // alert(backend);
            return (images != []) ? "http://" + backend + images[0]['path'].slice(6) : "";
        },
        refresh() {
            this.retrieveRecipe();
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
        }
    },
    watch: {
        draw() {
            // this.console.log("draw", this.draw)
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
    },

}
</script>

<template>
    <section class="inner-page-banner bg-common" data-bg-image="/img/figure/inner-page-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Công Thức Chi Tiết</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Công Thức Chi Tiết</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>


    <section class="single-recipe-wrap-layout1 padding-top-74 padding-bottom-50">
        <div class="container">
            <div class="row gutters-60">
                <div class="col-lg-8">
                    <div class="single-recipe-layout1">
                        <div v-if="this.draw" class="ctg-name">{{ this.draw.recipe.category.name }}</div>
                        <h2 v-if="this.draw" class="item-title">{{ this.draw.recipe.name }}</h2>
                        <div class="row mb-4">
                            <div class="col-xl-9 col-12">
                                <ul class="entry-meta">
                                    <li class="single-meta"><a href="#"><i class="far fa-calendar-alt"></i>Nov 14,
                                            2018</a></li>
                                    <li v-if="this.draw" class="single-meta"><a href="#"><i class="fas fa-user"></i>by
                                            <span>{{
                                                this.draw.recipe.author.name }}</span></a></li>
                                    <li v-if="this.draw" class="single-meta">
                                        <ul class="item-rating">
                                            <li v-for="index in this.avgRating" class="star-fill"><i
                                                    class="fas fa-star"></i></li>
                                            <li><span>{{ this.avgRating }}<span> / 5</span></span> </li>
                                        </ul>
                                    </li>
                                    <li v-if="this.draw" class="single-meta"><a href="#"><i class="fas fa-heart"></i><span
                                                :v-model="this.draw.recipe.like">{{ this.draw.recipe.like }}</span>
                                            Likes</a></li>
                                </ul>
                            </div>
                            <div class="col-xl-3 col-12">
                                <ul class="action-item">
                                    <li><button><i class="fas fa-print"></i></button></li>
                                    <li><button><i class="fas fa-expand-arrows-alt"></i></button></li>
                                    <li class="action-share-hover"><button><i class="fas fa-share-alt"></i></button>
                                        <div class="action-share-wrap">
                                            <a href="#" title="facebook"><i class="fab fa-facebook-f"></i></a>
                                            <a href="#" title="twitter"><i class="fab fa-twitter"></i></a>
                                            <a href="#" title="linkedin"><i class="fab fa-linkedin-in"></i></a>
                                            <a href="#" title="pinterest"><i class="fab fa-pinterest-p"></i></a>
                                            <a href="#" title="skype"><i class="fab fa-skype"></i></a>
                                            <a href="#" title="rss"><i class="fas fa-rss"></i></a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div v-if="this.draw" class="item-figure text-center">
                            <img :src="recipeImgUrl(this.draw.images, this.backend)" alt="recipe image">
                        </div>

                        <InfoShowRcp />

                        <p v-if="this.draw" class="item-description">{{ this.draw.recipe.short }}</p>
                        <div v-if="this.draw" class="making-elements-wrap">
                            <div class="row">
                                <div class="col-xl-6 col-12">
                                    <div class="ingridients-wrap">
                                        <h3 class="item-title"><i class="fas fa-list-ul"></i>Nguyên Liệu:</h3>
                                        <div v-for="ingre in this.draw.ingredient" class="checkbox checkbox-primary">
                                            <input :id="ingre._id" type="checkbox">
                                            <label :for="ingre._id">{{ ingre.quantity }} {{ ingre.name }}</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-6 col-12">
                                    <div class="nutrition-wrap">
                                        <h3 class="item-title"><i class="fas fa-info"></i>Giá trị dinh dưỡng:</h3>
                                        <ul class="nutrition-list">
                                            <li v-for="nut in this.draw.nutrition">
                                                <div class="nutrition-name">{{ nut.name }}</div>
                                                <div class="nutrition-value">{{ nut.unit }}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div v-if="this.draw" class="direction-wrap-layout1">
                            <div class="section-heading heading-dark">
                                <h2 class="item-heading">DIRECTIONS</h2>
                            </div>
                            <div v-html="this.draw.recipe.description"></div>
                        </div>

                        <ReviewRP :avgRating="this.avgRating" :arrReview="this.arrReview" :backend="this.backend" />

                        <div class="leave-review invisible">
                            <div class="section-heading heading-dark">
                                <h2 class="item-heading">LEAVE A REVIEW</h2>
                            </div>
                            <div class="rate-wrapper">
                                <div class="rate-label">Rating</div>
                                <div class="rate">
                                    <div value="1" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i></div>
                                    <div value="2" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i></div>
                                    <div value="3" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i></div>
                                    <div value="4" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i></div>
                                    <div value="5" class="rate-item"><i class="fa fa-star" aria-hidden="true"></i></div>
                                </div>
                            </div>
                            <div class="leave-form-box">
                                <div class="row">
                                    <div class="col-12 form-group">
                                        <label>Comment :</label>
                                        <textarea v-model="this.comment" placeholder="" class="textarea form-control"
                                            name="message" rows="7" cols="20" data-error="Trường tin nhắn là bắt buộc"
                                            required></textarea>
                                        <div class="help-block with-errors"></div>
                                    </div>
                                    <div class="col-12 form-group mb-0">
                                        <button @click="submitRev()" class="item-btn">POST REVIEW</button>
                                    </div>
                                </div>
                                <div class="form-response"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <SidebarTrending :arrLast="this.arrLast" :backend="this.backend" />
            </div>
        </div>
    </section>
</template>
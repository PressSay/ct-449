<script>
import EditorChoice from '../components/EditorChoice.vue';
import Instagram from '../components/Instagram.vue';
import RannaSlider from '../components/RannaSlider.vue';
import RandomRecipe from '../components/RandomRecipe.vue';
import TrendingRecipe from '../components/TrendingRecipe.vue';
import PopularRecipe from '../components/PopularRecipe.vue';
import RecipeService from '../services/recipe.service';
import CategoryService from '../services/category.service.js';


export default {
    components: {
        RannaSlider,
        RandomRecipe,
        TrendingRecipe,
        EditorChoice,
        PopularRecipe,
        Instagram
    },
    data() {
        return {
            arrRandom: [],
            arrSlider: [],
            arrTrending: [],
            arrLast: [],
            arrChoice: [],
            arrPop: [],
            arrCategory: [],
            arrFeature: [],
            backend: "127.0.0.1:3000",
            isRannaSlider: false,
            isRenderPop: false,
            isMounted: false,
            isSliderRender: false
        };
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async retrieveRandom() {
            try {
                this.arrRandom = await RecipeService.getRandom();
                this.arrRandom = this.arrRandom.slice(0, 3);
                // console.log(this.arrRandom);
            } catch (error) {
                console.log(error);
            }
        },
        async retrieveSlider() {
            try {
                this.arrSlider = await RecipeService.getSlider();
                // console.log("arrSlider", this.arrSlider);
            } catch (error) {
                console.log(error);
            }
        },
        async retrieveTrending() {
            try {
                this.arrTrending = await RecipeService.getTrending();
                this.arrLast = this.arrTrending.slice(0, 3);
                // this.console.log("Home", this.arrLast);
            } catch (error) {
                this.console.log(error);
            }
        },
        async retrieveChoice() {
            try {
                this.arrChoice = await RecipeService.getChosen();
                // this line note remember mix arrChoice
                this.arrChoice = this.arrChoice.slice(0, 3);
            } catch (error) {
                this.console.log(error);
            }
        },
        async retrievePop() {
            try {
                this.arrPop = await RecipeService.getPopular();
                this.arrCategory = await CategoryService.getAllRecipe();
                this.arrFeature = this.arrPop.slice(0, 3);
                // console.log("feature", this.arrFeature);
                // console.log("arrCategory", this.arrCategory);
            } catch (error) {
                this.console.log(error);
            }
        },
        refreshList() {
            this.retrieveRandom();
            this.retrieveSlider();
            this.retrieveTrending();
            this.retrieveChoice();
            this.retrievePop();
        },
        isRenderRannaEmit(event) {
            this.isRannaSlider = event;
        },
        isRenderPopEmit(event) {
            this.isRenderPop = event;
        },
    },
    watch: {
        isRannaSlider() {
            // this.console.log("isRenderRanna", this.isRannaSlider);
            this.isSliderRender = this.isRannaSlider && this.isRenderPop && this.isMounted;
        },
        isRenderPop() {
            // this.console.log("isRenderPop", this.isRenderPop);
            this.isSliderRender = this.isRannaSlider && this.isRenderPop && this.isMounted;
        },
        isMounted() {
            // this.console.log("isMounted", this.isMounted);
            this.isSliderRender = this.isRannaSlider && this.isRenderPop && this.isMounted;
        },
        isSliderRender() {
            if (this.isSliderRender) {
                // this.console.log("renderSlider");
                $('.rc-carousel').each(function () {
                    var carousel = $(this),
                        loop = carousel.data('loop'),
                        items = carousel.data('items'),
                        margin = carousel.data('margin'),
                        stagePadding = carousel.data('stage-padding'),
                        autoplay = carousel.data('autoplay'),
                        autoplayTimeout = carousel.data('autoplay-timeout'),
                        smartSpeed = carousel.data('smart-speed'),
                        dots = carousel.data('dots'),
                        nav = carousel.data('nav'),
                        navSpeed = carousel.data('nav-speed'),
                        rXsmall = carousel.data('r-x-small'),
                        rXsmallNav = carousel.data('r-x-small-nav'),
                        rXsmallDots = carousel.data('r-x-small-dots'),
                        rXmedium = carousel.data('r-x-medium'),
                        rXmediumNav = carousel.data('r-x-medium-nav'),
                        rXmediumDots = carousel.data('r-x-medium-dots'),
                        rSmall = carousel.data('r-small'),
                        rSmallNav = carousel.data('r-small-nav'),
                        rSmallDots = carousel.data('r-small-dots'),
                        rMedium = carousel.data('r-medium'),
                        rMediumNav = carousel.data('r-medium-nav'),
                        rMediumDots = carousel.data('r-medium-dots'),
                        rLarge = carousel.data('r-large'),
                        rLargeNav = carousel.data('r-large-nav'),
                        rLargeDots = carousel.data('r-large-dots'),
                        rExtraLarge = carousel.data('r-extra-large'),
                        rExtraLargeNav = carousel.data('r-extra-large-nav'),
                        rExtraLargeDots = carousel.data('r-extra-large-dots'),
                        center = carousel.data('center'),
                        custom_nav = carousel.data('custom-nav') || '';
                    carousel.addClass('owl-carousel');
                    // console.log("carouselThis", carousel);
                    var owl = carousel.owlCarousel({
                        loop: (loop ? true : false),
                        items: (items ? items : 4),
                        lazyLoad: true,
                        margin: (margin ? margin : 0),
                        autoplay: (autoplay ? true : false),
                        autoplayTimeout: (autoplayTimeout ? autoplayTimeout : 1000),
                        smartSpeed: (smartSpeed ? smartSpeed : 250),
                        dots: (dots ? true : false),
                        nav: (nav ? true : false),
                        navText: ['<i class="flaticon-back" aria-hidden="true"></i>', '<i class="flaticon-next" aria-hidden="true"></i>'],
                        navSpeed: (navSpeed ? true : false),
                        center: (center ? true : false),
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: (rXsmall ? rXsmall : 1),
                                nav: (rXsmallNav ? true : false),
                                dots: (rXsmallDots ? true : false)
                            },
                            576: {
                                items: (rXmedium ? rXmedium : 2),
                                nav: (rXmediumNav ? true : false),
                                dots: (rXmediumDots ? true : false)
                            },
                            768: {
                                items: (rSmall ? rSmall : 3),
                                nav: (rSmallNav ? true : false),
                                dots: (rSmallDots ? true : false)
                            },
                            992: {
                                items: (rMedium ? rMedium : 4),
                                nav: (rMediumNav ? true : false),
                                dots: (rMediumDots ? true : false)
                            },
                            1200: {
                                items: (rLarge ? rLarge : 5),
                                nav: (rLargeNav ? true : false),
                                dots: (rLargeDots ? true : false)
                            },
                            1400: {
                                items: (rExtraLarge ? rExtraLarge : 6),
                                nav: (rExtraLargeNav ? true : false),
                                dots: (rExtraLargeDots ? true : false)
                            }
                        }
                    });
                    // console.log("custom_nav", custom_nav);
                    if (custom_nav) {
                        var nav = $(custom_nav),
                            nav_next = $('.rt-next', nav),
                            nav_prev = $('.rt-prev', nav);

                        nav_next.on('click', function (e) {
                            e.preventDefault();
                            owl.trigger('next.owl.carousel');
                            return false;
                        });

                        nav_prev.on('click', function (e) {
                            e.preventDefault();
                            owl.trigger('prev.owl.carousel');
                            return false;
                        });
                    }
                });
            }
        }
    },
    mounted() {
        // /src/assets/js/owl.carousel.min.js
        this.refreshList();
        this.isMounted = true;
    }
};
</script>

<template>
    <RannaSlider :arrSlider="arrSlider" :backend="backend" @renderR="isRenderRannaEmit($event)" />
    <RandomRecipe :arrRandom="arrRandom" :backend="backend" />
    <TrendingRecipe :arrTrending="this.arrTrending" :arrLast="this.arrLast" :backend="this.backend" />
    <EditorChoice :arrChoice="this.arrChoice" :backend="this.backend" />
    <PopularRecipe @renderP="isRenderPopEmit($event)" :arrPop="this.arrPop" :arrCategory="this.arrCategory"
        :arrFeature="this.arrFeature" :backend="backend" />
    <Instagram />
</template>
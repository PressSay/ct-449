<script>

export default {
    props: {
        arrReview: { type: Array, default: [] },
        backend: { type: String, required: true },
        avgRating: { type: Number, default: 0}
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        
        authorImgUrl: (imagePath, backend) => {
            // alert("http://" + backend + images[0]['path'].slice(6));
            // alert(images != [])
            // alert(backend);
            return (imagePath != "") ? "http://" + backend + imagePath.slice(6) : "";
        }
    }
};
</script>

<template>
    <div class="recipe-reviews">
        <div class="section-heading heading-dark">
            <h2 class="item-heading">REVIEWS</h2>
        </div>
        <div class="avarage-rating-wrap">
            <div class="avarage-rating">Đánh giá trung bình
                <span class="rating-icon-wrap">
                    <i v-for="index in this.avgRating" :key="index" class="fas fa-star"></i>
                </span>
                <span class="rating-number"> ({{ this.avgRating }})</span>
            </div>
            <div class="total-reviews">Tổng số đánh giá:<span class="review-number">{{ arrReview.length }}</span></div>
        </div>
        <ul>
            <li v-for="draw in this.arrReview" class="reviews-single-item">
                <div class="media media-none--xs">
                    <img style="width: 5.625rem; height: 5.625rem; object-fit: cover;"
                        :src="authorImgUrl(draw.review.author.imagePath, backend)" alt="Comment" class="media-img-auto">
                    <div class="media-body">
                        <h4 class="comment-title">{{ draw.review.author.name }}</h4>
                        <span class="post-date">September 27, 2018</span>
                        <p>{{ draw.review.comment }}</p>
                        <ul class="item-rating">
                            <li v-for="index in parseInt(draw.review.rating)" :key="index" class="single-item star-fill"><i
                                    class="fas fa-star"></i></li>
                            <li v-for="index in (5 - draw.review.rating)" :key="index" class="single-item star-empty"><i
                                    class="fas fa-star"></i></li>
                            <li class="single-item"><span>{{ draw.review.rating }}<span> / 5</span></span> </li>
                        </ul>
                    </div>
                </div>
            </li>
        </ul>
</div></template>
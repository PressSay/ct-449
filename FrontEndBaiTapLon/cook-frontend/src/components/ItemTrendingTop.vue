<script>
import AccountService from '../services/account.service.js';
import CategoryService from '../services/category.service.js';

export default {
    props: {
        draw: { type: Object, required: true },
        backend: { type: String, required: true },
    },
    data() {
        return {
            recipe: this.draw.recipe,
            images: this.draw.images,
            category: {
                _id: this.draw.recipe._id_category,
                name: "",
            },
            author: {
                _id: this.draw.recipe._id_account,
                name: "",
            }
        };
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        recipeUrl: (_id) => {
            return "/recipes/" + _id;
        },
        recipeImgUrl: (images, backend) => {
            // alert("http://" + backend + images[0]['path'].slice(6));
            // alert(images != [])
            // alert(backend);
            return (images != []) ? "http://" + backend + images[0]['path'].slice(6) : "";
        },
        async retrieveAuthor() {
            try {
                const account = await AccountService.get(this.author._id);
                this.author.name = account.name;
                // console.log(this.author);
            } catch (error) {
                console.log(error);
            }
        },
        async retrieveCategory() {
            try {
                const genre = await CategoryService.get(this.category._id);
                this.category.name = genre.category.name;
                // console.log(this.category);
            } catch (error) {
                console.log(error);
            }
        },
        refresh() {
            this.retrieveAuthor();
            this.retrieveCategory();
        }
    },
    mounted() {
        this.refresh();
    }
}
</script>

<template>
    <div class="col-12">
        <div class="product-box-layout1">
            <figure class="item-figure"><a :href="recipeUrl(this.recipe._id)"><img
                        style="width: 912px; height: 551px;"
                        :src="recipeImgUrl(this.images ?? null, this.backend)" alt="image trending top"></a>
            </figure>
            <div class="item-content">
                <span class="sub-title" :v-model="this.category.name">{{ this.category.name }}</span>
                <h2 class="item-title"><a :href="recipeUrl(this.recipe._id)"
                    :v-model="this.recipe.name">{{ this.recipe.name }}</a></h2>
                <ul class="item-rating">
                    <li class="star-fill"><i class="fas fa-star"></i></li>
                    <li class="star-fill"><i class="fas fa-star"></i></li>
                    <li class="star-fill"><i class="fas fa-star"></i></li>
                    <li class="star-fill"><i class="fas fa-star"></i></li>
                    <li class="star-empty"><i class="fas fa-star"></i></li>
                    <li><span>9<span> / 10</span></span> </li>
                </ul>
                <p :v-model="this.recipe.short">{{ this.recipe.short }}</p>
                <ul class="entry-meta">
                    <li><a href="#"><i class="fas fa-clock"></i>15 Mins</a></li>
                    <li><a href="#"><i class="fas fa-user"></i>by <span :v-model="this.author.name">
                        {{ this.author.name}}</span></a></li>
                    <li><a href="#"><i class="fas fa-heart"></i><span :v-model="this.recipe.like">{{ this.recipe.like }}</span> Likes</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>
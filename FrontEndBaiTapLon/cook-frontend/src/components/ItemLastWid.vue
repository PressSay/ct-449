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
                this.category.name = genre.name;
                // this.console.log("genre", this.category);
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
    <li class="single-item">
        <div class="item-img">
            <a :href="recipeUrl(this.recipe._id)"><img :src="recipeImgUrl(this.images ?? null, this.backend)"
                    style="width: 107px; height: 107px;"
                    alt="Post"></a>
            <div class="count-number" :v-model="this.recipe.like">{{ this.recipe.like }}</div>
        </div>
        <div class="item-content">
            <div class="item-ctg" :v-model="this.category.name"> {{ this.category.name }}</div>
            <h4 class="item-title"><a href="#">Salami Oven Roasted are
                    Mozzarella Oelette</a></h4>
            <div class="item-post-by"><a :v-model="this.author.name"><i class="fas fa-user"></i><span>by</span> {{
                this.author.name }}</a></div>
        </div>
    </li>
</template>
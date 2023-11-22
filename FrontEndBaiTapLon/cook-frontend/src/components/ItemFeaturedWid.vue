<script>
import AccountService from '../services/account.service.js';
import CategoryService from '../services/category.service.js';

export default {
    props: {
        last: { type: Boolean, required: true },
        draw: { type: Object, required: true },
        backend: { type: String, required: true },
    },
    data() {
        return {
            recipe: this.draw.recipe,
            images: this.draw.images,
            category: {
                _id: this.draw.recipe._id_category,
                name: ""
            },
            author: {
                _id: this.draw.recipe._id_account,
                name: ""
            },
            isMounted: false,
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
            // return (this.images[0] != null) ? this.backend + this.images[0].slice(6) : "";
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
        refresh () {
            this.retrieveAuthor();
            this.retrieveCategory();
        }
    },
    watch: {
        isMounted() {
            this.$emit("isRenderF", this.isMounted && this.last);
        }
    },
    mounted() {
        this.refresh();
        this.isMounted = true;
        // this.console.log("backend", this.backend);
    }
}
</script>

<template>
    <div class="featured-box-layout1">
        <div class="item-img">
            <img :src="recipeImgUrl(this.images ?? null, this.backend)" alt="Brand" class="img-fluid">
        </div>
        <div class="item-content">
            <span class="ctg-name" :v-model="this.category.name">{{ this.category.name }}</span>
            <h4 class="item-title"><a :href="recipeUrl(this.recipe._id)" :v-model="this.recipe.name">{{ this.recipe.name }}</a></h4>
            <p :v-model="this.recipe.short">{{ this.recipe.short }}</p>
        </div>
    </div>
</template>
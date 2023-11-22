<script>
import Ingredient from './Ingredient.vue';
import SidebarFormR from './SidebarFormR.vue';
import Upload from './Upload.vue';
import Nutrition from './Nutrition.vue';
import CategoryField from './CategoryField.vue';
import InfoRecipe from './InfoRecipe.vue';
import TitleField from './TitleField.vue';
import { Form } from "vee-validate";
import RecipeService from '../services/recipe.service';
import CategoryService from '../services/category.service';
import AuthService from '../services/auth.service';

export default {
    components: {
        TitleField,
        Form,
        SidebarFormR,
        Ingredient,
        Upload,
        Nutrition,
        InfoRecipe,
        CategoryField
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    submit: "Recipe",
                    post: "Recipe",
                };
            }
        }
    },
    data() {
        const arrCategory = [
            {
                _id: 1,
                name: "Breakfast",
                description: "lorem ipsum",
            },
            {
                _id: 2,
                name: "Newest",
                description: "lorem ipsum",
            },
            {
                _id: 3,
                name: "Popular",
                description: "lorem ipsum",
            },
            {
                _id: 4,
                name: "Desserts",
                description: "lorem ipsum",
            }
        ];
        const arrImg = {};
        const arrIngredient = [
            {
                name: "",
                quantity: "",
            }
        ];
        const arrNutrition = [
            {
                name: "",
                unit: "",
            }
        ];
        const infoObj = {
            preparation: "45 minutes",
            cooking: "45 minutes",
            serving: "4",
            views: "100",
        };
        const obj = {
            description: {
                short: "",
                long: "",
            },
            title: ""
        }
        return {
            obj,
            arrImg,
            arrIngredient,
            arrNutrition,
            infoObj,
            arrCategory,
        };
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async retrieveGenre() {
            try {
                const draw = await CategoryService.getAllRecipe();
                this.arrCategory = draw.map((item) => {
                    return item.category;
                })
                // console.log("arrCategory", this.arrCategory);
            } catch (err) {
                // this.console.log(err);
            }
        },
        showData: async (data) => {
            const noteEdit = document.querySelector(".note-editable");
            const select2 = document.querySelector(".selection");
            const select = document.querySelector(".select2"); //get id
            const short = document.querySelector("#form-message");
            const files = document.querySelector("#upload").files;
            const token = window.localStorage.getItem("token") ?? "";

            try {
                AuthService.setToken(token);
                const auth = await AuthService.auth();
                const dataIntegrate = {
                    description: noteEdit.innerHTML,
                    short: short.value,
                    "images[]": files,
                    ingredient: data.arrIngredient,
                    nutrition: data.arrNutrition,
                    tprepare: data.infoObj.preparation,
                    tcook: data.infoObj.cooking,
                    ser: data.infoObj.serving,
                    view: data.infoObj.views,
                    name: data.obj.title,
                    category: select2.innerText,
                    _id_category: select.value,
                    _id_account: auth._id,
                };
                console.log(dataIntegrate);
                await RecipeService.create(dataIntegrate);
                alert("Đăng bài thành công");
            } catch (error) {
                alert("Đăng bài thất bại");
                console.log(error);
            }
        },
        submitRecipe: (data) => {

        }
    },
    mounted() {
        this.retrieveGenre();
    },
};
</script>


<template>
    <!-- Inne Page Banner Area Start Here -->
    <section class="inner-page-banner bg-common" data-bg-image="/src/assets/img/figure/single-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Submit a {{ value.submit }}</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>{{ value.post }} Post</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Submit Recipe Area Start Here -->
    <section class="submit-recipe-page-wrap padding-top-74 padding-bottom-50">
        <div class="container">
            <div class="row gutters-60">
                <div class="col-lg-8">
                    <Form class="submit-recipe-form">
                        <TitleField :value="this.obj" :field="'title'" :for-what="'Tên Công Thức'" />
                        <!-- #select2-filter-by-43-container -->
                        <CategoryField :arrCategory="this.arrCategory" />
                        <div class="form-group">
                            <textarea placeholder="Type your text" class="textarea form-control" name="message"
                                id="form-message" rows="7" cols="20" data-error="Message field is required"
                                required></textarea>
                            <div class="help-block with-errors"></div>
                        </div>
                        <Upload :arrImg="this.arrImg" />
                        <InfoRecipe v-if="value.submit == 'Recipe'" :value="this.infoObj" />
                        <Ingredient v-if="value.submit == 'Recipe'" :arrIngredient="this.arrIngredient" />
                        <Nutrition v-if="value.submit == 'Recipe'" :arrNutrition="this.arrNutrition" />
                        <!-- .note-editable -->
                        <div class="form-group">
                            <label>Mô Tả</label>
                            <div class="summernote"></div>
                        </div>
                        <div class="form-check d-flex align-items-center">
                            <input class="form-check-input align-self-center " name="slider" type="checkbox" value=""
                                id="is-slider">
                            <label class="form-check-label ml-3 d-block" for="is-slider">
                                Là Món Đặc Biệt
                            </label>
                        </div>
                        <div @click="showData({
                            'arrImg': this.arrImg,
                            'arrIngredient': this.arrIngredient,
                            'arrNutrition': this.arrNutrition,
                            'infoObj': this.infoObj,
                            'obj': this.obj
                        })" class="btn-submit">SUBMIT RECIPE</div>
                    </Form>
                </div>
                <SidebarFormR />
            </div>
        </div>
    </section>
</template>



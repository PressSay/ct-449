

<template>
    <!-- Inne Page Banner Area Start Here -->
    <section class="inner-page-banner bg-common" data-bg-image="/src/assets/img/figure/single-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Trang {{ value.submit }}</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Đăng {{ value.post }}</li>
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
                        <TitleField :value="this.obj" :for-what="'Tên Sản Phẩm'" :field="'title'"/>
                        <TitleField :value="this.obj" :for-what="'Giá'" :field="'price'"/>
                        <TitleField :value="this.obj" :for-what="'Sku'" :field="'sku'"/>
                        <!-- #select2-filter-by-43-container -->
                        <CategoryField :arrCategory="this.arrCategory" />
                        <div class="form-group">
                            <label>Tính Năng</label>
                            <textarea placeholder="Type your text" class="textarea form-control" name="message"
                                id="form-message" rows="7" cols="20" data-error="Message field is required"
                                required></textarea>
                            <div class="help-block with-errors"></div>
                        </div>
                        <Upload :arrImg="this.arrImg" />
                        <!-- .note-editable -->
                        <div class="form-group">
                            <label>Mô Tả</label>
                            <div class="summernote"></div>
                        </div>
                        <div class="form-check d-flex align-items-center">
                            <input class="form-check-input align-self-center " name="slider" type="checkbox" value="" id="is-slider">
                            <label class="form-check-label ml-3 d-block" for="is-slider">
                                Đứng Top
                            </label>
                        </div>
                        <div @click="showData({
                            'arrImg': this.arrImg,
                            'obj': this.obj
                        })" class="btn-submit">Đăng</div>
                    </Form>
                </div>
                <SidebarFormR />
            </div>
        </div>
    </section>
</template>


<script>
import Ingredient from './Ingredient.vue';
import SidebarFormR from './SidebarFormR.vue';
import Upload from './Upload.vue';
import Nutrition from './Nutrition.vue';
import CategoryField from './CategoryField.vue';
import InfoRecipe from './InfoRecipe.vue';
import TitleField from './TitleField.vue';
import { Field, Form } from "vee-validate";
import CategoryService from '../services/category.service';
import ProductService from '../services/product.service';

export default {
    components: {
        TitleField,
        Form,
        SidebarFormR,
        Ingredient,
        Upload,
        Nutrition,
        InfoRecipe,
        CategoryField,
        Field
    },
    props: {
        value: {
            type: Object,
            default: () => {
                return {
                    submit: "Sản Phẩm",
                    post: "Sản Phẩm",
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

        const obj = {
            description: {
                short: "",
                long: "",
            },
            title: "",
            price: "",
            sku: ""
        }
        return {
            obj,
            arrImg,
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
                const draw = await CategoryService.getAllProduct();
                this.arrCategory = draw.map((item) => {
                    return item.category;
                })
                // console.log("arrCategory", this.arrCategory);
            } catch (err) {
                this.console.log(err);
            }
        },
        showData: async (data) => {
            const noteEdit = document.querySelector(".note-editable");
            const select2 = document.querySelector(".selection"); //get name
            const select = document.querySelector(".select2"); //get id
            const short = document.querySelector("#form-message");
            const slider = document.querySelector("#is-slider");
            const files = document.querySelector("#upload").files;

            const dataIntegrate = {
                "images[]": files,
                "feature": short.value,
                "description": noteEdit.innerHTML,
                "name": data.obj.title,
                "quantity": 60,
                "price": data.obj.price,
                "sku": data.obj.sku,
                "rated": slider.checked,
                "_id_category": select.value,
                "category": select2.innerText,
            };

            console.log(dataIntegrate);
            try {
                await ProductService.create(dataIntegrate);
                alert("tạo thành công");
                window.location.href = "/submit-product";
            } catch (error) {
                alert("tạo thất bại");
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

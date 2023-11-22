<script>
import ProductService from "../services/product.service";
import RecipeService from "../services/recipe.service";

export default {
    data() {
        return {
            arrRecipe: [],
            arrProduct: [],
            nameP: "",
            nameR: "",
            backend: "localhost:3000"
        };
    },
    computed: {
        window: () => window,
        console: () => console
    },
    methods: {
        async getAllR() {
            const urlParams = new URLSearchParams(this.window.location.search);
            const nameSearch = urlParams.get('nameR') ?? "";
            this.console.log(nameSearch);
            try {
                this.arrRecipe = (nameSearch != "") ?
                    await RecipeService.getRecipeByName(nameSearch) : await RecipeService.getAll();
                this.console.log(this.arrRecipe);
            } catch (err) {
                this.console.log(err);
            }

        },
        async getAllP() {
            const urlParams = new URLSearchParams(this.window.location.search);
            const nameSearch = urlParams.get('nameP') ?? "";
            this.console.log(nameSearch);
            try {
                this.arrProduct = (nameSearch != "") ?
                    await ProductService.getProductByName(nameSearch) : await ProductService.getAll();
                this.console.log(this.arrProduct);
            } catch (err) {
                this.console.log(err);
            }
        },
        async removeR(id) {
            try {
                await RecipeService.delete(id);
                alert("thanh cong");
                this.getAllR();
            } catch (err) {
                this.console.log(err);
            }
        },
        async removeP(id) {
            try {
                await ProductService.delete(id);
                alert("thanh cong");
                this.getAllP();
            } catch (err) {
                this.console.log(err);
            }
        },
        async searchR() {
            const urlParams = new URLSearchParams(this.window.location.search);
            const nameSearch = urlParams.get('nameP') ?? "";
            this.nameP = nameSearch;
            const searchText = this.$refs.searchRT.value;
            this.nameR = searchText;
            this.window.location.href =
                "/dashboard?nameP=" + this.nameP + "&nameR=" + this.nameR;
        },
        async searchP() {
            const urlParams = new URLSearchParams(this.window.location.search);
            const nameSearch = urlParams.get('nameR') ?? "";
            this.nameR = nameSearch;
            const searchText = this.$refs.searchPT.value;
            this.nameP = searchText;
            this.window.location.href =
                "/dashboard?nameP=" + this.nameP + "&nameR=" + this.nameR;
        },
    },
    mounted() {
        this.getAllR();
        this.getAllP();
    }
};
</script>

<template>
    <div class="container-fluid" style="margin-top: 10rem">
        <div class="search mb-4 ">
            <i class="fa fa-search"></i>
            <input type="text" name="searchRecipe" ref="searchRT" class="form-control" placeholder="Have a question? Ask Now">
            <button @click="searchR()" class="btn btn-primary">Search Recipe</button>
        </div>
        <!-- DataTales Example -->
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Recipe table</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Mô Tả</th>
                                <th>Time</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Tên</th>
                                <th>Mô Tả</th>
                                <th>Time</th>
                                <th></th>
                            </tr>
                        </tfoot>
                        <tbody>
                            <tr v-for="recipe in this.arrRecipe">
                                <td>{{ recipe.recipe.name }}</td>
                                <td>{{ recipe.recipe.short }}</td>
                                <td>{{ recipe.recipe.time }}</td>
                                <td class="text-center">
                                    <svg @click="removeR(recipe.recipe._id)" style="cursor: pointer;" width="22" height="24" viewBox="0 0 18 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.84062 20C2.37656 20 1.9793 19.8368 1.64883 19.5104C1.31836 19.184 1.15312 18.7917 1.15312 18.3333V2.5H0V0.833333H5.2875V0H12.7125V0.833333H18V2.5H16.8469V18.3333C16.8469 18.7778 16.6781 19.1667 16.3406 19.5C16.0031 19.8333 15.6094 20 15.1594 20H2.84062ZM15.1594 2.5H2.84062V18.3333H15.1594V2.5ZM5.82187 15.9444H7.50937V4.86111H5.82187V15.9444ZM10.4906 15.9444H12.1781V4.86111H10.4906V15.9444Z"
                                            fill="#BA1A1A" />
                                    </svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="search mb-4">
            <i class="fa fa-search"></i>
            <input type="text" name="searchProduct" ref="searchPT" class="form-control" placeholder="Have a question? Ask Now">
            <button @click="searchP()" class="btn btn-primary">Search Product</button>
        </div>
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Product table</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Mô Tả</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th>Tên</th>
                                <th>Giá</th>
                                <th>Mô Tả</th>
                                <th></th>
                            </tr>
                        </tfoot>
                        <tbody>
                            <tr v-for="draw in this.arrProduct">
                                <td>{{ draw.product.name }}</td>
                                <td>{{ draw.product.price }}</td>
                                <td>{{ draw.product.description }}</td>
                                <td class="text-center pe">
                                    <svg @click="removeP(draw.product._id)" style="cursor: pointer;" width="22" height="24" viewBox="0 0 18 20" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M2.84062 20C2.37656 20 1.9793 19.8368 1.64883 19.5104C1.31836 19.184 1.15312 18.7917 1.15312 18.3333V2.5H0V0.833333H5.2875V0H12.7125V0.833333H18V2.5H16.8469V18.3333C16.8469 18.7778 16.6781 19.1667 16.3406 19.5C16.0031 19.8333 15.6094 20 15.1594 20H2.84062ZM15.1594 2.5H2.84062V18.3333H15.1594V2.5ZM5.82187 15.9444H7.50937V4.86111H5.82187V15.9444ZM10.4906 15.9444H12.1781V4.86111H10.4906V15.9444Z"
                                            fill="#BA1A1A" />
                                    </svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

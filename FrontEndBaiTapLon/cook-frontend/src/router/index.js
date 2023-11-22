import { createWebHistory, createRouter } from "vue-router";
import Home from '../views/Home.vue';
import SubmitRecipe from '../views/SubmitRecipe.vue';
import SubmitProduct from '../views/SubmitProduct.vue';
import Register from '../views/Register.vue';
import RecipeCategory from '../views/RecipeCategory.vue';
import ProductCategory from '../views/ProductCategory.vue';
import RecipeDetail from '../views/RecipeDetail.vue';
import Recipe from '../views/Recipe.vue';
import ShopProduct from '../views/ShopProduct.vue';
import ProductDetail from '../views/ProductDetail.vue';
import NotFound from '../views/NotFound.vue';
import Cart from '../views/Cart.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
    {
        path: "/",
        name: "home",
        component: Home,
    },
    {
        path: "/submit-recipe",
        name: "submit-recipe",
        component: SubmitRecipe
    },
    {
        path: "/submit-product",
        name: "submit-product",
        component: SubmitProduct
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
        path: "/categories/recipe",
        name: "categories-recipe",
        component: RecipeCategory
    },
    {
        path: "/categories/product",
        name: "categories-product",
        component: ProductCategory
    },
    {
        path: "/categories/:id/recipes",
        name: "categories-recipes-detail",
        component: Recipe
    },
    {
        path: "/categories/:id/products",
        name: "categories-products-detail",
        component: ShopProduct
    },
    {
        path: "/recipes",
        name: "recipes",
        component: Recipe
    },
    {
        path: "/products",
        name: "products",
        component: ShopProduct
    },
    {
        path: "/recipes/:id",
        name: "recipe-detail",
        component: RecipeDetail,
    },
    {
        path: "/products/:id",
        name: "product-detail",
        component: ProductDetail,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: NotFound,
    },
    {
        path: "/cart",
        name: "cart",
        component: Cart,
    },
    {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard
    }
    // {
    //     path: "/contacts/:id",
    //     name: "contact.edit",
    //     component: () => import("@/views/ContactEdit.vue"),
    //     props: true // Truyền các biến trong $route.params vào làm props
    // },
    // {
    //     path: "/contacts/add",
    //     name: "contact.add",
    //     component: () => import("@/views/ContactAdd.vue"),
    // }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
<script>
import HeaderMajor from './HeaderMajor.vue';
import HeaderMinor from './HeaderMinor.vue';
import CartService from '../services/cart.service.js';
import AuthService from '../services/auth.service.js';

export default {
    components: {
        HeaderMajor,
        HeaderMinor,
    },
    data() {
        return {
            user: {
                token: "",
                name: "",
                email: "",
            },
            cartDetail: [],
            id_cart: ""
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async getUser() {
            const token = this.window.localStorage.getItem("token") ?? "";
            // this.console.log("token", token);
            try {
                AuthService.setToken(token);
                const auth = await AuthService.auth();
                this.user.token = token;
                this.user.name = auth.name;
                this.user.email = auth.email;
                // this.console.log("appheader", this.user.token);
                // this.console.log(auth);
            } catch (err) {
                window.localStorage.setItem("token", "");
                window.localStorage.setItem("_id_cart", "");
                this.console.log("token no login!!", err);
            }
        },
        async getCurCartD() {
            const _id_cart = this.window.localStorage.getItem("_id_cart") ?? "";
            const cart = await CartService.get(_id_cart);
            if (cart) {
                this.id_cart = cart._id;
                this.cartDetail = cart.cartDetail;
            }
        }
    },
    mounted() {
        this.getUser();
        this.getCurCartD();
    },
}

</script>

<template>
    <header class="header-one">
        <HeaderMajor :id_cart="this.id_cart" :user="this.user" :cartD="this.cartDetail"/>
        <HeaderMinor :id_cart="this.id_cart" :user="this.user" :cartD="this.cartDetail" />
    </header>
</template>
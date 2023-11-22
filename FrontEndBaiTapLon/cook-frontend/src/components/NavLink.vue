<script>
import AuthService from "../services/auth.service";

export default {
    data() {
        return {
            user: null,
        }
    },
    computed: {
        console() {
            return console;
        },
        window() {
            return window;
        },
    },
    methods: {
        async getUser() {
            const token = this.window.localStorage.getItem("token") ?? "";
            // this.console.log("token", token);
            try {
                AuthService.setToken(token);
                const draw = await AuthService.auth();
                const auth = {
                    _id: draw._id,
                    name: draw.name,
                    email: draw.email,
                    token: token,
                }
                this.user = auth;
                // this.console.log(this.user.token);
                // this.console.log(auth);
            } catch (err) {
                this.user = null;
                this.console.log("no Login!!", err);
            }
        },
    },
    mounted() {
        this.getUser();
    },
}
</script>

<template>
    <nav class="site-nav">
        <ul id="site-menu" class="site-menu">
            <li>
                <a href="/">Home</a>
            </li>
            <!-- <li>
                <a href="/categories">Danh Mục</a>
            </li> -->

            <li>
                <a>Danh Mục</a>
                <ul class="dropdown-menu-col-1">
                    <li>
                        <a href="/categories/product">Sản Phẩm</a>
                    </li>
                    <li>
                        <a href="/categories/recipe">Công Thức</a>
                    </li>
                </ul>
            </li>
            <li>
                <a href="/dashboard">dashboard</a>
            </li>
            <li v-if="user" class="possition-static hide-on-mobile-menu">
                <a href="/cart">Giỏ Hàng</a>
            </li>
            <li v-if="user" class="hide-on-desktop-menu">
                <a href="/cart">Giỏ Hàng</a>
            </li>
            <li>
                <a href="/submit-product">Đăng SP</a>
            </li>

            <li class="hide-on-desktop-menu">
                <a href="#search" title="Search" class="search-button d-flex align-items-center">
                    <div class="mr-3">Tìm Kiếm</div>
                    <i class="flaticon-search"></i>
                </a>
            </li>
        </ul>
    </nav>
</template>
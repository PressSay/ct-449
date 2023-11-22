
<script>
import Cart from './Cart.vue';
import NavLink from './NavLink.vue';
export default {
    props: {
        user: {
            type: Object,
            default: {
                token: "",
                name: "",
                email: "",
            }
        },
        cartD: {
            type: Array,
            default: []
        },
        id_cart: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            user: this.user
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    components: {
        Cart,
        NavLink
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        logout() {
            try {
                this.window.localStorage.removeItem("token");
                this.window.location.reload();
            } catch (err) {
                this.console.log("can't logout", err);
            }
        }
    }
};
</script>

<template>
    <div id="header-main-menu" class="header-main-menu header-sticky">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-md-3 col-sm-4 col-6 possition-static">
                    <div class="site-logo-mobile">
                        <a href="/" class="sticky-logo-light"><img src="/src/assets/img/logo-light.png" alt="Site Logo"></a>
                        <a href="/" class="sticky-logo-dark"><img src="/src/assets/img/logo-dark.png" alt="Site Logo"></a>
                    </div>
                    <NavLink />
                </div>
                <div class="col-lg-4 col-md-9 col-sm-8 col-6 d-flex align-items-center justify-content-end">
                    <div class="nav-action-elements-layout1">
                        <ul>
                            <li>
                                <Cart v-if="this.user.name != ''" :moblie="true" :arrCartD="this.cartD" />
                            </li>
                            <li v-if="this.user.name == ''">
                                <button type="button" class="login-btn d-flex justify-content-center align-items-center"
                                    data-toggle="modal" data-target="#myModal">
                                    <i class="flaticon-profile"></i>
                                    <div class="fs-6 text-wrap d-flex justify-content-center align-items-center"
                                        style="font-size: 0.85em; width: 6rem;">Đăng nhập
                                    </div>
                                </button>
                            </li>
                            <li v-if="this.user.name != ''">
                                <div class="dropdown">
                                    <button
                                        class=" dropdown-toggle login-btn d-flex justify-content-center align-items-center"
                                        type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                        <i class="flaticon-profile"></i>
                                        <div class="fs-6 text-wrap d-flex justify-content-center align-items-center"
                                            style="font-size: 0.85em; width: 6rem; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                                            {{ user.name }}
                                        </div>
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a class="dropdown-item" href="/profile">Thông tin cá nhân</a>
                                        <a class="dropdown-item" @click="logout()">Đăng xuất</a>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <a href="/submit-recipe" class="fill-btn"><i class="flaticon-plus-1"></i>Đăng Recipe</a>
                            </li>
                        </ul>
                    </div>
                    <div class="mob-menu-open toggle-menu">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </div>
                </div>
            </div>
        </div>
</div></template>
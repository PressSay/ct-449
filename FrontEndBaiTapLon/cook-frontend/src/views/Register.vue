<script>
import AccountService from '../services/account.service';

export default {
    data() {
        return {
            user: {
                email: "",
                password: "",
                phone: "",
                name: "",
            }
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async register() {
            this.console.log("register", this.user);
            try {
                const auth = await AccountService.create(this.user);
                window.localStorage.setItem("token", auth.token);
                this.user.email = auth.email;
                this.user.name = auth.name;
                this.user.phone = auth.phone;
                this.user.password = "";
                this.window.location.href = "/";
            } catch (err) {
                this.console.log("can't register", err)
            }
        }
    }
};

</script>

<template>
    <section class="inner-page-banner bg-common" data-bg-image="/src/assets/img/figure/inner-page-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Trang Đăng Ký</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Đăng Ký</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Inne Page Banner Area End Here -->
    <!-- Login Area Start Here -->
    <section class="login-page-wrap padding-top-80 padding-bottom-50">
        <div class="container">
            <div class="row gutters-60">
                <div class="col-lg-8">
                    <div class="login-box-layout1">
                        <div class="section-heading heading-dark">
                            <h2 class="item-heading">Đăng Ký</h2>
                        </div>
                        <form class="login-form">
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="mb-3">Email</label>
                                    <input class="main-input-box" type="text" placeholder="example@example.com" v-model="this.user.email" />
                                </div>
                                <div class="col-md-6">
                                    <label class="mb-3">Password</label>
                                    <input class="main-input-box" type="password" placeholder="" v-model="this.user.password" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <label class="mb-3">Phone</label>
                                    <input class="main-input-box" type="text" placeholder="0343861387" v-model="this.user.phone" />
                                </div>
                                <div class="col-md-6">
                                    <label class="mb-3">Name</label>
                                    <input class="main-input-box" type="text" placeholder="" v-model="this.user.name" />
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="checkbox checkbox-primary">
                                        <input id="checkbox1" type="checkbox">
                                        <label for="checkbox1">Remember Me</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <label class="lost-password"><a href="#">Quên mật khẩu?</a></label>
                                </div>
                            </div>
                            <div class="btn-area">
                                <div class="btn-fill btn-primary" value="Login" @click="register()">Đăng Ký<i
                                        class="flaticon-next"></i></div>
                            </div>
                        </form>
                        <label>kết nối với mạng xã hội</label>
                        <div class="login-box-social">
                            <ul>
                                <li><a href="#" class="facebook"><i class="fab fa-facebook-f"></i></a></li>
                                <li><a href="#" class="twitter"><i class="fab fa-twitter"></i></a></li>
                                <li><a href="#" class="linkedin"><i class="fab fa-linkedin-in"></i></a></li>
                                <li><a href="#" class="google"><i class="fab fa-google-plus-g"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 sidebar-widget-area sidebar-break-md">
                    <div class="widget">
                        <div class="section-heading heading-dark">
                            <h3 class="item-heading">ABOUT ME</h3>
                        </div>
                        <div class="widget-about">
                            <figure class="author-figure"><img src="/src/assets/img/figure/about.jpg" alt="about"></figure>
                            <!-- <figure class="author-signature"><img src="/src/assets/img/figure/signature.png" alt="about"></figure> -->
                            <h3 class="author-name">Lam Phu Qui</h3>
                            <p>Web Cho "Phat Trien Ung Dung Web"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
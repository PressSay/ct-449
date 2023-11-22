<script>
import AuthService from '../services/auth.service';

export default {
    data() {
        return {
            email: "",
            password: "",
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async login() {
            this.console.log("email", this.email, "password", this.password);
            try {
                const auth = {
                    email: this.email,
                    password: this.password,
                };
                console.log(auth);
                
                const user = await AuthService.login(auth);
                this.window.localStorage.setItem("token", user.token);
                this.window.location.reload();
            } catch (err) {
                this.console.log("can't login", err);
            }
        }
    }/* ,
    watch: {
        email() {
            this.console.log(this.email);
        },
        password() {
            this.console.log(this.password);
        }
    } */
}
</script>

<template>
    <div class="modal fade" id="myModal" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="title-default-bold mb-none">Đăng nhập</div>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="login-form">
                        <input class="main-input-box" type="text" placeholder="Tài khoản" v-model="this.email" />
                        <input class="main-input-box" type="password" placeholder="Mật khẩu" v-model="this.password" />
                        <div class="inline-box mb-5 mt-4">
                            <div class="checkbox checkbox-primary">
                                <input id="modal-checkbox" type="checkbox">
                                <label for="modal-checkbox">Remember Me</label>
                            </div>
                            <label class="lost-password"><a href="#">Quên mật khẩu?</a></label>
                        </div>
                        <div class="inline-box mb-5 mt-4">
                            <button class="btn-fill" @click="login()" value="Login">Đăng nhập</button>
                            <a href="/register" class="btn-register"><i class="fas fa-user"></i>Đăng ký!!</a>
                        </div>
                    </div>
                    <label>Đăng nhập kết nối với Mạng xã hội của bạn</label>
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
        </div>
    </div>
</template>
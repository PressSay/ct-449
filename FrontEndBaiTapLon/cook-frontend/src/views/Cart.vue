<script>
import CartService from '../services/cart.service';
import AuthService from '../services/auth.service';

export default {
    data() {
        return {
            arrCart: [],
            user: null,
            backend: "localhost:3000"
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    methods: {
        async createCart() {
            if (this.user) {
                const cart = {
                    _id_account: this.user._id,
                    paid: "normal"
                }
                await CartService.create(cart);
                alert("Tạo giỏ hàng thành công");
                this.retrieveCart();
            }/*  else {
                this.$router.push('/register');
            } */

        },
        choiceCart(cart) {
            if (cart.paid === "paid") {
                alert("Giỏ hàng đã thanh toán, không thể chọn");
                return;
            }
            this.window.localStorage.setItem('_id_cart', cart._id);
            alert("Chọn giỏ hàng thành công, giỏ hiện tại là: " + cart._id.toString());
        },
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
                // this.console.log("no Login!!", err);
            }
        },
        async retrieveCart() {
            try {
                if (this.user) {
                    this.arrCart = await CartService.getAll(this.user._id, "");
                    // this.console.log(this.arrCart);
                }
            } catch (error) {
                console.log(error);
            }
        },
        async updateCartDetail(_id_cart, cartD, operation) {
            let quantity = cartD.quantity;
            if (operation === '+') {
                quantity++;
            } else if (operation === '-') {
                quantity--;
            } else if (operation === '0') {
                quantity = "0";
            }
            const data = {
                _id_product: cartD.product._id,
                quantity: quantity
            }
            await CartService.update(_id_cart, data);
            this.retrieveCart();
            // this.console.log(data);
        },
        async updateCart(cart) {
            const data = {
                _id_product: "-1",
                quantity: -1,
                paid: "paid"
            }
            if (cart.cartDetail.length === 0) {
                alert("Giỏ hàng trống, không thể thanh toán");
                return;
            }
            await CartService.update(cart._id, data);
            this.retrieveCart();
            alert("Thanh toán thành công");
            // this.console.log(cart);
            this.window.localStorage.removeItem('_id_cart');
        },
    },
    watch: {
        user: function () {
            if (this.user)
                this.retrieveCart();
        }
    },
    mounted() {
        this.getUser();
    }
}
</script>

<template>
    <section class="inner-page-banner bg-common mb-5" data-bg-image="img/figure/inner-page-banner1.jpg">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs-area">
                        <h1>Trang Giỏ Hàng</h1>
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li>Giỏ Hàng</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="container mt-10 mb-5">
        <div v-for="draw in arrCart" class="mb-5">
            <div class="d-flex justify-content-center align-items-center">
                <div  class="text-center d-flex align-items-center mr-3 " style="font-size: 1.8rem;">status: <span class="text-danger">{{ draw.paid }}</span></div>
                <button v-if="draw.paid != 'paid'" @click="choiceCart(draw)" class="btn btn-outline-warning btn-sm mr-3" type="button">Use</button>
                <div class="text-center d-flex align-items-center" style="font-size: 1.8rem;">_id_cart: {{ draw._id }}</div>
            </div>
            <div class="d-flex justify-content-center row mb-5">
                <div class="col-md-8">
                    <div v-for="subdraw in draw.cartDetail" class="d-flex flex-row justify-content-between align-items-center p-2 bg-white mt-4 px-3 rounded">
                        <div class="mr-1"><img class="rounded" :src="'http://' + this.backend + subdraw.product.fimage.path.slice(6)" width="70"></div>
                        <div class="d-flex flex-column align-items-center product-details"><span
                                class="font-weight-bold">{{ subdraw.product.name }}</span>
                            <div class="d-flex flex-row product-desc">
                                <div class="size mr-1"><span class="text-grey">Sku:</span><span
                                        class="font-weight-bold">&nbsp;{{ subdraw.product.sku }}</span></div>
                            </div>
                        </div>
                        <div class="d-flex flex-row align-items-center qty"><i v-if="draw.paid != 'paid'" @click="updateCartDetail(draw._id, subdraw, '-')" class="fa fa-minus text-danger"></i>
                            <h5 class="text-grey mt-1 mr-1 ml-1" style="font-size: 1.4rem;">{{ subdraw.quantity }}</h5><i v-if="draw.paid != 'paid'" @click="updateCartDetail(draw._id, subdraw, '+')"
                                class="fa fa-plus text-success"></i>
                        </div>
                        <div>
                            <h5 class="text-grey" style="font-size: 1.4rem;">{{ subdraw.product.price }} đ</h5>
                        </div>
                        <div v-if="draw.paid != 'paid'" @click="updateCartDetail(draw._id, subdraw, '0')" class="d-flex align-items-center"><i class="fa fa-trash mb-1 text-danger"></i></div>
                    </div>
                    

                    <!-- <div class="d-flex flex-row align-items-center mt-3 p-2 bg-white rounded"><input type="text"
                            class="form-control border-0 gift-card" placeholder="discount code/gift card"><button
                            class="btn btn-outline-warning btn-sm ml-2" type="button">Apply</button></div> -->
                    <div v-if="draw.paid != 'paid'" class="d-flex flex-row align-items-center mt-3 p-2 bg-white rounded"><button @click="updateCart(draw)"
                            class="btn btn-warning btn-block btn-lg ml-2 pay-button" type="button">Thanh Toán</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-flex flex-row align-items-center justify-content-center mt-3 p-2 bg-white rounded">
            <button @click="this.createCart()" class="btn btn-warning btn-block btn-lg ml-2 pay-button" style="max-width: 30rem;" type="button">Tạo Giỏ
                Hàng</button>
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200&display=swap');

.size span {
    font-size: 11px;
}

.color span {
    font-size: 11px;
}

.product-deta {
    margin-right: 70px;
}

.gift-card:focus {
    box-shadow: none;
}

.pay-button {
    color: #fff;
}

.pay-button:hover {
    color: #fff;
}

.pay-button:focus {
    color: #fff;
    box-shadow: none;
}

.text-grey {
    color: #a39f9f;
}

.qty i {
    font-size: 11px;
}
</style>
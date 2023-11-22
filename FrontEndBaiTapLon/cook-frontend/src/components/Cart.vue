<script>
import ItemCart from './ItemCart.vue';
import CartService from '../services/cart.service.js';

export default {
    props: {
        moblie: {
            type: Boolean,
            required: true
        },
        arrCartD: {
            type: Array,
            required: true
        },
        id_cart: {
            type: String,
            required: true
        }
    },
    computed: {
        console: () => console,
        window: () => window,
    },
    components: {
        ItemCart
    },
    methods: {
        classMobile(moblie) {
            return (moblie) ? "cart-wrap cart-on-mobile d-lg-none" : "cart-wrap";
        },
        totalMoney(arrCartD) {
            let total = 0;
            for (let k in arrCartD) {
                total += parseInt(arrCartD[k].product.price) * parseInt(arrCartD[k].quantity);
            }
            return total;
        },
        async updateCartD(data) {
            // console.log("updateCartD", data);
            const dataL = {
                _id_product: data._id_product,
                quantity: "0"
            };
            this.arrCartD.splice(data.index, 1);
            await CartService.update(data._id_cart, dataL)
        }
    },
    mounted() {
        // console.log("cart", this.arrCartD);
    }
};
</script>

<template>
    <!-- remove "cart-on-mobile d-lg-none" if "header-minor" -->
    <div :class="classMobile(this.moblie)" >
        <div class="cart-info">
            <i class="flaticon-shopping-bag"></i>
            <div class="cart-amount" style="width: 6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">{{ this.totalMoney(this.arrCartD) }} <span class="item-currency">đ</span></div>
        </div>

        <div class="cart-items">
            <div class="cart-info">
                <i class="flaticon-shopping-bag"></i>
                <div class="cart-amount" style="width: 6rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">{{ this.totalMoney(this.arrCartD) }} <span class="item-currency">đ</span></div>
            </div>
            <ItemCart v-for="index in this.arrCartD.length" :draw="this.arrCartD[index-1]" :index="index-1" :id_cart="id_cart" @updateCartD="updateCartD($event)"/>
            <div class="cart-item">
                <div class="cart-btn">
                    <a href="#" class="item-btn">View Cart</a>
                </div>
            </div>
        </div>
    </div>
</template>
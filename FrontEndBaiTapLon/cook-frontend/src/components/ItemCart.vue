<script>


export default {
    props: {
        draw: {
            type: Object,
            required: true
        },
        id_cart: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return { backend: "localhost:3000" };
    },
    methods: {
        updateCartD(_id_cart, draw) {
            const data = {
                _id_cart: _id_cart,
                _id_product: draw.product._id,
                index: this.index
            };
            this.$emit("updateCartD", data);
        },
    }
};
</script>

<template>
    <div class="cart-item">
        <div class="cart-img">
            <a href="#">
                <img style="width: 90px; height: 90px;" :src="'http://'+this.backend+this.draw.product.fimage.path.slice(6)" alt="product" class="img-fluid">
            </a>
        </div>
        <div class="cart-title">
            <a href="#">{{ this.draw.product.name }}</a>
            <span>sku: {{ this.draw.product.sku }}</span>
        </div>
        <div class="cart-quantity">X {{ this.draw.quantity }}</div>
        <div class="cart-price">{{ this.draw.product.price }}</div>
        <div class="cart-trash" @click="updateCartD(this.id_cart, this.draw)">
            <a href="#">
                <i class="far fa-trash-alt"></i>
            </a>
        </div>
    </div>

</template>
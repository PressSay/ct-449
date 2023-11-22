import { ObjectId } from "mongodb";

class CartService {
    constructor(client) {
        this.Cart = client.db().collection("carts");
        this.CarDetail = client.db().collection("cartDetail");
        this.Product = client.db().collection("products");
        this.ProductImage = client.db().collection("productImage");
        this.Image = client.db().collection("images");
        this.Account = client.db().collection("accounts");
    }

    extractCartData(payload) {
        const cart = {
            _id_account: payload._id_account,
            paid: payload.paid,
        };

        Object.keys(cart).forEach(
            (key) => cart[key] === undefined && delete cart[key]
        );
        return cart;
    }

    // extractCartDetailData(payload, _id_cart) {
    //     const cartDetail = {
    //         _id_cart: _id_cart,
    //         _id_product: 
    //     };
    // }

    async create(payload) {
        const cart = this.extractCartData(payload);
        const account = await this.Account.findOne({
            _id: ObjectId.isValid(cart._id_account) ? new ObjectId(cart._id_account) : null,
        });
        if (!account) {
            cart = {};
        }
        const result = await this.Cart.insertOne(cart);
        return result;
    }

    async find(filter) {
        const cursor = await this.Cart.find(filter);
        const arrCart = await cursor.toArray();
        for (let k in arrCart) {
            const cartDetail = await this.CarDetail.find({ _id_cart: arrCart[k]._id });
            arrCart[k].cartDetail = await cartDetail.toArray();
            for (let i in arrCart[k].cartDetail) {
                const product = await this.Product.findOne({ _id: arrCart[k].cartDetail[i]._id_product });
                const ProductImage = await this.ProductImage.findOne({
                    "_id_product": product._id
                });
                product.fimage = await this.Image.findOne({ _id: ProductImage._id_image });
                arrCart[k].cartDetail[i].product = product;
            }
        }

        return arrCart;

    }

    async findById(id) {
        const cart = await this.Cart.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        const cartDetail = await this.CarDetail.find({ _id_cart: cart._id });
        cart.cartDetail = await cartDetail.toArray();
        for (let i in cart.cartDetail) {
            const product = await this.Product.findOne({ _id: cart.cartDetail[i]._id_product });
            const ProductImage = await this.ProductImage.findOne({
                "_id_product": product._id
            });
            product.fimage = await this.Image.findOne({ _id: ProductImage._id_image });
            cart.cartDetail[i].product = product;
        }
        return cart;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const _id_product = ObjectId.isValid(payload._id_product) ? new ObjectId(payload._id_product) : null;

        const cartDetailExist = await this.CarDetail.findOne({ _id_cart: filter._id, _id_product: _id_product });
        if (cartDetailExist) {
            if (payload.quantity <= 0) {
                this.CarDetail.findOneAndDelete({ _id_cart: filter._id, _id_product: _id_product });
            } else if (payload.quantity > 0) {
                this.CarDetail.findOneAndUpdate(
                    { _id_cart: filter._id, _id_product: _id_product },
                    { $set: { quantity: payload.quantity } },
                    { returnDocument: "after" }
                );
            }
        } else if (payload.quantity > 0 && payload._id_product != "-1") {
            const data = {
                _id_cart: filter._id,
                _id_product: _id_product,
                quantity: payload.quantity
            };
            this.CarDetail.insertOne(data);
        }

        console.log(filter);

        if (payload.paid) {
            this.Cart.findOneAndUpdate(
                filter,
                { $set: { paid: payload.paid } },
                { returnDocument: "after" }
            );
        }
        return await this.findById(id);
    }

    async delete(id) {
        const result = await this.Cart.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Cart.deleteMany({});
        return result;
    }

}

export default CartService;
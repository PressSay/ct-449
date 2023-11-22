import { ObjectId } from "mongodb";
import fs from "node:fs";
import path from "node:path";

class ProductService {
    constructor(client) {
        this.Product = client.db().collection("products");
        this.ProductImage = client.db().collection("productImage");
        this.Image = client.db().collection("images");
        this.ProductReview = client.db().collection("productReview");
        this.Review = client.db().collection("reviews");
        this.Category = client.db().collection("categories");
    }

    extractImageData(path) {
        const image = {
            path: path,
            favorite: false
        };

        return image;
    }

    extractProductImageData(_id_image, _id_product) {
        const productImage = {
            _id_product: ObjectId.isValid(_id_product) ? new ObjectId(_id_product) : null,
            _id_image: ObjectId.isValid(_id_image) ? new ObjectId(_id_image) : null,
        };

        return productImage;
    }

    extractProductData(payload) {
        const product = {
            name: payload.name,
            price: payload.price,
            description: payload.description,
            feature: payload.feature,
            _id_category: payload._id_category,
            favorite: payload.favorite, // (popular)
            chosen: payload.chosen ?? false,
            trending: payload.trending ?? false,
            slider: payload.slider ?? false,
            sku: payload.sku,
            new: payload.new ?? false,
            rated: payload.rated ?? false,
            top: payload.top ?? false,
        };

        product.sold = (payload.sold != null) ? payload.sold : 0;

        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );
        return product;
    }

    async extraProductInfo(product) {
        const arrImagePath = [];
        const docProductImage = await this.ProductImage.find({
            "_id_product": product._id
        });
        const arrProductImage = await docProductImage.toArray();

        for (let kArrP in arrProductImage) {
            const productImage = arrProductImage[kArrP];
            const imageDoc = await this.Image.find({
                "_id": productImage._id_image
            });
            const image = await imageDoc.toArray();
            arrImagePath.push(image[0]);
        };

        const result = {
            product: product,
            crossImage: arrProductImage,
            images: arrImagePath,
        };

        return result;
    }

    async delExtraProduct(product) {
        const extraProduct = await this.extraProductInfo(product);
        const images = extraProduct.images;

        const docProductReview = await this.ProductReview.find({
            _id_product: ObjectId.isValid(product._id) ? new ObjectId(product._id) : null,
        });
        const productReview = await docProductReview.toArray();

        this.ProductImage.deleteMany({
            _id_product: ObjectId.isValid(product._id) ? new ObjectId(product._id) : null,
        });

        this.Image.deleteMany({
            "_id": { $in: images.map(img => img._id) }
        });

        this.ProductReview.deleteMany({
            _id_product: ObjectId.isValid(product._id) ? new ObjectId(product._id) : null, 
        });

        this.Review.deleteMany({
            "_id": { $in: productReview.map(pR => pR._id_review) }
        });

        for (let ki in images) {
            const image = images[ki];
            fs.unlink("./" + image.path, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
            });
        }

    }

    async saveImage(id, path) {
        const fieldImage = this.extractImageData(path);
        const image = await this.Image.findOneAndUpdate(
            fieldImage,
            { $set: { favorite: fieldImage.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        const fieldCrossImage = this.extractProductImageData(image._id, id);
        const crossImage = await this.ProductImage.findOneAndUpdate(
            fieldCrossImage,
            { $set: { favorite: fieldCrossImage.favorite === true } },
            { returnDocument: "after", upsert: true }
        );


        const result = {
            image: image,
            crossImage: crossImage
        };

        return result;
    }

    async create(payload, paths) {
        const product = this.extractProductData(payload);
        const resultProduct = await this.Product.findOneAndUpdate(
            product,
            { $set: { favorite: product.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        const arrImagePaths = [];
        const arrProductImage = [];

        for (let key in paths) {
            const path = paths[key];
            const resultSaveImage = await this.saveImage(resultProduct._id, path);
            arrImagePaths.push(resultSaveImage.image);
            arrProductImage.push(resultSaveImage.crossImage);
        }

        const result = {
            product: resultProduct,
            crossImage: arrProductImage,
            image: arrImagePaths
        }

        return result;
    }



    async find(filter) {
        const cursor = await this.Product.find(filter);
        const document = [];

        const products = await cursor.toArray();

        for (let kp in products) {
            const product = products[kp];
            const category = await this.Category.findOne({ _id: ObjectId.isValid(product._id_category) ? new ObjectId(product._id_category) : null });
            product.category = category;
            const raw = await this.extraProductInfo(product);

            const result = {
                product: raw.product,
                images: raw.images
            };

            document.push(result);
        }

        return document;
    }

    async findByCategory(_id_category) {
        return await this.find({ _id_category: _id_category });
    }

    async findByName(name) {
        this.Product.createIndex({ "name": "text" });
        // await this.find({
        //     name: { $regex: new RegExp(name), $options: "i" },
        // });

        return await this.find({
            $text: { $search: name }
        });
    }

    async findById(id) {
        const product = await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        const category = await this.Category.findOne({ _id: ObjectId.isValid(product._id_category) ? new ObjectId(product._id_category) : null });
        product.category = category;
        const extraProduct = await this.extraProductInfo(product);

        return extraProduct;
    }

    async update(id, payload, paths) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const product = await this.findById(id);
        const arrProductImage = [];
        const arrImagePaths = [];

        const updateProduct = this.extractProductData(payload);

        // find delete old images
        if (paths.length != 0) {
            for (let kcp in product.crossImage) {
                const crossImage = product.crossImage[kcp];
                const image = product.images[kcp];
                const path = image.path;
                try {
                    fs.unlink("./" + path, (err) => {
                        if (err) throw err;
                        console.log('path/file.txt was deleted');
                    });
                } catch (error) {
                    console.log(error);
                };

                this.ProductImage.findOneAndDelete({ _id: ObjectId.isValid(crossImage._id) ? new ObjectId(crossImage._id) : null });
                this.Image.findOneAndDelete({ _id: ObjectId.isValid(image._id) ? new ObjectId(image._id) : null });
            }
        }

        // add new images
        for (let key in paths) {
            const path = paths[key];
            const resultSaveImage = await this.saveImage(product.product._id, path);
            arrImagePaths.push(resultSaveImage.image);
            arrProductImage.push(resultSaveImage.crossImage);
        }

        const resultStatus = await this.Product.findOneAndUpdate(
            filter,
            { $set: updateProduct },
            { returnDocument: "after" }
        );

        return resultStatus;
    }

    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        this.delExtraProduct(result);

        return result;
    }

    async deleteAll() {
        const products = await this.find({});
        const result = await this.Product.deleteMany({});
        products.forEach((productRes) => {
            const product = productRes.product;
            this.delExtraProduct(product);
        });
        return result;
    }

    async deleteAllByCategory(_id_category) {
        const products = await this.find({
            _id_category: _id_category,
        });
        const result = (products.length != 0) ? await this.Product.deleteMany({
            _id_category: ObjectId.isValid(_id_category) ? new ObjectId(_id_category) : null,
        }) : true;
        products.forEach((productRes) => {
            const product = productRes.product;
            this.delExtraProduct(product);
        });

        console.log("products", products);
        return result;
    }

}

export default ProductService;
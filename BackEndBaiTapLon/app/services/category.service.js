import { ObjectId } from "mongodb";
import fs from "node:fs";
import ProductService from "./product.service.js";
import RecipeService from "./recipe.service.js";

class CategoryService {
    constructor(client) {
        this.Category = client.db().collection("categories");
        this.CategoryImage = client.db().collection("categoryImage");
        this.Image = client.db().collection("images");
        this.Recipe = client.db().collection("recipes");
        this.Product = client.db().collection("products");
        this.productService = new ProductService(client);
        this.recipeService = new RecipeService(client);
    }

    extractImageData(path) {
        const image = {
            path: path
        };

        return image
    }

    extractCategoryImageData(_id_image, _id_category) {
        const categoryImage = {
            _id_category: _id_category,
            _id_image: _id_image
        };

        return categoryImage;
    }

    extractCategoryData(payload) {
        const category = {
            name: payload.name,
            description: payload.description,
            favorite: payload.favorite,
        };

        Object.keys(category).forEach(
            (key) => category[key] === undefined && delete category[key]
        );

        return category;
    }

    async extraCategoryInfo(category) {
        const arrImagePath = [];
        const docCategoryImage = await this.CategoryImage.find({
            "_id_category": category._id
        });
        const arrCategoryImage = await docCategoryImage.toArray();

        for (let kArrCI in arrCategoryImage) {
            const categoryImage = arrCategoryImage[kArrCI];
            const imageDoc = await this.Image.find({
                "_id": categoryImage._id_image
            });
            const image = await imageDoc.toArray();
            arrImagePath.push(image[0]);
        };

        const result = {
            category: category,
            cross: arrCategoryImage,
            images: arrImagePath,
        };

        return result;
    }



    async delExtraCategory(category) {
        const extraCategory = await this.extraCategoryInfo(category);
        const images = extraCategory.images;

        await this.CategoryImage.deleteMany({
            _id_category: ObjectId.isValid(category._id) ? new ObjectId(category._id) : null,
        });

        await this.Image.deleteMany({
            "_id": { $in: images.map(img => img._id) }
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

        const fieldCross = this.extractCategoryImageData(image._id, id);
        const cross = await this.CategoryImage.findOneAndUpdate(
            fieldCross,
            { $set: { favorite: fieldCross.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        const result = {
            image: image,
            cross: cross
        };

        return result;
    }

    async create(payload, path) {
        const category = this.extractCategoryData(payload);
        const resultCategory = await this.Category.findOneAndUpdate(
            category,
            { $set: { favorite: category.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        const arrImagePath = [];
        const arrCategoryImage = [];

        const resultSaveImage = await this.saveImage(resultCategory._id, path);
        arrImagePath.push(resultSaveImage.image);
        arrCategoryImage.push(resultSaveImage.cross);

        const result = {
            category: resultCategory,
            cross: arrCategoryImage,
            images: arrImagePath
        };

        return result;
    }

    async find(filter) {
        const cursor = await this.Category.find(filter);
        const document = [];

        const categories = await cursor.toArray();

        for (let kc in categories) {
            const category = categories[kc];

            const raw = await this.extraCategoryInfo(category);

            const result = {
                category: raw.category,
                images: raw.images
            };

            result.quanRecipe = await this.Recipe.countDocuments({ _id_category: raw.category._id.toString() });
            result.quanProduct = await this.Product.countDocuments({ _id_category: raw.category._id.toString() });

            document.push(result);
        }
        

        
        return document;
    }

    async findByName(name) {
        this.Category.createIndex({ "name": "text" });
        
        return await this.find({
            $text: { $search: name }
        });
    }

    async findRecipe() {
        return await this.find({ recipe: true });
    }

    async findProduct() {
        return await this.find({ recipe: false });
    }

    async findById(id) {
        const category = await this.Category.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        const extraCategory = await this.extraCategoryInfo(category);
        return extraCategory;
    }

    async update(id, payload, path) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const category = await this.findById(id);
        const arrCategoryImage = [];
        const arrImagePaths = [];

        const updateCategory = this.extractCategoryData(payload);

        if (path != "") {
            for (let kcp in category.cross) {
                const cross = category.cross[kcp];
                const image = category.images[kcp];
                const path = image.path;
                try {
                    fs.unlink("./" + path, (err) => {
                        if (err) throw err;
                        console.log(path + ' was deleted');
                    });
                } catch (error) {
                    console.log(error);
                };

                this.CategoryImage.findOneAndDelete({ _id: ObjectId.isValid(cross._id) ? new ObjectId(cross._id) : null });
                this.Image.findOneAndDelete({ _id: ObjectId.isValid(image._id) ? new ObjectId(image._id) : null });
            }

            const resultSaveImage = await this.saveImage(category.category._id, path);
            arrImagePaths.push(resultSaveImage.image);
            arrCategoryImage.push(resultSaveImage.cross);
        }

        const result = await this.Category.findOneAndUpdate(
            filter,
            { $set: updateCategory },
            { returnDocument: "after" }
        );

        return result;
    }

    async delete(id) {
        const result = await this.Category.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        await this.delExtraCategory(result);
        await this.recipeService.deleteAllByCategory(id);
        await this.productService.deleteAllByCategory(id);
        console.log("deleteCategories");
        return result;
    }

    async deleteAll() {
        const categories = await this.find({});
        const result = await this.Category.deleteMany({});
        categories.forEach(async (categoryRes) => {
            const category = categoryRes.category;
            await this.delExtraCategory(category);
            await this.recipeService.deleteAllByCategory(category._id);
            await this.productService.deleteAllByCategory(category._id);
        });
        return result;
    }
}

export default CategoryService;
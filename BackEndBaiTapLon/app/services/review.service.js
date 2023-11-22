import { ObjectId } from "mongodb";
import fs from "node:fs";

class ReviewService {
    constructor(client) {
        this.ProductReview = client.db().collection("productReview");
        this.RecipeReview = client.db().collection("recipeReview");
        this.Review = client.db().collection("reviews");
        this.Account = client.db().collection("accounts");
    }


    extractRecipeReviewData(_id_recipe, _id_review) {
        const recipeReview = {
            _id_review: _id_review,
            _id_recipe: _id_recipe
        };

        return recipeReview;
    }

    extractProductReviewData(_id_product, _id_review) {
        const productReview = {
            _id_review: _id_review,
            _id_product: _id_product
        };

        return productReview;
    }

    extractReviewData(payload) {
        const review = {
            comment: payload.comment,
            favorite: payload.favorite,
            _id_account: ObjectId.isValid(payload._id_account) ? new ObjectId(payload._id_account) : null,
            rating: payload.rating
        };

        Object.keys(review).forEach(
            (key) => review[key] === undefined && delete review[key]
        );

        return review;
    }

    async extraReviewInfo(review) {
        const recipeReview = await this.RecipeReview.findOne({
            _id_review: ObjectId.isValid(review._id) ? new ObjectId(review._id) : null,
        }) ?? null;

        const productReview = await this.ProductReview.findOne({
            _id_review: ObjectId.isValid(review._id) ? new ObjectId(review._id) : null,
        }) ?? null;

        const result = {
            review: review,
            crossRecipe: recipeReview,
            crossProduct: productReview
        };

        return result;
    }

    async delExtraReview(review) {
        const extraReview = await this.extraReviewInfo(review);

        const crossRecipe = extraReview.crossRecipe;
        const crossProduct = extraReview.crossProduct;

        if (crossRecipe != null) {
            this.RecipeReview.deleteMany({
                _id_review: ObjectId.isValid(review._id) ? new ObjectId(review._id) : null,
            });
        }

        if (crossProduct != null) {
            this.ProductReview.deleteMany({
                _id_review: ObjectId.isValid(review._id) ? new ObjectId(review._id) : null,
            });
        }
    }

    async create(payload) {
        const review = this.extractReviewData(payload);
        const resultInsertReview = await this.Review.insertOne(review);
        const resultReview = await this.Review.findOne({
            _id: ObjectId.isValid(resultInsertReview.insertedId) ? new ObjectId(resultInsertReview.insertedId) : null,
        });

        const recipeReview = (payload._id_recipe != null) ?
            this.extractRecipeReviewData(payload._id_recipe, resultReview._id) : null;      
        
        const resultRecipeReview = (recipeReview == null) ? null : await this.RecipeReview.findOneAndUpdate(
            recipeReview,
            { $set: { favorite: recipeReview.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        const productReview = (payload._id_product != null) ?
            this.extractProductReviewData(payload._id_product, resultReview._id) : null;
        
        
        const resultProductReview = (productReview == null) ? null : await this.ProductReview.findOneAndUpdate(
            productReview,
            { $set: { favorite: productReview.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        console.log("resultProductReview", resultProductReview);
        

        const result = {
            review: resultReview,
            crossRecipe: resultRecipeReview,
            crossProduct: resultProductReview,
        };

        return result;
    }

    async find(filter) {
        const document = [];
        const cursor = await this.Review.find(filter);
        const reviews = await cursor.toArray();

        for (let kr in reviews) {
            const review = reviews[kr];
            const account = await this.Account.findOne({ _id: ObjectId.isValid(review._id_account) ? new ObjectId(review._id_account) : null });
            console.log("accountFind", account);

            review.author = account;
            const extraReview = await this.extraReviewInfo(review);
            document.push(extraReview);
        }

        return document;
    }

    async findByName(name) {
        this.Review.createIndex({ "comment": "text" });

        return await this.find({
            $text: { $search: name }
        });
    }

    async findById(id) {
        const review = await this.Review.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        const account = await this.Account.findOne({ _id: ObjectId.isValid(review._id_account) ? new ObjectId(review._id_account) : null });
        console.log("accountFindId", account);
        review.author = account;
        const extraReview = await this.extraReviewInfo(review);

        return extraReview;
    }

    async findReviewRecipe(id) {
        const recipeReview = await (await this.RecipeReview.find({ _id_recipe: id })).toArray();
        return await this.find({ _id: { $in: recipeReview.map((review) => review._id_review) } });
    }

    async findReviewProduct(id) {
        const productReview = await (await this.ProductReview.find({ _id_product: id })).toArray();
        return await this.find({ _id: { $in: productReview.map((review) => review._id_review) } });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const updateReview = this.extractReviewData(payload);
        const resultStatus = await this.Review.findOneAndUpdate(
            filter,
            { $set: updateReview },
            { returnDocument: "after" }
        );

        return resultStatus;
    }

    async delete(id) {
        const result = await this.Review.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        this.delExtraReview(result);
        return result;
    }

    async deleteAll() {
        const reviews = await this.find({});
        const result = await this.Review.deleteMany({});
        reviews.forEach((reviewResponse) => {
            const review = reviewResponse.review;
            this.delExtraReview(review);
        });
        return result;
    }

}

export default ReviewService;
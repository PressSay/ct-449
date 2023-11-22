import ReviewService from "../services/review.service.js";
import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";

const reviews = {
    create: async (req, res, next) => {
        if (!req.body?.comment) {
            return next(new ApiError(400, "Comment can not be empty"));
        } else if (!(req.body?._id_product || req.body?._id_recipe)) {
            return next(new ApiError(400, "Recipe Or Product can not be empty"));
        } else if (!req.body?._id_account) {
            return next(new ApiError(400, "Account can not be empty"));
        } else if (!req.body?.rating) {
            return next(new ApiError(400, "Rating can not be empty"));
        }

        try {
            const reviewService = new ReviewService(MongoDB.client);
            const document = await reviewService.create(req.body);
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(500, "An Error occurred while creating the account")
            );
        }
    },

    findAll: async (req, res, next) => {
        let documents = [];
        try {
            const reviewService = new ReviewService(MongoDB.client);
            documents = (req.query._id_product) ?
                reviewService.findReviewProduct(req.query._id_product) : (req.query._id_recipe) ?
                    reviewService.findReviewRecipe(req.query._id_recipe) : (req.query.name) ?
                        reviewService.findByName(req.query.name) : await reviewService.find({});
            documents = await documents;
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while retrieving reviews")
            );
        }

        return res.send(documents);
    },

    findOne: async (req, res, next) => {
        try {
            const reviewService = new ReviewService(MongoDB.client);
            const document = await reviewService.findById(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Review not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving review with id=${req.params.id}`
                )
            );
        }
        // res.send({ message: "findOne handler" });
    },

    update: async (req, res, next) => {
        if (Object.keys(req.body).length == 0) {
            return next(new ApiError(400, "Data to update can not be empty"));
        }

        try {
            const reviewService = new ReviewService(MongoDB.client);
            const document = await reviewService.update(req.params.id, req.body);
            if (!document) {
                return next(new ApiError(404, "Review not found"));
            }
            return res.send({ message: "Contact was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `Error updating contact with id=${req.params.id}`)
            );
        }
        // res.send({ message: "update handler" });
    },

    delete: async (req, res, next) => {
        try {
            const reviewService = new ReviewService(MongoDB.client);
            const document = await reviewService.delete(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Account not found"));
            }
            return res.send({ message: "Review was delete successfully" });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Could not delete Review with id=${req.params.id}`
                )
            );
        }
    },

    deleteAll: async (req, res, next) => {
        try {
            const reviewService = new ReviewService(MongoDB.client);
            const deletedCount = await reviewService.deleteAll();
            return res.send({
                message: `${deletedCount} reviews were deleted successfully`,
            });
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while removing all reviews")
            );
        }
    }
};

export default reviews
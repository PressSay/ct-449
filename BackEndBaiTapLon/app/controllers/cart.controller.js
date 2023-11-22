import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import CartService from "../services/cart.service.js";

const carts = {
    create: async (req, res, next) => {
        if (!req.body?._id_account) {
            return next(new ApiError(400, "\"Id Account\" can not be empty"));
        } else if (!req.body?.paid) {
            return next(new ApiError(400, "\"Paid\" can not be empty"));
        }

        try {
            const cartService = new CartService(MongoDB.client);
            const document = await cartService.create(req.body);
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(500, "An Error occurred while creating the cart")
            );
        }
    },

    update: async (req, res, next) => {
        if (Object.keys(req.body).length == 0) {
            return next(new ApiError(400, "Data to update can not be empty"));
        } else if (!req.body?._id_product) {
            return next(new ApiError(400, "\"Id Product\" can not be empty"));
        } else if (!req.body?.quantity) {
            return next(new ApiError(400, "\"Quantity\" can not be empty"));
        }

        try {
            const cartService = new CartService(MongoDB.client);
            const document = await cartService.update(req.params.id, req.body);
            if (!document) {
                return next(new ApiError(404, "Cart not found"));
            }
            return res.send({ message: "Cart was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `Error updating Cart with id=${req.params.id}`)
            );
        }
        // res.send({ message: "update handler" });
    },

    findAll: async (req, res, next) => {
        let documents = [];
        try {
            const cartService = new CartService(MongoDB.client);
            // documents = await cartService.find({});
            documents = (req.query._id_account) ?
                await cartService.find({ _id_account: req.query._id_account }) : (req.query.paid == "normal") ?
                    await cartService.find({ paid: "normal" }) : (req.query.paid == "paid") ?
                        await cartService.find({ paid: "paid" }) : await cartService.find({});
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while retrieving contacts")
            );
        }

        return res.send(documents);
    },

    findOne: async (req, res, next) => {
        try {
            const cartService = new CartService(MongoDB.client);
            const document = await cartService.findById(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Contact not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving contact with id=${req.params.id}`
                )
            );
        }
    },

    delete: async (req, res, next) => {
        try {
            const cartService = new CartService(MongoDB.client);
            const document = await cartService.delete(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Cart not found"));
            }
            return res.send({ message: "Cart was delete successfully" });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Could not delete Cart with id=${req.params.id}`
                )
            );
        }
    },

    deleteAll: async (req, res, next) => {
        try {
            const cartService = new CartService(MongoDB.client);
            const deletedCount = await cartService.deleteAll();
            return res.send({
                message: `${deletedCount} Cart were deleted successfully`,
            });
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while removing all cart")
            );
        }
    }
};

export default carts
import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import CategoryService from "../services/category.service.js";
import fs from "node:fs";

const categories = {
    create: async (req, res, next) => {
        const path = req.file.path;
        let field = "";

        if (!req.file) {
            field = "Image";
        } else if (!req.body?.name) {
            field = "Name";
        } else if (!req.body?.description) {
            field = "Description";
        }

        if (field != "") {
            if (field != "Image") {
                fs.unlink("./" + path, (err) => {
                    if (err) throw err;
                    console.log('path/file.txt was deleted');
                });
            }
            return next(new ApiError(400, field + " can not be empty"));
        }

        try {
            const categoryService = new CategoryService(MongoDB.client);
            const document = await categoryService.create(req.body, path);
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(500, "An Error occurred while creating the category")
            );
        }
    },

    findAll: async (req, res, next) => {
        let documents = [];

        try {
            const categoryService = new CategoryService(MongoDB.client);
            const { name } = req.query;
            if (name) {
                documents = await categoryService.findByName(name);
            } else {
                documents = await categoryService.find({});
            }
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while retrieving category")
            );
        }

        return res.send(documents);
    },

    findOne: async (req, res, next) => {
        try {
            const categoryService = new CategoryService(MongoDB.client);
            const document = await categoryService.findById(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Category not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving category with id=${req.params.id}`
                )
            );
        }
    },

    findRecipe: async (req, res, next) => {
        try {
            const categoryService = new CategoryService(MongoDB.client);
            const document = await categoryService.findRecipe();
            if (!document) {
                return next(new ApiError(404, "Categories not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving categories with id=${req.params.id}`
                )
            );
        }
    },

    findProduct: async (req, res, next) => {
        try {
            const categoryService = new CategoryService(MongoDB.client);
            const document = await categoryService.findProduct();
            if (!document) {
                return next(new ApiError(404, "Categories not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving categories with id=${req.params.id}`
                )
            );
        }
    },

    update: async (req, res, next) => {
        if (Object.keys(req.body).length == 0) {
            return next(new ApiError(400, "Data to update can not be empty"));
        }

        const path = (req.file) ? req.file.path : "";

        try {
            const categoryService = new CategoryService(MongoDB.client);
            const document = await categoryService.update(req.params.id, req.body, path);
            if (!document) {
                return next(new ApiError(404, "Contact not found"));
            }
            return res.send({ message: "Contact was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `Error updating contact with id=${req.params.id}`)
            );
        }
    },

    delete: async (req, res, next) => {
        try {
            const categoryService = new CategoryService(MongoDB.client);
            const document = await categoryService.delete(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Category not found"));
            }
            return res.send({ message: "Category was delete successfully" });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Could not delete Category with id=${req.params.id}`
                )
            );
        }
    },

    deleteAll: async (req, res, next) => {
        try {
            const categoryService = new CategoryService(MongoDB.client);
            const deletedCount = await categoryService.deleteAll();
            return res.send({
                message: `${deletedCount} categories were deleted successfully`,
            });
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while removing all categories")
            );
        }
    }
};

export default categories
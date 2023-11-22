import ApiError from "../api-error.js";
import MongoDB from "../utils/mongodb.util.js";
import ProductService from "../services/product.service.js";
import fs from "node:fs";

const products = {
    create: async (req, res, next) => {
        const paths = [];
        console.log(req["images[]"]);

        req.files.forEach(element => {
            paths.push(element.path);
        });
        let field = "";


        if (!req.files) {
            field = "Images";
        } else if (!req.body?.description) {
            field = "Description";
        } else if (!req.body?.feature) {
            field = "Feature";
        } else if (!req.body?._id_category) {
            field = "\"Id Category\"";
        } else if (!req.body?.name) {
            field = "Name";
        } else if (!req.body?.price) {
            field = "Price";
        } else if (!req.body?.quantity) {
            field = "Quantity";
        } else if (!req.body?.sku) {
            field = "Sku";
        }

        if (field != "") {
            if (field != "Images") {
                for (let k in paths) {
                    const path = paths[k];
                    fs.unlink("./" + path, (err) => {
                        if (err) throw err;
                        console.log('path/file.txt was deleted');
                    });
                }
            }
            return next(new ApiError(400, field + " can not be empty"));
        }

        

        try {
            const productService = new ProductService(MongoDB.client);
            const document = await productService.create(req.body, paths);
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(500, "An Error occurred while creating the product")
            );
        }
    },

    findAll: async (req, res, next) => {
        let documents = [];

        try {
            const productService = new ProductService(MongoDB.client);
            const { name, _id_category } = req.query;
            if (name) {
                documents = await productService.findByName(name);
            } else if (_id_category) {
                console.log(_id_category);
                documents = await productService.findByCategory(_id_category);
            } else {
                documents = await productService.find({});
            }
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while retrieving product")
            );
        }

        return res.send(documents);
    },

    findOne: async (req, res, next) => {
        try {
            const productService = new ProductService(MongoDB.client);
            const document = await productService.findById(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Product not found"));
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
        // res.send({ message: "findOne handler" });
    },

    update: async (req, res, next) => {
        if (Object.keys(req.body).length == 0) {
            return next(new ApiError(400, "Data to update can not be empty"));
        }
        
        const paths = [];
        if (req.files) {
            req.files.forEach(element => {
                paths.push(element.path);
            });
        }

        try {
            const productService = new ProductService(MongoDB.client);
            const document = await productService.update(req.params.id, req.body, paths);
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

    delete:  async (req, res, next) => {
        try {
            const productService = new ProductService(MongoDB.client);
            const document = await productService.delete(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Product not found"));
            }
            return res.send({ message: "Product was delete successfully" });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Could not delete Product with id=${req.params.id}`
                )
            );
        }
    },

    deleteAll: async (req, res, next) => {
        try {
            const productService = new ProductService(MongoDB.client);
            const deletedCount = await productService.deleteAll();
            return res.send({
                message: `${deletedCount} products were deleted successfully`,
            });
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while removing all products")
            );
        }
    }
};

export default products
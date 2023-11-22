import ApiError from "../api-error.js";
import RecipeService from "../services/recipe.service.js";
import MongoDB from "../utils/mongodb.util.js";
import fs from "node:fs";

const recipes = {
    create: async (req, res, next) => {
        const paths = [];
        req.files.forEach(element => {
            paths.push(element.path);
        });
        let field = "";

        if (!req.files) {
            field = "Images";
        } else if (!req.body?.name) {
            field = "Name";
        } else if (!req.body?.description) {
            field = "Description";
        } else if (!req.body?._id_category) {
            field = "\"Id Category\"";
        } else if (!req.body?.ingredient) {
            field = "Ingredient";
        } else if (!req.body?.nutrition) {
            field = "Nutrition";
        } else if (!req.body?._id_account) {
            field = "\"Id Account\"";
        } else if (!req.body?.tprepare) {
            field = "Tprepare";
        } else if (!req.body?.tcook) {
            field = "Tcook";
        } else if (!req.body?.ser) {
            field = "Ser";
        } else if (!req.body.view) {
            field = "View";
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

        // console.log("body", req.body.nutrition);

        // req.files.forEach(element => {
        //     paths.push(element.path);
        // });
        // return res.send({ message: "create handler" });

        

        if (req.files != null) {
            req.files.forEach(element => {
                paths.push(element.path);
            });
        }

        try {
            const recipeService = new RecipeService(MongoDB.client);
            const document = await recipeService.create(req.body, paths);
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(500, "An Error occurred while creating the recipe")
            );
        }
    },

    findAll: async (req, res, next) => {
        let documents = [];

        try {
            const recipeService = new RecipeService(MongoDB.client);
            const { name, _id_category, chosen, slider, trending, popular, random } = req.query;

            if (_id_category) {
                console.log(_id_category);
                documents = await recipeService.findByCategory(_id_category);
            } else if (chosen) {
                console.log("chosen");
                documents = await recipeService.findChosen();
            } else if (slider) {
                console.log("slider");
                documents = await recipeService.findSlider(name);
            } else if (trending) {
                console.log("trending");
                documents = await recipeService.findTrending(name);
            } else if (popular) {
                console.log("popular");
                documents = await recipeService.findPopular();
            } else if (random) {
                console.log("random");
                documents = await recipeService.findRandom();
            } else if (name) {
                documents = await recipeService.findByName(name);
            } else {
                documents = await recipeService.find({});
            }
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while retrieving recipe")
            );
        }

        return res.send(documents);
    },

    findOne: async (req, res, next) => {
        try {
            const recipeService = new RecipeService(MongoDB.client);
            const document = await recipeService.findById(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Recipe not found"));
            }
            return res.send(document);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Error retrieving Recipe with id=${req.params.id}`
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
            const recipeService = new RecipeService(MongoDB.client);
            const document = await recipeService.update(req.params.id, req.body, paths);
            if (!document) {
                return next(new ApiError(404, "Contact not found"));
            }
            return res.send({ message: "Recipe was updated successfully" });
        } catch (error) {
            return next(
                new ApiError(500, `Error updating contact with id=${req.params.id}`)
            );
        }
    },

    delete: async (req, res, next) => {
        try {
            const recipeService = new RecipeService(MongoDB.client);
            const document = await recipeService.delete(req.params.id);
            if (!document) {
                return next(new ApiError(404, "Product not found"));
            }
            return res.send({ message: "Recipe was delete successfully" });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    `Could not delete Recipe with id=${req.params.id}`
                )
            );
        }
    },

    deleteAll: async (req, res, next) => {
        try {
            const recipeService = new RecipeService(MongoDB.client);
            const deletedCount = await recipeService.deleteAll();
            return res.send({
                message: `${deletedCount} Recipes were deleted successfully`,
            });
        } catch (error) {
            return next(
                new ApiError(500, "An error occurred while removing all Recipes")
            );
        }
    }
};

export default recipes
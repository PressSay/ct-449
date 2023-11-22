import { ObjectId } from "mongodb";
import fs from "node:fs";
import path from "node:path";

class RecipeService {
    constructor(client) {
        this.Recipe = client.db().collection("recipes");
        this.Nutrition = client.db().collection("recipeNutrition");
        this.Ingredient = client.db().collection("recipeIngredient");
        this.Image = client.db().collection("images");
        this.RecipeImage = client.db().collection("recipeImage");
        this.Account = client.db().collection("accounts");
        this.category = client.db().collection("categories");
        this.RecipeReview = client.db().collection("recipeReview");
        this.Review = client.db().collection("reviews");
    }

    shuffle(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    extractImageData(path) {
        const image = {
            path: path
        };

        return image;
    }

    extractRecipeImageData(_id_image, _id_recipe) {
        const recipeImage = {
            _id_recipe: _id_recipe,
            _id_image: _id_image
        };

        return recipeImage;
    }

    extractIngredientData(name, quantity, _id_recipe) {
        const ingredient = {
            name: name,
            quantity: quantity,
            _id_recipe: _id_recipe
        };

        return ingredient;
    }

    extractNutritionData(name, unit, _id_recipe) {
        const nutrition = {
            "name": name,
            "unit": unit,
            "_id_recipe": _id_recipe
        };
        return nutrition;
    }

    extractRecipeData(payload) {
        const recipe = {
            name: payload.name,
            short: payload.short,
            description: payload.description,
            _id_category: payload._id_category,
            _id_account: payload._id_account,
            favorite: payload.favorite, // (popular)
            chosen: payload.chosen ?? false,
            trending: payload.trending ?? false,
            slider: payload.slider ?? false,
            popular: payload.popular ?? false,
            tprepare: payload.tprepare,
            tcook: payload.tcook,
            ser: payload.ser,
            view: payload.view,
        };

        Object.keys(recipe).forEach(
            (key) => recipe[key] === undefined && delete recipe[key]
        );
        return recipe;
    }

    async extraRecipeInfo(recipe) {
        const arrImagePath = [];

        const docProcess = await this.Nutrition.find({
            "_id_recipe": recipe._id
        });
        const docIngredient = await this.Ingredient.find({
            "_id_recipe": recipe._id
        });
        const docRecipeImage = await this.RecipeImage.find({
            "_id_recipe": recipe._id
        });

        const arrProcess = await docProcess.toArray();
        const arrIngredient = await docIngredient.toArray();
        const arrRecipeImage = await docRecipeImage.toArray();

        for (let kArrR in arrRecipeImage) {
            const recipeImage = arrRecipeImage[kArrR];
            const imageDoc = await this.Image.find({
                "_id": recipeImage._id_image
            });
            const image = await imageDoc.toArray();
            arrImagePath.push(image[0]);
        };

        const result = {
            recipe: recipe,
            crossImage: arrRecipeImage,
            images: arrImagePath,
            nutrition: arrProcess,
            ingredient: arrIngredient
        };

        return result;
    }

    async saveIngredient(ingredients, _id_recipe) {
        const arrIngredient = [];
        console.log("ingredient", ingredients);

        for (let ki in ingredients) {
            const ingredient = this.extractIngredientData(
                ingredients[ki].name,
                ingredients[ki].quantity,
                _id_recipe
            );

            const resultIngredient = (ingredients[ki]._id == -1) ? await this.Ingredient.findOneAndUpdate(
                ingredient,
                { $set: { favorite: ingredient.favorite === true } },
                { returnDocument: "after", upsert: true }
            ) : await this.Ingredient.findOneAndUpdate(
                { _id: ObjectId.isValid(ingredients[ki]._id) ? new ObjectId(ingredients[ki]._id) : null },
                { $set: ingredient },
                { returnDocument: "after", }
            );

            arrIngredient.push(resultIngredient);
        }


        return arrIngredient;
    }

    async saveNutrition(arrNutrition, _id_recipe) {
        const arrNutr = [];
        console.log("arrNutrition", arrNutrition);

        for (let kp in arrNutrition) {
            const nutrition = this.extractNutritionData(
                arrNutrition[kp].name,
                arrNutrition[kp].unit,
                _id_recipe
            );

            const resultProcess = (arrNutrition[kp]._id == -1) ? await this.Nutrition.findOneAndUpdate(
                nutrition,
                { $set: { favorite: nutrition.favorite === true } },
                { returnDocument: "after", upsert: true }
            ) : await this.Nutrition.findOneAndUpdate(
                { _id: ObjectId.isValid(arrNutrition[kp]._id) ? new ObjectId(arrNutrition[kp]._id) : null },
                { $set: nutrition },
                { returnDocument: "after" }
            );

            console.log("resultProcess",resultProcess);


            arrNutr.push(resultProcess);
        }

        return arrNutr;
    }

    async delExtraRecipe(recipe) {
        const extraRecipe = await this.extraRecipeInfo(recipe);
        const images = extraRecipe.images;

        // call all comment
        const docRecipeReview = await this.RecipeReview.find({
            _id_recipe: ObjectId.isValid(recipe._id) ? new ObjectId(recipe._id) : null,
        });
        const recipeReview = await docRecipeReview.toArray();


        this.RecipeImage.deleteMany({
            _id_recipe: ObjectId.isValid(recipe._id) ? new ObjectId(recipe._id) : null,
        });

        this.Ingredient.deleteMany({
            _id_recipe: ObjectId.isValid(recipe._id) ? new ObjectId(recipe._id) : null,
        });

        this.Nutrition.deleteMany({
            _id_recipe: ObjectId.isValid(recipe._id) ? new ObjectId(recipe._id) : null,
        });

        this.Image.deleteMany({
            "_id": { $in: images.map(img => img._id) }
        });

        // delete all comment

        this.RecipeReview.deleteMany({
            _id_recipe: ObjectId.isValid(recipe._id) ? new ObjectId(recipe._id) : null,
        });

        this.Review.deleteMany({
            "_id": { $in: recipeReview.map(rR => rR._id_review) }
        });

        for (let ki in images) {
            const image = images[ki];
            fs.unlink("./" + image.path, (err) => {
                if (err) throw err;
                console.log(image.path + ' was deleted');
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

        const fieldCrossImage = this.extractRecipeImageData(image._id, id);
        const crossImage = await this.RecipeImage.findOneAndUpdate(
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
        const recipe = this.extractRecipeData(payload);
        const resultRecipe = await this.Recipe.findOneAndUpdate(
            recipe,
            { $set: { favorite: recipe.favorite === true } },
            { returnDocument: "after", upsert: true }
        );

        const arrImages = [];

        for (let key in paths) {
            console
            const path = paths[key];
            console.log(path);
            const resultSaveImage = await this.saveImage(resultRecipe._id, path);
            arrImages.push(resultSaveImage);
        }

        const arrIngredient = await this.saveIngredient(payload.ingredient, resultRecipe._id);
        const arrNutrtion = await this.saveNutrition(payload.nutrition, resultRecipe._id);

        const result = {
            recipe: resultRecipe,
            images: arrImages,
            ingredient: arrIngredient,
            nutrition: arrNutrtion
        };

        return result;
    }

    async find(filter) {
        const document = [];
        const cursor = await this.Recipe.find(filter);
        const recipes = await cursor.toArray();

        for (let kr in recipes) {
            const recipe = recipes[kr];
            const account = await this.Account.findOne({ _id: ObjectId.isValid(recipe._id_account) ? new ObjectId(recipe._id_account) : null });
            const category = await this.category.findOne({ _id: ObjectId.isValid(recipe._id_category) ? new ObjectId(recipe._id_category) : null });

            recipe.author = account;
            recipe.category = category

            const extraRecipe = await this.extraRecipeInfo(recipe);

            const result = {
                recipe: extraRecipe.recipe,
                images: extraRecipe.images,
                nutrition: extraRecipe.nutrition,
                ingredient: extraRecipe.ingredient
            };

            document.push(result);
        }

        return document;
    }

    async findByName(name) {
        this.Recipe.createIndex({ "name": "text" });

        return await this.find({
            $text: { $search: name }
        });
    }

    async findPopular() {
        return await this.find({ popular: true });
    }

    async findChosen() {
        return await this.find({ chosen: true });
    }

    async findSlider() {
        return await this.find({ slider: true });
    }

    async findTrending() {
        return await this.find({ trending: true });
    }

    async findByCategory(_id_category) {
        return await this.find({ _id_category: _id_category });
    }

    async findRandom() {
        const array = await this.find({});
        this.shuffle(array);
        return array;
    }

    async findById(id) {
        const recipe = await this.Recipe.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        const account = await this.Account.findOne({ _id: ObjectId.isValid(recipe._id_account) ? new ObjectId(recipe._id_account) : null });
        const category = await this.category.findOne({ _id: ObjectId.isValid(recipe._id_category) ? new ObjectId(recipe._id_category) : null });

        recipe.author = account;
        recipe.category = category
        const extraRecipe = await this.extraRecipeInfo(recipe);

        return extraRecipe;
    }

    async update(id, payload, paths) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        const recipe = await this.findById(id);

        const updateRecipe = this.extractRecipeData(payload);

        // find delete old images
        if (paths.length != 0) {
            for (let kcp in recipe.crossImage) {
                const crossImage = recipe.crossImage[kcp];
                const image = recipe.images[kcp];
                const path = image.path;
                try {
                    fs.unlink("./" + path, (err) => {
                        if (err) throw err;
                        console.log('path/file.txt was deleted');
                    });
                } catch (error) {
                    console.log(error);
                };

                this.RecipeImage.findOneAndDelete({ _id: ObjectId.isValid(crossImage._id) ? new ObjectId(crossImage._id) : null });
                this.Image.findOneAndDelete({ _id: ObjectId.isValid(image._id) ? new ObjectId(image._id) : null });
            }
        }

        // add new images
        for (let key in paths) {
            const path = paths[key];
            this.saveImage(recipe.recipe._id, path);
        }

        const resultStatus = await this.Recipe.findOneAndUpdate(
            filter,
            { $set: updateRecipe },
            { returnDocument: "after" }
        );

        if (payload.ingredient.length != 0) {
            this.saveIngredient(payload.ingredient, id);
        }
        if (payload.nutrition.length != 0) {
            this.saveNutrition(payload.nutrition, id);
        }

        return resultStatus;
    }

    async delete(id) {
        const result = await this.Recipe.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        this.delExtraRecipe(result);

        return result;
    }

    async deleteAll() {
        const recipes = await this.find({});
        const result = await this.Recipe.deleteMany({});
        recipes.forEach((recipeResponse) => {
            const recipe = recipeResponse.recipe;
            this.delExtraRecipe(recipe);
        });
        return result;
    }

    async deleteAllByCategory(_id_category) {
        const recipes = await this.find({
            _id_category: _id_category,
        });
        const result = (recipes.length != 0) ? await this.Recipe.deleteMany({
            _id_category: ObjectId.isValid(_id_category) ? new ObjectId(_id_category) : null,
        }) : true;
        recipes.forEach((recipeResponse) => {
            const recipe = recipeResponse.recipe;
            this.delExtraRecipe(recipe);
        });
        return result;
    }

}

export default RecipeService;
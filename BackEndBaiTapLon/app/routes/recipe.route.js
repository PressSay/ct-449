import { Router } from "express";
import recipes from "../controllers/recipe.controller.js";
import Multer from "../utils/multer.util.js";


const upload = new Multer();
const router = Router();

router.route("/")
    .get(recipes.findAll)
    .post(upload.array('images[]', 4), recipes.create)
    .delete(recipes.deleteAll);

router.route("/:id")
    .get(recipes.findOne)
    .post(upload.array('images[]', 4),recipes.update)
    .delete(recipes.delete);

export default router;


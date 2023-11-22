import { Router } from "express";
import categories from "../controllers/category.controler.js";
import Multer from "../utils/multer.util.js";

const upload = new Multer();
const router = Router();

router.route("/")
    .get(categories.findAll)
    .post(upload.single("image"), categories.create)
    .delete(categories.deleteAll);

router.route("/recipe")
    .get(categories.findRecipe);

router.route("/product")
    .get(categories.findProduct);

router.route("/:id")
    .get(categories.findOne)
    .post(upload.single("image"), categories.update)
    .delete(categories.delete);

export default router;


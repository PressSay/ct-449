import { Router } from "express";
import products from "../controllers/product.controller.js";
import Multer from "../utils/multer.util.js";



const upload = new Multer();
const router = Router();


router.route("/")
    .get(products.findAll)
    .post(upload.array("images[]", 4), products.create)
    .delete(products.deleteAll);

router.route("/:id")
    .get(products.findOne)
    .post(upload.array("images[]", 4), products.update)
    .delete(products.delete);

export default router;


import { Router } from "express";
import carts from "../controllers/cart.controller.js";

const router = Router();

router.route("/")
    .get(carts.findAll)
    .post(carts.create)
    .delete(carts.deleteAll);

router.route("/:id")
    .get(carts.findOne)
    .put(carts.update)
    .delete(carts.delete);

export default router;
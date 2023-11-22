import { Router } from "express";
import reviews from "../controllers/review.controller.js";

const router = Router();

router.route("/")
    .get(reviews.findAll)
    .post(reviews.create)
    .delete(reviews.deleteAll);

router.route("/:id")
    .get(reviews.findOne)
    .put(reviews.update)
    .delete(reviews.delete);

export default router;

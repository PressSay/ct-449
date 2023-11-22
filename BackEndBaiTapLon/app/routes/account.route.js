import { Router } from "express";
import accounts from "../controllers/account.controller.js";
import Multer from "../utils/multer.util.js";


const upload = new Multer();
const router = Router();

router.route("/")
    .get(accounts.findAll)
    .post(upload.single("avatar"), accounts.create)
    .delete(accounts.deleteAll);

router.route("/:id")
    .get(accounts.findOne)
    .put(accounts.update)
    .delete(accounts.delete);

export default router;


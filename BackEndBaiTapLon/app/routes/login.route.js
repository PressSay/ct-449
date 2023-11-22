import { Router } from "express";
import accounts from "../controllers/account.controller.js";

const router = Router();

router.route("/")
    .post(accounts.login)
    .get(accounts.user);
    

export default router;


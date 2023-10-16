import { Router } from "express";
import * as AuthController from "../controllers/auth/authentication.controller";
import guest from "../middlewares/guest";

const router: Router = Router();

router.post("/login", guest, AuthController.authenticate);

export default router;
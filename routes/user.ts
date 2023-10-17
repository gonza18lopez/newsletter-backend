import { Router } from "express";
import * as UserController from "../controllers/auth/user.controller";
import auth from "../middlewares/auth";

const router: Router = Router();

router.get("/", auth, UserController.currentUser as any);

export default router;
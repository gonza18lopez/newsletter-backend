import { Router } from "express";

import auth from "./auth";
import user from "./user";
import newsletter from "./newsletter";

const router: Router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/newsletter", newsletter);

export default router;

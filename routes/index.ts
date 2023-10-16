import { Router } from "express";

import auth from "./auth";
import newsletter from "./newsletter";

const router: Router = Router();

router.use("/auth", auth);
router.use("/newsletter", newsletter);

export default router;

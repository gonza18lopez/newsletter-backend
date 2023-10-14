import { Router } from "express";

import newsletter from "./newsletter";

const router: Router = Router();

router.use("/newsletter", newsletter);

export default router;

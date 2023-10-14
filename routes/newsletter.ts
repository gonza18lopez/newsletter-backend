import { Request, Response, Router } from "express";
import newsletter from "../controllers/newsletter.controller";

const router: Router = Router();

router.post("/", newsletter.join);

export default router;
import { Router } from "express";
import * as RecipientController from "../controllers/recipient.controller";
import guest from "../middlewares/guest";

const router: Router = Router();

router.get("/:token", RecipientController.getNewsletters);
router.patch("/:token", RecipientController.unsubscribe);
router.delete("/:token", RecipientController.destroy);

export default router;
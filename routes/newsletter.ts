import { Router } from "express";
import * as NewsletterController from "../controllers/newsletter.controller";
import multer from "multer";
import auth from "../middlewares/auth";
import path from "path";

const router: Router = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "storage");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Endpoint to get all newsletters
router.get("/", auth, NewsletterController.index);

// Endpoint to send a newsletter
router.post("/:id(\\d+)/send", auth, NewsletterController.send as any);

// Endpoint to create a newsletter model
router.post(
    "/create",
    [auth, upload.single("attachment")],
    NewsletterController.store
);

// Endpoint to delete a newsletter
router.delete("/:id(\\d+)", auth, NewsletterController.destroy);

// Endpoint register an email to the newsletter
router.post("/", NewsletterController.subscribe);

export default router;


import { Router } from "express";
import multer from "multer";
import uploadController from "./controllers/uploads.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/", upload.single("image"), uploadController);

export default router;


import { Router } from "express";
import userRoutes from "../models/user/routes.js";
import uploadRoutes from "../models/uploads/routes.js";
import notesRoutes from "../models/notes/routes.js"

const router = Router();


router.use("/auth", userRoutes);
router.use("/uploads", uploadRoutes);
router.use("/notes",notesRoutes)




export default router;
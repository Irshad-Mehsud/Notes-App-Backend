import { Router } from "express";
import { postController, getController, getCurrentUser, updateController, deleteController, forgotPassword, resetPassword, } from "./controllers/allControllers.js";
import { authentication } from "../../helpers/index.js";
import { verifyOtp } from "../../helpers/verifyOtp.js";
import loginUser from "./authController/login.js";
const router = Router();

router.post("/register", postController);
router.get("/", authentication, getController)
router.get("/me", authentication, getCurrentUser)
router.put("/:id", updateController)
router.delete("/:id", deleteController);
router.post("/login", loginUser);


router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
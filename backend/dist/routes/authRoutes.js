import express from "express";
import { signupController, loginController } from "../controllers/authController";
const router = express.Router();
// Public routes
router.post("/signup", signupController);
router.post("/login", loginController);
export default router;

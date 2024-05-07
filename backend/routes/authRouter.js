import { Router } from "express";
import {
  register,
  login,
  resetPassword,
  confirmResetPassword,
  confirmEmail,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);
router.post("/confirm/reset", confirmResetPassword);
router.post("/confirm/email", confirmEmail);

export default router;

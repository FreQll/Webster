import { Router } from "express";
import {
  getUser,
  getUserAvatar,
  updateUserAvatar,
} from "../controllers/userController.js";
import multer from "multer";

const upload = multer({ dest: "public/avatars" });

const router = Router();

router.get("/:userId", getUser);
router.get("/avatar/:userId", getUserAvatar);
router.patch("/avatar/:userId", upload.single("avatar"), updateUserAvatar);

export default router;

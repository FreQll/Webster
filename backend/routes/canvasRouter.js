import { Router } from "express";
import {
  createCanvas,
  deleteCanvas,
  getCanvasById,
  getUserCanvases,
  updateCanvas,
} from "../controllers/canvasController.js";
const router = Router();

router.get("/:canvasId", getCanvasById);
router.get("/user/:userId", getUserCanvases);
router.post("/create", createCanvas);
router.patch("/update/:canvasId", updateCanvas);
router.delete("/delete/:canvasId", deleteCanvas);

export default router;

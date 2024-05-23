import { Router } from "express";
import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import canvasRouter from "./canvasRouter.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/canvas", canvasRouter);

export default router;

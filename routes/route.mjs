import { Router } from "express";
import userRouter from "./userRouter.mjs";
import todoRouter from "./todoRouter.mjs";
import { globalErrorHandler } from "../middleware/userMiddleware.mjs";

const router = Router();

router.use(userRouter);
router.use(todoRouter);
router.use(globalErrorHandler);

export default router;
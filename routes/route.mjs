import { Router } from "express";
import userRouter from "./userRouter.mjs";
import todoRouter from "./todoRouter.mjs";
import { globalErrorHandler } from "../middleware/userMiddleware.mjs";
import cors from "cors";

const router = Router();
// Enable CORS for all routes
router.use(cors());

router.use(userRouter);
router.use(todoRouter);
router.use(globalErrorHandler);

export default router;

import express from "express";
import { verifyAccessToken } from "../middleware/jwtAuth";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";

const fileRouter = express.Router();

fileRouter
  .route("/upload")
  .post(verifyAccessToken, asyncHandler(uploadMiddleware));

export default fileRouter;

import express from "express";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../controllers/notificationController";
import { verifyAccessToken } from "../middleware/jwtAuth";
import { asyncHandler } from "../middleware/asyncHandler";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyAccessToken, asyncHandler(getNotifications));
notificationRouter.get(
  "/count",
  verifyAccessToken,
  asyncHandler(getUnreadNotificationCount)
);
notificationRouter.patch(
  "/:id",
  verifyAccessToken,
  asyncHandler(markNotificationAsRead)
);

export default notificationRouter;
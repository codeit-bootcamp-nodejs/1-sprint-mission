import express from "express";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
} from "../controllers/notificationController";
import { verifyAccessToken } from "../middleware/jwtAuth";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyAccessToken, getNotifications);
notificationRouter.get("/count", verifyAccessToken, getUnreadNotificationCount);
notificationRouter.patch("/:id", verifyAccessToken, markNotificationAsRead);

export default notificationRouter;

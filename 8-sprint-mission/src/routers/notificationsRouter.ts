import express from "express";
import { Router } from "express";
import { withAsync } from "../lib/withAsync";
import authenticate from "../middlewares/authenticate";
import { patchReadStatus } from "../controllers/notificationsController";

const notificationRouter = express.Router();

notificationRouter.patch(
  "/:notificationId/read",
  authenticate(),
  withAsync(patchReadStatus)
);

export default notificationRouter;

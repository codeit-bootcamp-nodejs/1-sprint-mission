"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const authenticate_1 = __importDefault(require("../middlewares/authenticate"));
const notificationsController_1 = require("../controllers/notificationsController");
const notificationRouter = express_1.default.Router();
notificationRouter.patch("/:notificationId/read", (0, authenticate_1.default)(), (0, withAsync_1.withAsync)(notificationsController_1.patchReadStatus));
exports.default = notificationRouter;

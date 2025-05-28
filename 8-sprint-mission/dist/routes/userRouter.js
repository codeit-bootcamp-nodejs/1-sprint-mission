"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../middleware/withAsync");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const userRouter = express_1.default.Router();
userRouter.post("/", (0, withAsync_1.withAsync)(userController_1.createUser));
userRouter.post("/login", (0, withAsync_1.withAsync)(userController_1.getUser));
userRouter.post("/token/refresh", auth_1.verifyRefreshToken, (0, withAsync_1.withAsync)(userController_1.refreshToken));
userRouter.get("/info", auth_1.verifyAccessToken, (0, withAsync_1.withAsync)(userController_1.getUserInfo));
userRouter.patch("/patch", auth_1.verifyAccessToken, (0, withAsync_1.withAsync)(userController_1.patchUser));
userRouter.patch("/pwdPatch", auth_1.verifyAccessToken, (0, withAsync_1.withAsync)(userController_1.patchUserPassword));
exports.default = userRouter;

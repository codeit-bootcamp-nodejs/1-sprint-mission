"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const usersController_1 = require("../controllers/usersController");
const auth_1 = require("../middlewares/auth");
const usersController_2 = require("../controllers/usersController");
const usersController_3 = require("../controllers/usersController");
const usersRouter = express_1.default.Router();
usersRouter.get('/me', auth_1.authenticate, (0, withAsync_1.withAsync)(usersController_1.getMyInfo));
usersRouter.patch('/me', auth_1.authenticate, (0, withAsync_1.withAsync)(usersController_1.updateMyInfo));
usersRouter.patch('/me/password', auth_1.authenticate, (0, withAsync_1.withAsync)(usersController_2.updateMyPassword));
usersRouter.get('/me/products', auth_1.authenticate, (0, withAsync_1.withAsync)(usersController_3.getMyProducts));
exports.default = usersRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../middleware/withAsync");
const commentsController_1 = require("../controllers/commentsController");
const auth_1 = require("../middleware/auth");
const commentsRouter = express_1.default.Router();
commentsRouter.patch("/:id", auth_1.verifyAccessToken, auth_1.verifyCommentAuth, (0, withAsync_1.withAsync)(commentsController_1.updateComment));
commentsRouter.delete("/:id", auth_1.verifyAccessToken, auth_1.verifyCommentAuth, (0, withAsync_1.withAsync)(commentsController_1.deleteComment));
exports.default = commentsRouter;

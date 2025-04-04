"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const articlesController_1 = require("../controllers/articlesController");
const auth_1 = require("../middlewares/auth");
const articlesRouter = express_1.default.Router();
articlesRouter.post('/', auth_1.authenticate, (0, withAsync_1.withAsync)(articlesController_1.createArticle));
articlesRouter.get('/', (0, withAsync_1.withAsync)(articlesController_1.getArticleList));
articlesRouter.get('/:id', (0, withAsync_1.withAsync)(articlesController_1.getArticle));
articlesRouter.patch('/:id', auth_1.authenticate, (0, withAsync_1.withAsync)(articlesController_1.updateArticle));
articlesRouter.delete('/:id', auth_1.authenticate, (0, withAsync_1.withAsync)(articlesController_1.deleteArticle));
articlesRouter.post('/:id/comments', auth_1.authenticate, (0, withAsync_1.withAsync)(articlesController_1.createComment));
articlesRouter.get('/:id/comments', (0, withAsync_1.withAsync)(articlesController_1.getCommentList));
exports.default = articlesRouter;

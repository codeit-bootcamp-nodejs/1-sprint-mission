"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withAsync_1 = require("../lib/withAsync");
const productsController_1 = require("../controllers/productsController");
const auth_1 = require("../middlewares/auth");
const productsRouter = express_1.default.Router();
productsRouter.post('/', auth_1.authenticate, (0, withAsync_1.withAsync)(productsController_1.createProduct));
productsRouter.get('/:id', (0, withAsync_1.withAsync)(productsController_1.getProduct));
productsRouter.patch('/:id', auth_1.authenticate, (0, withAsync_1.withAsync)(productsController_1.updateProduct));
productsRouter.delete('/:id', auth_1.authenticate, (0, withAsync_1.withAsync)(productsController_1.deleteProduct));
productsRouter.get('/', (0, withAsync_1.withAsync)(productsController_1.getProductList));
productsRouter.post('/:id/comments', auth_1.authenticate, (0, withAsync_1.withAsync)(productsController_1.createComment));
productsRouter.get('/:id/comments', (0, withAsync_1.withAsync)(productsController_1.getCommentList));
exports.default = productsRouter;

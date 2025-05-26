import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProuct,
  patchProduct,
} from "../controllers/productController";

import auth from "../lib/jwtAuth";
import { verifyProductAuth } from "../lib/tokenAuth";
import { catchHandler } from "../lib/catchHandler";

const productRoute = express.Router();

productRoute.get("/", auth.verifyAccessToken, catchHandler(getProuct));
productRoute.post("/", auth.verifyAccessToken, catchHandler(createProduct));
productRoute.get("/:id", catchHandler(getProductDetail));
productRoute.patch(
  "/:id",
  auth.verifyAccessToken,
  verifyProductAuth,
  catchHandler(patchProduct)
);
productRoute.delete(
  "/:id",
  auth.verifyAccessToken,
  verifyProductAuth,
  catchHandler(deleteProduct)
);

export default productRoute;

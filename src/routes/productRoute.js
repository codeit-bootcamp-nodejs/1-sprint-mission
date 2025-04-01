import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProuct,
  patchProduct,
} from "../controllers/productController.js";

import { verifyProductAuth } from "../lib/tokenAuth.js";

const productRoute = express.Router();

productRoute.get("/", getProuct);
productRoute.get("/user", getProuct);
productRoute.post("/", createProduct);
productRoute.get("/:id", getProductDetail);
productRoute.patch("/:id", verifyProductAuth, patchProduct);
productRoute.delete("/:id", verifyProductAuth, deleteProduct);

export default productRoute;

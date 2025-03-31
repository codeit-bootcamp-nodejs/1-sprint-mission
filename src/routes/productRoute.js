import express from "express";
import auth from "../middlewares/auth.js";
import productController from "../controllers/productController.js";

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(auth.verifyAccessToken, productController.createProduct);

router
  .route("/:id")
  .get(productController.getProductById)
  .patch(
    auth.verifyAccessToken,
    auth.verifyProductAuth,
    productController.updateProduct
  )
  .delete(
    auth.verifyAccessToken,
    auth.verifyProductAuth,
    productController.deleteProduct
  );

router
  .route("/:productId/favorite")
  .post(auth.verifyAccessToken, productController.toggleFavorite);

export default router;

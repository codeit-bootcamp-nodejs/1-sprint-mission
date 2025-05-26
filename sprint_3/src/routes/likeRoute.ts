import express from "express";
import { getLikedProducts, likeProduct } from "../controllers/likeController";
import auth from "../lib/jwtAuth";
import { catchHandler } from "../lib/catchHandler";

const likeRoute = express.Router();

likeRoute.get(
  "/products",
  auth.verifyAccessToken,
  catchHandler(getLikedProducts)
);
likeRoute.patch(
  "/products/:id",
  auth.verifyAccessToken,
  catchHandler(likeProduct)
);

export default likeRoute;

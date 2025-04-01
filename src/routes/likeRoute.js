import express from "express";
import {
  getLikedProducts,
  getLikedArticles,
  toggleLikeProduct,
  toggleLikeArticle,
} from "../controllers/likeController.js";

const likeRoute = express.Router();

// 유저가 좋아요를 선택한 상품 목록 조회
likeRoute.get("/products", getLikedProducts);

// 유저가 좋아요를 선택한 게시글 목록 조회
likeRoute.get("/articles", getLikedArticles);

// 상품에 좋아요 추가 또는 취소
likeRoute.patch("/products/:productId", toggleLikeProduct);

// 게시글에 좋아요 추가 또는 취소
likeRoute.patch("/articles/:articleId", toggleLikeArticle);

export default likeRoute;

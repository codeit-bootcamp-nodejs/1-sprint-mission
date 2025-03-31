import express from "express";
import auth from "../middlewares/auth.js";
import articleController from "../controllers/articleController.js";

const router = express.Router();

router
  .route("/")
  .get(articleController.getAllArticles)
  .post(auth.verifyAccessToken, articleController.createArticle);

router
  .route("/:id")
  .get(articleController.getArticleById)
  .patch(
    auth.verifyAccessToken,
    auth.verifyArticleAuth,
    articleController.updateArticle
  )
  .delete(
    auth.verifyAccessToken,
    auth.verifyArticleAuth,
    articleController.deleteArticle
  );

router
  .route("/:articleId/like")
  .post(auth.verifyAccessToken, articleController.toggleLike);

export default router;

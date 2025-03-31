import articleService from "../services/articleService.js";
import asyncHandler from "../utils/asyncHandler.js";

const getAllArticles = asyncHandler(async (req, res) => {
  const { offset, limit, order, search } = req.query;
  const articles = await articleService.getAllArticles({
    offset,
    limit,
    order,
    search,
  });
  res.status(200).send(articles);
});

const createArticle = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const articleData = req.body;

  const createdArticle = await articleService.createArticle(
    articleData,
    userId
  );

  res.status(200).send(createdArticle);
});

const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);

  if (!article) {
    return res.status(404).send({ message: "Article not found" });
  }

  res.status(200).send(article);
});

const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  const updatedArticle = await articleService.updateArticle(
    id,
    req.body,
    userId
  );
  res.status(200).send(updatedArticle);
});

const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;
  await articleService.deleteArticle(id, userId);
  res.status(200).send({ message: "Article deleted successfully" });
});

const toggleLike = asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { userId } = req.user;

  const likedArticle = await articleService.toggleLike(userId, articleId);

  res.status(200).json(likedArticle);
});

export default {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  toggleLike,
};

import { Request, Response } from "express";
import articleService from "../services/articleService";
import asyncHandler from "../utils/asyncHandler";

interface AuthedRequest extends Request {
  user: {
    id: string;
    userId: string;
  };
}

const getAllArticles = asyncHandler(async (req: Request, res: Response) => {
  const { offset, limit, search } = req.query as {
    offset?: string;
    limit?: string;
    order?: string;
    search?: string;
  };

  const order = req.query.order as "recent" | "oldest" | undefined;

  const articles = await articleService.getAllArticles({
    offset: offset ? parseInt(offset, 10) : undefined,
    limit: limit ? parseInt(limit, 10) : undefined,
    order,
    search,
  });

  res.status(200).send(articles);
});

const createArticle = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { userId } = req.user;
    const articleData = req.body;

    const createdArticle = await articleService.createArticle(
      articleData,
      userId
    );

    res.status(201).send(createdArticle);
  }
);

const getArticleById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const article = await articleService.getArticleById(id);

  if (!article) {
    res.status(404).send({ message: "Article not found" });
    return;
  }

  res.status(200).send(article);
});

const updateArticle = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user;
    const updatedArticle = await articleService.updateArticle(
      id,
      req.body,
      userId
    );
    res.status(200).send(updatedArticle);
  }
);

const deleteArticle = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user;
    await articleService.deleteArticle(id, userId);
    res.status(200).send({ message: "Article deleted successfully" });
  }
);

const toggleLike = asyncHandler(async (req: AuthedRequest, res: Response) => {
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

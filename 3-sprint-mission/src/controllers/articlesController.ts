import { Request, Response, NextFunction, RequestHandler } from "express";
import articleService from "../services/articleService";
import { jwtPayload, ArticleResponseDto } from "../dto/index";

export async function createArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const articleData = req.body;

    const newArticle = await articleService.createArticle(userId, articleData);

    const response: ArticleResponseDto = {
      id: newArticle.id,
      title: newArticle.title,
      content: newArticle.content,
      image: newArticle.image,
      createdAt: newArticle.createdAt,
      updatedAt: newArticle.updatedAt,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

export async function getArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const article = await articleService.getArticle(parseInt(id, 10));
    return res.send(article);
  } catch (error) {
    next(error);
  }
}

export async function updateArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedArticle = await articleService.updateArticle(
      parseInt(id, 10),
      updateData
    );
    return res.send(updatedArticle);
  } catch (error) {
    next(error);
  }
}

export async function deleteArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    await articleService.deleteArticle(userId);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getArticleList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const page = parseInt(String(req.query.page), 10) || 1;
    const pageSize = parseInt(String(req.query.pageSize), 10) || 10;
    const orderBy = String(req.query.orderBy || "");
    const keyword = String(req.query.keyword || "");

    const result = await articleService.getArticleList(
      page,
      pageSize,
      orderBy,
      keyword
    );

    return res.send(result);
  } catch (error) {
    next(error);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: articleId } = req.params;
    const { content } = req.body;
    const user = req.user as jwtPayload;
    const userId = user.id;

    const comment = await articleService.createComment(
      parseInt(articleId, 10),
      userId,
      content
    );

    return res.status(201).send(comment);
  } catch (error) {
    next(error);
  }
}

export async function getCommentList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const articleId = parseInt(req.params.id, 10);
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.limit as string, 10) || 10;
    const comments = await articleService.getCommentList(
      articleId,
      page,
      pageSize
    );

    return res.send({ list: comments });
  } catch (error) {
    next(error);
  }
}

export async function postArticleLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const articleId = parseInt(req.params.articleId, 10);

    const updatedArticle = await articleService.postArticlesLike(
      userId,
      articleId
    );

    return res.status(201).json(updatedArticle);
  } catch (error) {
    next(error);
  }
}

export async function deleteArticleLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const articleId = parseInt(req.params.articleId, 10);

    const updatedArticle = await articleService.deleteArticlesLike(
      userId,
      articleId
    );

    return res.status(200).json(updatedArticle);
  } catch (error) {
    next(error);
  }
}

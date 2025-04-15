import { Request, Response } from "express";
import { jwtPayload } from "../dto/index";
import commentService from "../services/commentService";
import productService from "../services/productService";
import { NextFunction } from "connect";

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const product = req.body;

    const newProduct = await productService.createProduct(userId, product);

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const productId = parseInt(req.params.id, 10);

    const product = await productService.getProduct(productId);

    return res.send(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10);
    const data = req.body;

    const updatedProduct = await productService.updateProduct(id, data);

    return res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;
    const id = parseInt(req.params.id, 10);

    await productService.removeProduct(id, userId);

    return res.status(200).send({ message: "deleted!" });
  } catch (error) {
    next(error);
  }
}

export async function getProductList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

  function isValidOrder(value: any): value is "recent" | "oldset" {
    return value === "recent" || value === "oldset";
  }

  const orderBy = isValidOrder(req.query.orderBy)
    ? req.query.orderBy
    : "recent";
  const keyword = req.query.orderBy as string;
  try {
    const result = await productService.getProductList(
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
    const productId = parseInt(req.params.id, 10);
    const { content } = req.body;
    const user = req.user as jwtPayload;
    const userId = user.id;

    const comment = await commentService.createComment(
      productId,
      content,
      userId
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
    const productId = parseInt(req.params.id, 10);
    const comments = await commentService.getComments(productId);
    return res.status(200).send(comments);
  } catch (error) {
    next(error);
  }
}

export async function postProductsLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user as jwtPayload;
  const userId = user.id;
  const productId = parseInt(req.params.id, 10);
  try {
    const like = await productService.addLike(userId, productId);
    return res.status(201).send(like);
  } catch (error) {
    next(error);
  }
}

// 유저정보를 가져온다 -> 상품id가져오기 -> 좋아요 버튼 -> 증가 -> productlikes에 유저,상품정보 업데이트
// 상품좋아요를 누른 유저들중에 로그인한 유저가 있다면 에러

export async function deleteProductsLike(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user as jwtPayload;
  const userId = user.id;
  const productId = parseInt(req.params.id, 10);

  try {
    const like = await productService.deleteLike(userId, productId);
    return res.status(201).send(like);
  } catch (error) {
    next(error);
  }
}

export async function getUserProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = parseInt(req.params.id, 10);
    const products = await productService.getUserProducts(userId);

    return res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
}

export async function getUserLikeProducts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as jwtPayload;
    const userId = user.id;

    const products = await productService.getUserLikeProducts(userId);
    return res.status(200).send(products);
  } catch (error) {
    next(error);
  }
}

import * as likeRepository from "../repositories/likeRepository.js";

export const getLikedProducts = async (userId) => {
  const likedProducts = await likeRepository.getLikedProducts(userId);
  return likedProducts;
};

export const getLikedArticles = async (userId) => {
  const likedArticles = await likeRepository.getLikedArticles(userId);
  return likedArticles.map((like) => like.article);
};

export const toggleLikeProduct = async (userId, productId) => {
  const isLiked = await likeRepository.getProductLikeStatus(userId, productId);

  if (isLiked) {
    await likeRepository.deleteLikeProduct(userId, productId);
  } else {
    await likeRepository.createLikeProduct(userId, productId);
  }
};

export const toggleLikeArticle = async (userId, articleId) => {
  const isLiked = await likeRepository.getArticleLikeStatus(userId, articleId);
  if (isLiked) {
    await likeRepository.deleteLikeArticle(userId, articleId);
  } else {
    await likeRepository.createLikeArticle(userId, articleId);
  }
};

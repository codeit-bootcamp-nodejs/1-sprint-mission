import likeRepository from "../repositories/likeRepository";

const getLikedProducts = async (userId: number) => {
  const likedProducts = await likeRepository.getLikedProducts(userId);
  return likedProducts;
};

const likeProduct = async (userId: number, productId: number) => {
  const isLiked = await likeRepository.likeProductStatus(userId, productId);

  if (isLiked) {
    await likeRepository.unLikeProduct(userId, productId);
  } else {
    await likeRepository.likeProduct(userId, productId);
  }
};

const findByProductId = async (productId: number) => {
  const likePeople = await likeRepository.likePeople(productId);
  return likePeople;
};

export default { getLikedProducts, findByProductId, likeProduct };


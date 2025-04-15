import likeService from "../services/likeService.js";

export const getLikedProducts = async (req, res) => {
  const userId = req.user.userId;
  const likedProducts = await likeService.getLikedProducts(userId);
  return res.status(200).send(likedProducts);
};

export const likeProduct = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;
  await likeService.likeProduct(userId, productId);

  return res.status(201).send({ message: "🫰🏻" });
};

// // 유저가 좋아요를 선택한 게시글 목록 조회
// export const getLikedArticles = async (req, res) => {
//   const userId = req.user.userId;
//   const likedArticles = await likeService.getLikedArticles(userId);
//   return res.status(200).send(likedArticles);
// };

// // 상품에 좋아요 추가 또는 취소
// export const toggleLikeProduct = async (req, res) => {
//   const userId = req.user.userId;
//   const { productId } = req.params;
//   await likeService.toggleLikeProduct(userId, productId);
//   return res.status(200).send({ message: "좋아요 상태가 변경되었습니다." });
// };

// // 게시글에 좋아요 추가 또는 취소
// export const toggleLikeArticle = async (req, res) => {
//   const userId = req.user.userId;
//   const { articleId } = req.params;
//   await likeService.toggleLikeArticle(userId, articleId);
//   return res.status(200).send({ message: "좋아요 상태가 변경되었습니다." });
// };

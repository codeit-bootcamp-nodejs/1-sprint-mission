import commentRepository from "../repositories/commentRepository.js";

export async function fetchComments() {
  return await commentRepository.getAll();
}

export async function addCommentToArticle(userId, commentData) {
  const newCommentData = {
    content: commentData.content,
    article: {
      connect: {
        id: commentData.articleId,
      },
    },
  };
  return await commentRepository.save(userId, newCommentData);
}

export async function addCommentToProduct(userId, commentData) {
  const newCommentData = {
    content: commentData.content,
    product: {
      connect: {
        id: commentData.productId,
      },
    },
  };
  return await commentRepository.save(userId, newCommentData);
}

export async function updateCommentById(commentId, updatedData) {
  return await commentRepository.update(commentId, updatedData);
}

export async function removeCommentById(commentId) {
  return await commentRepository.deleteById(commentId);
}

import commentRepository from "../repositories/commentRepository";

export async function fetchComments() {
  return await commentRepository.getMany();
}

export async function addCommentToArticle(
  userId: string,
  commentData: {
    content: string;
    articleId: string;
  }
) {
  const newCommentData = {
    content: commentData.content,
    article: {
      connect: {
        id: commentData.articleId,
      },
    },
  };
  return await commentRepository.save(Number(userId), newCommentData);
}

export async function addCommentToProduct(
  userId: string,
  commentData: {
    content: string;
    productId: string;
  }
) {
  const newCommentData = {
    content: commentData.content,
    product: {
      connect: {
        id: commentData.productId,
      },
    },
  };
  return await commentRepository.save(Number(userId), newCommentData);
}

export async function updateCommentById(
  commentId: string,
  updatedData: { content: string }
) {
  return await commentRepository.update(commentId, updatedData);
}

export async function removeCommentById(commentId: string) {
  return await commentRepository.deleteById(commentId);
}

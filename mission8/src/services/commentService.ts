import articleRepository from "../repositories/articleRepository";
import commentRepository from "../repositories/commentRepository";
import { createNotification } from "./notificationService";
import { emitNotification } from "./socketService";

export async function fetchComments() {
  return await commentRepository.getMany();
}

export async function addCommentToArticle(
  userId: number,
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
  const newComment = await commentRepository.save(
    Number(userId),
    newCommentData
  );
  const articleAuthor = await articleRepository.getArticleAuthorIdByArticleId(
    commentData.articleId
  );
  if (Number(userId) === articleAuthor) return newComment;

  await createNotification(articleAuthor, "comment");

  emitNotification(articleAuthor, {
    message: `New comment on your article`,
    type: "comment",
  });
  return newComment;
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
import commentRepository from "../repositories/commentRepository";
import productRepository from "../repositories/productRepository";
import productService from "./productService";

async function updateComment(id: number, content: string) {
  const existingComment = await commentRepository.getCommentById(id);
  if (!existingComment) {
    throw new Error("comment not found");
  }

  return await commentRepository.updateComment(id, content);
}

async function deleteComment(id: number) {
  const existingComment = await commentRepository.getCommentById(id);
  if (!existingComment) {
    throw new Error("comment not found");
  }

  await commentRepository.deleteComment(id);
}

async function createComment(
  productId: number,
  content: string,
  userId: number
) {
  const existingProduct = await productService.getProduct(productId);
  if (!existingProduct) {
    throw new Error("product not found");
  }
  return commentRepository.createComment(productId, content, userId);
}

async function getComments(productId: number) {
  const existingProduct = await productService.getProduct(productId);
  if (!existingProduct) {
    throw new Error("product not found");
  }
  return productRepository.getById(productId);
}

export default {
  updateComment,
  deleteComment,
  createComment,
  getComments,
};

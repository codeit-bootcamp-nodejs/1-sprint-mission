import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "./asyncHandler.js";

const router = express.Router();
const prisma = new PrismaClient();

router
  .post(
    "/product/:productId",
    asyncHandler(async (req, res) => {
      const { productId } = req.params;
      const { content } = req.body;
      const comment = await prisma.comment.create({
        data: {
          content,
          Product: { connect: { id: productId } }, // ✅ productId에 연결
        },
      });
      res.status(201).json(comment);
    })
  )
  .post(
    "/article/:articleId",
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { content } = req.body;
      const comment = await prisma.comment.create({
        data: {
          content,
          article: { connect: { id: articleId } }, // ✅ articleId에 연결
        },
      });
      res.status(201).json(comment);
    })
  )
  .get(
    "/product/:productId",
    asyncHandler(async (req, res) => {
      const { productId } = req.params; // ✅ params 오타 수정
      const { cursor } = req.query;
      const take = 10;

      const comments = await prisma.comment.findMany({
        where: { productId }, // ✅ 특정 productId만 필터링
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      res.status(200).json(comments);
    })
  )
  .get(
    "/article/:articleId",
    asyncHandler(async (req, res) => {
      const { articleId } = req.params;
      const { cursor } = req.query;
      const take = 10;

      const comments = await prisma.comment.findMany({
        where: { articleId }, // ✅ 특정 articleId만 필터링
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });

      res.status(200).json(comments);
    })
  );

router
  .patch(
    "/product/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content } = req.body;
      const updatedComment = await prisma.comment.update({
        where: { id },
        data: { content },
      });
      res.status(200).json(updatedComment);
    })
  )
  .patch(
    "/article/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content } = req.body;
      const updatedComment = await prisma.comment.update({
        where: { id },
        data: { content },
      });
      res.status(200).json(updatedComment);
    })
  )
  .delete(
    "/product/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.comment.delete({
        where: { id },
      });
      res.status(200).json({ message: "상품 댓글 삭제 완료" });
    })
  )
  .delete(
    "/article/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.comment.delete({
        where: { id },
      });
      res.status(200).json({ message: "게시글 댓글 삭제 완료" });
    })
  );

export default router;

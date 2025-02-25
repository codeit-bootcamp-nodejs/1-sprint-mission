import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateComment } from "../middlewares/validation.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", validateComment, async (req, res) => {
  try {
    const { content, productId, articleId } = req.body;
    const newComment = await prisma.comment.create({
      data: { content, productId, articleId },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "댓글 등록 중 오류가 발생했습니다." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { cursor, limit = 10, productId, articleId } = req.query;

    let where = {};
    if (productId) where.productId = Number(productId);
    if (articleId) where.articleId = Number(articleId);

    const comments = await prisma.comment.findMany({
      where,
      take: parseInt(limit),
      ...(cursor && { skip: 1, cursor: { id: Number(cursor) } }),
      orderBy: { createdAt: "desc" },
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "댓글 조회 중 오류가 발생했습니다." });
  }
});

router.patch("/:id", validateComment, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const existingComment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });
    if (!existingComment) {
      return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "댓글 수정 중 오류가 발생했습니다." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingComment = await prisma.comment.findUnique({
      where: { id: Number(id) },
    });
    if (!existingComment) {
      return res.status(404).json({ error: "해당 댓글을 찾을 수 없습니다." });
    }

    await prisma.comment.delete({ where: { id: Number(id) } });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "댓글 삭제 중 오류가 발생했습니다." });
  }
});

export default router;

import express from "express";
import prisma from "../prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.post(
  "/:productId",
  asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { productId } = req.params;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const comment = await prisma.productComment.create({
      data: { content, productId },
    });

    res.status(201).json(comment);
  })
);

router.get(
  "/:productId",
  asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.productComment.findMany({
      where: { productId },
      take: parseInt(limit),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const nextCursor =
      comments.length === parseInt(limit)
        ? comments[comments.length - 1].id
        : null;

    res.json({ comments, nextCursor });
  })
);

router.patch(
  "/:commentId",
  asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { commentId } = req.params;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const updatedComment = await prisma.productComment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json(updatedComment);
  })
);

router.delete(
  "/:commentId",
  asyncHandler(async (req, res) => {
    await prisma.productComment.delete({ where: { id: req.params.commentId } });
    res.json({ message: "Comment deleted" });
  })
);

export default router;

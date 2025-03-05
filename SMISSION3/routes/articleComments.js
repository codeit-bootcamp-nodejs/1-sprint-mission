import express from "express";
import prisma from "../prisma/prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

router.post(
  "/:articleId",
  asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { articleId } = req.params;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const comment = await prisma.articleComment.create({
      data: { content, articleId },
    });

    res.status(201).json(comment);
  })
);

router.get(
  "/:articleId",
  asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, limit = 10 } = req.query;

    const comments = await prisma.articleComment.findMany({
      where: { articleId },
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

    const updatedComment = await prisma.articleComment.update({
      where: { id: commentId },
      data: { content },
    });

    res.json(updatedComment);
  })
);

router.delete(
  "/:commentId",
  asyncHandler(async (req, res) => {
    await prisma.articleComment.delete({ where: { id: req.params.commentId } });
    res.json({ message: "Comment deleted" });
  })
);

export default router;

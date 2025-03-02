import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateComment, PatchComment } from "../struct.js";
import { assert } from "superstruct";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

["product", "article"].forEach((type) => {
  const key = type === "product" ? "productId" : "articleId";

  router
    .route(`/${type}/:${key}`)
    .get(
      asyncHandler(async (req, res) => {
        const id = req.params[key];
        const { cursor, limit = 10 } = req.query;
        const query = {
          where: { [key]: id },
          orderBy: { createdAt: "desc" },
          take: parseInt(limit),
        };

        if (cursor) {
          query.cursor = { id: cursor };
          query.skip = 1;
        }

        const comments = await prisma.comment.findMany({
          ...query,
          select: { id: true, content: true, createdAt: true },
        });

        res.status(200).send(comments);
      })
    )
    .post(
      asyncHandler(async (req, res) => {
        assert(req.body, CreateComment);
        const id = req.params[key];
        const { content } = req.body;
        const comment = await prisma.comment.create({
          data: { content, [key]: id },
        });

        res.status(200).send(comment);
      })
    );
});

["product", "article"].forEach((type) => {
  const key = type === "product" ? "productId" : "articleId";

  router
    .route(`/${type}/:${key}/:commentId`)
    .patch(
      asyncHandler(async (req, res) => {
        assert(req.body, PatchComment);
        const { commentId } = req.params;
        const { content } = req.body;
        const comment = await prisma.comment.update({
          where: { id: commentId },
          data: { content },
        });

        res.status(200).send(comment);
      })
    )
    .delete(
      asyncHandler(async (req, res) => {
        const { commentId } = req.params;
        await prisma.comment.delete({
          where: { id: commentId },
        });

        res.status(200).send({ message: "Comment deleted successfully" });
      })
    );
});

export default router;

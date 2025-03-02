import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateArticle, PatchArticle } from "../struct.js";
import { assert } from "superstruct";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        order = "recent",
        search = "",
      } = req.query;
      let orderBy = { createdAt: "desc" };

      if (order === "oldest") {
        orderBy = { createdAt: "asc" };
      }

      const articles = await prisma.article.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });

      res.status(200).send(articles);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const { title, content } = req.body;
      const article = await prisma.article.create({
        data: { title, content },
      });

      res.status(200).send(article);
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      });

      if (!article) {
        return res.status(404).send({ message: "Article not found" });
      }

      res.status(200).send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const { title, content } = req.body;
      const updatedArticle = await prisma.article.update({
        where: { id },
        data: { title, content },
      });

      res.status(200).send(updatedArticle);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });

      res.status(200).send({ message: "Article deleted successfully" });
    })
  );

export default router;

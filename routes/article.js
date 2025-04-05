import express from "express";
import asyncHandler from "../src/async-handler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateArticle, PatchArticle } from "../src/structs.js";

const prisma = new PrismaClient();
const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        order = "newest",
        title,
        content,
      } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
          orderBy = { createdAt: "desc" };
        default:
          orderBy = { createdAt: "desc" };
      }

      let where = {};
      if (title) {
        where.title = { contains: title, mode: "insensitive" };
      }
      if (content) {
        where.content = { contains: content, mode: "insensitive" };
      }

      const articles = await prisma.article.findMany({
        orderBy,
        where,
        skip: parseInt(offset),
        take: parseInt(limit),
        include: {
          comments: true,
        },
      });
      res.status(200).send(articles);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateArticle);
      const article = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(article);
    })
  );

articleRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUniqueOrThrow({
        where: { id },
        include: {
          comments: true,
        },
      });

      res.status(200).send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchArticle);
      const { id } = req.params;
      const article = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(article);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.status(204).send("Success delete");
    })
  );

export default articleRouter;

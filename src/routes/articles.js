import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import asyncHandler from "../middleWares/errorHandler.js";
import { CreateArticle, PatchArticle } from "../middleWares/structs.js";

const prisma = new PrismaClient();

const articleRoute = express.Router();

articleRoute
  .route("/detail")
  .get(asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = "newest", search = "" } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
      }
      const articles = await prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.status(200).send(articles);
    }))

articleRoute
  .route("/")
  .get(asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = "newest", search = "" } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
      }
      const articles = await prisma.article.findMany({
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
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.status(200).send(articles);
    }))
  .post(asyncHandler(async (req, res) => {
      assert(req.body,CreateArticle);
      const articles = await prisma.article.create({
        data: req.body,
      });
      res.status(201).send(articles);
    }))

articleRoute
  .route("/:id")
  .get(asyncHandler(async (req, res) => {
      const { id } = req.params;
      const articles = await prisma.article.findUnique({
        where: { id },
      });
      res.status(201).send(articles);
    }))
  .patch(asyncHandler(async (req, res) => {
      assert(req.body,PatchArticle);
      const { id } = req.params;
      const articles = await prisma.article.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(articles);
    }))
  .delete(asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    }))

export default articleRoute;
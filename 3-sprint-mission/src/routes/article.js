import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { asyncHandler } from "./asyncHandler.js";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

router
  .get(
    "/",
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        order = "recent",
        limit = 5,
        search = "",
      } = req.query;
      const orderBy =
        order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };
      const articles = await prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy,
        take: parseInt(limit),
        skip: parseInt(offset),
      });
      res.status(200).json(articles);
    })
  )
  .post(
    "/",
    asyncHandler(async (req, res) => {
      const { title, content } = req.body;
      const newArticle = await prisma.article.create({
        data: { title, content },
      });
      res.status(201).json(newArticle);
    })
  );

router
  .get(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await prisma.article.findUnique({
        where: { id },
        select: { id: true, title: true, content: true, createdAt: true },
      });
      console.log(article);
      res.status(200).json(article);
    })
  )
  .delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const deleteArticle = await prisma.article.delete({
        where: { id },
      });
      res.status(200).json({ message: "delete complete" });
    })
  )
  .patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { title, content } = req.body;
      const patchArticle = await prisma.article.update({
        where: { id },
        data: { title, content },
      });
      res.status(200).json(patchArticle);
    })
  );

export default router;

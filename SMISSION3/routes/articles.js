import express from "express";
import prisma from "../prisma/prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { validateArticle } from "../middlewares/validation.js";

const router = express.Router();

router.post(
  "/",
  validateArticle,
  asyncHandler(async (req, res) => {
    const article = await prisma.article.create({ data: req.body });
    res.status(201).json(article);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(articles);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id },
    });
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(article);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.article.delete({ where: { id: req.params.id } });
    res.json({ message: "Article deleted" });
  })
);

export default router;

import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateArticle } from "../structs.js";
import { validateArticle } from "../middlewares/validation.js";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", validateArticle, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newArticle = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시글 등록 중 오류가 발생했습니다." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { offset = 0, limit = 10, order = "recent", search = "" } = req.query;

    let orderBy;
    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
    }

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시글 목록 조회 중 오류가 발생했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }

    res.json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시글 조회 중 오류가 발생했습니다." });
  }
});

router.patch("/:id", validateArticle, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existingArticle = await prisma.article.findUnique({ where: { id } });

    if (!existingArticle) {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: title || existingArticle.title,
        content: content || existingArticle.content,
      },
    });

    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시글 수정 중 오류가 발생했습니다." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingArticle = await prisma.article.findUnique({ where: { id } });

    if (!existingArticle) {
      return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
    }

    await prisma.article.delete({ where: { id } });

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "게시글 삭제 중 오류가 발생했습니다." });
  }
});

export default router;

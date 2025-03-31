import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getArticleList(req, res) {
  const { offset = 0, limit = 10, order = "newest", search = "" } = req.query;

  let orderBy;
  switch (order) {
    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;
    case "newest":
      orderBy = {
        createdAt: "desc",
      };
      break;
  }

  const articles = await prisma.article.findMany({
    skip: Number(offset),
    take: Number(limit),
    orderBy,
    omit: {
      updatedAt: true,
    },
    where: {
      OR: [
        {
          title: {
            contains: search,
          },
        },
        {
          content: {
            contains: search,
          },
        },
      ],
    },
  });
  res.status(200).json(articles);
}

export async function postArticle(req, res) {
  const { title, content } = req.body;
  const article = await prisma.article.create({
    data: {
      title: title,
      content: content,
    },
  });
  res.status(201).json(article);
}

export async function patchArticle(req, res) {
  const { id } = req.params;
  const { title, content } = req.body;
  const article = await prisma.article.update({
    where: { id },
    data: {
      title: title,
      content: content,
    },
  });
  res.status(200).send(article);
}

export async function deleteArticle(req, res) {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id },
  });
  res.status(204).send("Success delete");
}

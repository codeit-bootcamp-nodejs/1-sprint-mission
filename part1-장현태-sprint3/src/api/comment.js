import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAritcleCommentList(req, res) {
  const { id } = req.params;
  const articleIds = await prisma.article.findMany({
    select: {
      id: true,
    },
  });

  const articleIdArray = articleIds.map((value) => value.id); //id값의 배열생성
  let comments;

  if (id) {
    comments = await prisma.comment.findMany({
      where: {
        id: {
          in: articleIdArray,
        },
      },
      cursor: {
        id: id,
      },
    });
  } else {
    comments = await prisma.comment.findMany({
      where: {
        id: {
          in: articleIdArray,
        },
      },
    });
  }

  res.status(200).json(comments);
}

export async function getProductCommentList(req, res) {
  const { id } = req.params;
  const productIds = await prisma.product.findMany({
    select: {
      id: true,
    },
  });

  const productIdArray = productIds.map((value) => value.id); //id값의 배열생성

  if (id) {
    const comments = await prisma.comment.findMany({
      where: {
        id: {
          in: productIdArray,
        },
      },
      cursor: {
        id: id,
      },
    });
  } else {
    const comments = await prisma.comment.findMany({
      where: {
        id: {
          in: productIdArray,
        },
      },
    });
  }

  res.status(200).json(comments);
}

export async function postCommentForArticle(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.comment.create({
    data: {
      content: content,
      articleId: id,
    },
  });
  res.status(201).json(comment);
}

export async function postCommentForProduct(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.comment.create({
    data: {
      content: content,
      productId: id,
    },
  });
  res.status(201).json(comment);
}

export async function patchComment(req, res) {
  const { id } = req.params;
  const { content } = req.body;
  const comment = await prisma.comment.update({
    where: { id },
    data: {
      content: content,
    },
  });
  res.status(200).send(comment);
}

export async function deleteComment(req, res) {
  const { id } = req.params;
  await prisma.comment.delete({
    where: { id },
  });
  res.status(204).send("Success delete");
}

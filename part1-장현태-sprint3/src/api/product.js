import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProductList(req, res) {
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

  const product = await prisma.product.findMany({
    skip: Number(offset),
    take: Number(limit),
    orderBy,
    omit: {
      updatedAt: true,
    },
    where: {
      OR: [
        {
          name: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ],
    },
  });
  res.status(200).json(product);
}

export async function postProduct(req, res) {
  const { name, description, price, tags } = req.body;
  const product = await prisma.product.create({
    data: {
      name: name,
      description: description,
      price: price,
      tags: tags,
    },
  });
  res.status(201).json(product);
}

export async function patchProduct(req, res) {
  const { name, description, price, tags } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: name,
      description: description,
      price: price,
      tags: tags,
    },
  });
  res.status(200).send(product);
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.status(204).send("Success delete");
}

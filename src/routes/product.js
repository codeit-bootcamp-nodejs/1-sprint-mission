import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    if (!name || !description || !price || !tags) {
      return res
        .status(400)
        .json({ error: "상품 정보를 모두 입력해야 합니다." });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "상품 등록 중 오류가 발생했습니다." });
  }
});

//일단 완성하고 다시 보기 get
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
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "상품 목록 조회 중 오류가 발생했습니다." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // URL에서 id 가져오기

    // Prisma를 사용해 해당 id의 상품 찾기
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // 상품이 존재하지 않을 경우 404 응답
    if (!product) {
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
    }

    // 상품 정보를 JSON으로 응답
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "상품 조회 중 오류가 발생했습니다." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price: price || existingProduct.price,
        tags: tags || existingProduct.tags,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "상품 수정 중 오류가 발생했습니다." });
  }
});

// 상품 삭제 API (DELETE /products/:id)
router.delete("/:id", async (req, res) => {
  // 나중에 구현할 코드
});

export default router;

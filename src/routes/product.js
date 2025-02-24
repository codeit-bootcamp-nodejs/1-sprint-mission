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

// 상품 목록 조회 API (GET /products)
router.get("/", async (req, res) => {
  // 나중에 구현할 코드
});

// 상품 상세 조회 API (GET /products/:id)
router.get("/:id", async (req, res) => {
  // 나중에 구현할 코드
});

// 상품 수정 API (PATCH /products/:id)
router.patch("/:id", async (req, res) => {
  // 나중에 구현할 코드
});

// 상품 삭제 API (DELETE /products/:id)
router.delete("/:id", async (req, res) => {
  // 나중에 구현할 코드
});

export default router;

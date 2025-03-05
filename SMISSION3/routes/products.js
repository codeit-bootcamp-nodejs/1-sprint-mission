import express from "express";
import prisma from "../prismaClient.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import { validateProduct } from "../middlewares/validation.js";

const router = express.Router();

router.post(
  "/",
  validateProduct,
  asyncHandler(async (req, res) => {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json(product);
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  })
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(product);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
  })
);

export default router;

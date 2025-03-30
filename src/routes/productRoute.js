import express from "express";
import { PrismaClient } from "@prisma/client";
import { CreateProduct, PatchProduct } from "../struct.js";
import { assert } from "superstruct";
import asyncHandler from "../utils/asyncHandler.js";

const prisma = new PrismaClient();
const router = express.Router();

router
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        order = "recent",
        search = "",
      } = req.query;
      let orderBy = { createdAt: "desc" };

      if (order === "oldest") {
        orderBy = { createdAt: "asc" };
      }

      const products = await prisma.product.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy,
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });

      res.status(200).send(products);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const { name, description, price, tags } = req.body;
      const product = await prisma.product.create({
        data: { name, description, price, tags },
      });

      res.status(201).send(product);
    })
  );

router
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
        },
      });

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      res.status(200).send(product);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);
      const { id } = req.params;
      const { name, description, price, tags } = req.body;
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { name, description, price, tags },
      });

      res.status(200).send(updatedProduct);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });

      res.status(200).send({ message: "Product deleted successfully" });
    })
  );

export default router;

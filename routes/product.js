import express from "express";
import asyncHandler from "../src/async-handler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateProduct, PatchProduct } from "../src/structs.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const {
        offset = 0,
        limit = 10,
        order = "newest",
        name,
        description,
      } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
          orderBy = { createdAt: "desc" };
        default:
          orderBy = { createdAt: "desc" };
      }

      let where = {};
      if (name) {
        where.name = { contains: name, mode: "insensitive" };
      }
      if (description) {
        where.description = { contains: description, mode: "insensitive" };
      }

      const products = await prisma.product.findMany({
        orderBy,
        where,
        skip: parseInt(offset),
        take: parseInt(limit),
        include: {
          comments: true,
        },
      });
      res.status(200).send(products);
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      req.body;
      const product = await prisma.product.create({
        data: req.body,
        include: {
          comments: true,
        },
      });
      res.status(201).send(product);
    })
  );

productRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUniqueOrThrow({
        where: { id },
        include: {
          comments: true,
        },
      });
      res.status(200).send(product);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);
      const { id } = req.params;
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(product);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });
      res.status(204).send("Success delete");
    })
  );

export default productRouter;

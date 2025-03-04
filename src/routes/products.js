import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import asyncHandler from "../middleWares/errorHandler.js";
import { CreateProduct, PatchProduct } from "../middleWares/structs.js";

const prisma = new PrismaClient();

const productRoute = express.Router();

productRoute
  .route("/")
  .get(asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = "newest", search = "" } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
      }
      const products = await prisma.product.findMany({
        where: {
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        },
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.status(200).send(products);
    }))
  .post(asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({
        data: req.body,
      });
      res.status(201).send(product);
    })
)

productRoute
  .route("/detail")
  .get(asyncHandler(async (req, res) => {
      const { offset = 0, limit = 10, order = "newest", search = "" } = req.query;
      let orderBy;
      switch (order) {
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        case "newest":
        default:
          orderBy = { createdAt: "desc" };
      }
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        },
        orderBy,
        skip: parseInt(offset),
        take: parseInt(limit),
      });
      res.status(200).send(products);
    }))

productRoute
 .route("/:id")
 .get(asyncHandler(async (req, res) => {
     const { id } = req.params;
     const products = await prisma.product.findUnique({
       where: { id },
     });
     res.status(201).send(products);
   }))
  .patch(asyncHandler(async (req, res) => {
      assert(req.body, PatchProduct);
      const { id } = req.params;
      const products = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(products);
    }))
  .delete(asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });
      res.sendStatus(204);
    }));

    export default productRoute;
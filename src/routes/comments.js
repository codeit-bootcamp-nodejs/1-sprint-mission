import express from "express";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import asyncHandler from "../middleWares/errorHandler.js";
import { CreateComment, PatchComment } from "../middleWares/structs.js";

const prisma = new PrismaClient();

const commentRoute = express.Router();

commentRoute
  .route("/detail")
  .get(asyncHandler(async (req, res) => {
      const comments = await prisma.comment.findMany();
      const count = await prisma.comment.count()
      res.send(comments);
      console.log(count);
    }))

commentRoute
  .route("/products")
  .get(asyncHandler(async (req, res) => {
      const { cursor, take = 5} = req.query;
      const lastId = cursor ? cursor : null;
      const comments = await prisma.comment.findMany({
        take: parseInt(take),
        ...(lastId && { cursor: {id: lastId }, skip: 1 }),
        orderBy: {
          id: "asc",
        },
        where: {
          articleId : null,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
  
      res.status(200).send({comments, nextCursor});
    }))

commentRoute
  .route("/articles")
  .get(asyncHandler(async (req, res) => {
      const { cursor, take = 5} = req.query;
      const lastId = cursor ? cursor : null;
      const comments = await prisma.comment.findMany({
        take: parseInt(take),
        ...(lastId && { cursor: {id: lastId }, skip: 1 }),
        orderBy: {
          id: "asc",
        },
        where: {
          productId : null,
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      });
      const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;
  
      res.status(200).send({comments, nextCursor});
    }))

commentRoute
  .route("/:id")
  .get(asyncHandler(async(req, res) => {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({
      where: { id }
    });
    res.status(200).send(comment);
  }))
  .patch(asyncHandler(async (req, res) => {
      assert(req.body, PatchComment);
      const { id } = req.params;
      const comments = await prisma.comment.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(comments);
    }))
  .delete(asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.comment.delete({
        where: { id },
      });
      res.sendStatus(204);
    }))

commentRoute
  .route("/products/:productId")
  .get(asyncHandler(async(req, res) => {
    const { productId } = req.params;
    const { cursor, take = 5 } = req.query;
    const lastId = cursor ? cursor : null ;
    const comment = await prisma.comment.findMany({
      take: parseInt(take),
      ...(lastId && { cursor: { id: lastId }, skip: 1}),
      orderBy: {
        id: "asc",
      },
      where: { productId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    const nextCursor = comment.length > 0 ? comment[comment.length -1].id : null;
    res.status(200).send({ comment, nextCursor });
  }))
  .post(asyncHandler(async (req, res) => {
      assert(req.body, CreateComment);
      const { productId } = req.params; 
      const { content } = req.body;
      const comments = await prisma.comment.create({
        data: {
          content,
          product: {
            connect: { id: productId }},
        }
      });
      res.status(201).send(comments);
    }))

commentRoute
  .route("/articles/:articleId")
  .get(asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { cursor, take = 5} = req.query;
    const lastId = cursor ? cursor : null;
    const comments = await prisma.comment.findMany({
      take: parseInt(take),
      ...(lastId && { cursor: {id: lastId }, skip: 1 }),
      orderBy: {
        id: "asc",
      },
      where: { articleId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    const nextCursor = comments.length > 0 ? comments[comments.length - 1].id : null;

    res.status(200).send({comments, nextCursor});
  }))
  .post(asyncHandler(async(req, res) => {
    assert(req.body,CreateComment);
    const { articleId } = req.params;
    const { content } = req.body;
    const comments = await prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: articleId },
        }
      }
    });
    res.status(201).send(comments);
  }))

export default commentRoute;
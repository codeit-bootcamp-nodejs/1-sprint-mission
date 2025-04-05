import express from "express";
import asyncHandler from "../src/async-handler.js";
import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";
import { CreateComment, PatchComment } from "../src/structs.js";

const prisma = new PrismaClient();
const commentRouter = express.Router();

commentRouter
  .route("/")
  .get(
    asyncHandler(async (req, res) => {
      const { cursor } = req.query;
      const take = 3;

      const comments = await prisma.comment.findMany({
        take: take,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        orderBy: {
          createdAt: "asc",
        },
      });

      const nextCursor =
        comments.length === take ? comments[take - 1].id : null;

      res.status(200).json({ comments, nextCursor });
    })
  )
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateComment);

      const comment = await prisma.comment.create({
        data: req.body,
      });
      res.status(201).send(comment);
    })
  );

commentRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const comment = await prisma.comment.findUniqueOrThrow({
        where: { id },
      });
      res.status(200).send(comment);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      assert(req.body, PatchComment);
      const { id } = req.params;

      const comment = await prisma.comment.update({
        where: { id },
        data: req.body,
      });
      res.status(201).send(comment);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.comment.delete({
        where: { id },
      });
      res.status(204).send("Success delete");
    })
  );

export default commentRouter;

import { IdParamsStruct } from "../../structs/commonStructs.js";
import { prismaClient } from "../prismaClient.js";
import { create } from "superstruct";

export const verifyComment = async (req, res, next) => {
  try {
    const { id: commentId } = create(req.params, IdParamsStruct);
    const { userId } = req.user;

    const comment = await prismaClient.comment.findUnique({
      where: { id: parseInt(commentId, 10) },
    });

    if (!comment) {
      const error = new Error("The Comment doesn't exist");
      error.code = 404;
      throw error;
    }
    if (comment.userId !== userId) {
      const error = new Error("The login user does not match the writer.");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (err) {
    console.error(err);
  }
};

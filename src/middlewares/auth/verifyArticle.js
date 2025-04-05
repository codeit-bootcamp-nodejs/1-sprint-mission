import { IdParamsStruct } from "../../structs/commonStructs.js";
import { prismaClient } from "../prismaClient.js";
import { create } from "superstruct";

export const verifyArticle = async (req, res, next) => {
  try {
    const { id: articleId } = create(req.params, IdParamsStruct);
    const { userId } = req.user;

    const article = await prismaClient.article.findUnique({
      where: { id: parseInt(articleId, 10) },
    });

    if (!article) {
      const error = new Error("The Article doesn't exist");
      error.code = 404;
      throw error;
    }
    if (article.userId !== userId) {
      const error = new Error("The login user does not match the writer.");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (err) {
    console.error(err);
  }
};

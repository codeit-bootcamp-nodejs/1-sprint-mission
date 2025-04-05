import { IdParamsStruct } from "../../structs/commonStructs.js";
import { prismaClient } from "../prismaClient.js";
import { create } from "superstruct";

export const verifyProduct = async (req, res, next) => {
  try {
    const { id: productId } = create(req.params, IdParamsStruct);
    const { userId } = req.user;

    const product = await prismaClient.product.findUnique({
      where: { id: parseInt(productId, 10) },
    });

    if (!product) {
      const error = new Error("The Product doesn't exist");
      error.code = 404;
      throw error;
    }
    if (product.userId !== userId) {
      const error = new Error("The login user does not match the writer.");
      error.code = 403;
      throw error;
    }

    return next();
  } catch (err) {
    console.error(err);
  }
};

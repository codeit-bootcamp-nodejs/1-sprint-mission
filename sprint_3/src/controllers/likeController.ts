import { RequestHandler } from "express";
import likeService from "../services/likeService";
import { create } from "superstruct";
import { IdParamsStruct } from "../structs/commonStruct";

export const getLikedProducts: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  const likedProducts = await likeService.getLikedProducts(userId);
  res.status(200).send(likedProducts);
};

export const likeProduct: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  console.log(req.params);
  const { id } = create(req.params, IdParamsStruct);
  await likeService.likeProduct(userId, id);

  res.status(201).send({ message: "🫰🏻" });
};

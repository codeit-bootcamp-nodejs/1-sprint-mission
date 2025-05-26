import { RequestHandler } from "express";
import UnauthorizedError from "../lib/error/UnauthorizedError";
import { create } from "superstruct";
import { IdParamsStruct } from "../structs/commonStruct";
import notificationService from "../services/notificationService";

export const readNotification: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    throw new UnauthorizedError();
  }

  const { id } = create(req.params, IdParamsStruct);
  const unReadCount = await notificationService.updateStatus(userId, id);
  res.status(201).send();
};

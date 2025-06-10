import { Request, Response } from "express";
import * as imageService from "../services/imageService";
import BadRequestError from "../lib/errors/BadRequestError";

export async function uploadImage(req: Request, res: Response) {
  console.log("파일업로드요청 도착");
  console.log("req.file:", req.file);

  if (!req.file) {
    throw new BadRequestError("File is required");
  }
  try {
    const result = await imageService.uploadImage(req.file);
    res.send(result);
  } catch (error) {
    console.error("업로드실패!:", error);
  }
}

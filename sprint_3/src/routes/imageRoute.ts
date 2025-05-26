import express from "express";
import { catchHandler } from "../lib/catchHandler";
import { upload, imageUpload } from "../controllers/imagesController";

const imagesRoute = express.Router();

imagesRoute.post("/upload", upload.single("image"), catchHandler(imageUpload));

export default imagesRoute;

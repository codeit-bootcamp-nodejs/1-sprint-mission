import express from "express";
import { catchHandler } from "../lib/catchHandler.js";
import { upload, imageUpload } from "../controllers/imagesController.js";

const imagesRoute = express.Router();

imagesRoute.post("/upload", upload.single("image"), catchHandler(imageUpload));

export default imagesRoute;

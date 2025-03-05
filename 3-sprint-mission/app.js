import express from "express";
import * as dotenv from "dotenv";
import pkg from "@prisma/client"; // default export로 가져오기
import cors from "cors";
import multer from "multer";

import productRouter from "./src/routes/products.js";
import articleRouter from "./src/routes/article.js";
import commentRouter from "./src/routes/comment.js";

const {
  PrismaClient,
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} = pkg;
const corsOption = {
  origin: "http://localhost:3000",
};

const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(cors(corsOption));
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comment", commentRouter);

const upload = multer({ dest: "uploads/" });

app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  res.json({ message: "file upload" });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server Started on ${process.env.PORT}!!`);
});

import express from "express";
import * as dotenv from "dotenv";
import commentRouter from "./src/routes/comment.js";
import articleRouter from "./src/routes/article.js";
import productRouter from "./src/routes/product.js";
import multer from "multer";
import cors from "cors";

dotenv.config();
const app = express();

const upload = multer({ dest: "./uploads" });

app.use(cors());
app.use(express.json());

app.use("/image", express.static("uploads"));
app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  const path = "/files/" + req.file.filename;
  res.json({ path });
});

app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/products", productRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

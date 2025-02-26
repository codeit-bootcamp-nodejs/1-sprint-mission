import express from "express";
import cors from "cors";
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import commentRouter from "./routes/comment.js";
import uploadRouter from "./routes/upload.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", uploadRouter);
app.use("/uploads", express.static("uploads"));

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/", commentRouter);
app.use(errorHandler);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

import express from "express";
import productRouter from "./routes/product.js";
import articleRouter from "./routes/article.js";
import commentRouter from "./routes/comment.js";

const app = express();
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.use("/comments", commentRouter);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

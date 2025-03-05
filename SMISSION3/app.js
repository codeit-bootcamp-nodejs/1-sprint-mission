import express from "express";
import cors from "cors";
import productRoutes from "./src/routes/products.js";
import articleRoutes from "./src/routes/articles.js";
import productCommentRoutes from "./src/routes/productComments.js";
import articleCommentRoutes from "./src/routes/articleComments.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/product-comments", productCommentRoutes);
app.use("/article-comments", articleCommentRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// mongoose.connect("mongodb://localhost:27017/used_market", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Article = mongoose.model("Article", articleSchema);

// 에러 핸들러 미들웨어
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
};

// 상품 등록 API
app.post("/products", async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = new Product({ name, description, price, tags });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 상세 조회 API
app.get("/products/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).select("-updatedAt");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 수정 API
app.patch("/products/:id", async (req, res, next) => {
  try {
    const updates = req.body;
    updates.updatedAt = Date.now();
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// 상품 삭제 API
app.delete("/products/:id", async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// 상품 목록 조회 API
app.get("/products", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
    const skip = (page - 1) * limit;
    const sortOption = sort === "recent" ? { createdAt: -1 } : {};
    const searchQuery = search
      ? {
          $or: [
            { name: new RegExp(search, "i") },
            { description: new RegExp(search, "i") },
          ],
        }
      : {};

    const products = await Product.find(searchQuery)
      .sort(sortOption)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select("id name price createdAt");

    res.json(products);
  } catch (error) {
    next(error);
  }
});

// 게시글 등록 API
app.post("/articles", async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const article = new Article({ title, content });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    next(error);
  }
});

// 게시글 상세 조회 API
app.get("/articles/:id", async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id).select("-updatedAt");
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (error) {
    next(error);
  }
});

// 게시글 수정 API
app.patch("/articles/:id", async (req, res, next) => {
  try {
    const updates = req.body;
    updates.updatedAt = Date.now();
    const article = await Article.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.json(article);
  } catch (error) {
    next(error);
  }
});

// 게시글 삭제 API
app.delete("/articles/:id", async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: "Article not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// 게시글 목록 조회 API
app.get("/articles", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "recent", search = "" } = req.query;
    const skip = (page - 1) * limit;
    const sortOption = sort === "recent" ? { createdAt: -1 } : {};
    const searchQuery = search
      ? {
          $or: [
            { title: new RegExp(search, "i") },
            { content: new RegExp(search, "i") },
          ],
        }
      : {};

    const articles = await Article.find(searchQuery)
      .sort(sortOption)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select("id title content createdAt");

    res.json(articles);
  } catch (error) {
    next(error);
  }
});

// 에러 핸들러 미들웨어 사용
app.use(errorHandler);

app.listen(3000, () => console.log("Server running on port 3000"));

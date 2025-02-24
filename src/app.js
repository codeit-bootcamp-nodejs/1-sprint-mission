import express from "express";
import productRouter from "./routes/product.js";

const app = express();
app.use(express.json()); // JSON 데이터를 받기 위한 미들웨어 추가

app.use("/products", productRouter);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});

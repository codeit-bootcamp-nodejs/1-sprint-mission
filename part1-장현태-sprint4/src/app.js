import express from "express";
import * as dotenv from "dotenv";
import commentRouter from "./routers/comment.js";
import articleRouter from "./routers/article.js";
import productRouter from "./routers/product.js";
import userRouter from "./routers/user.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

import express from "express";
import * as dotenv from "dotenv";
import commentRouter from "./routers/comment";
import articleRouter from "./routers/article";
import productRouter from "./routers/product";
import userRouter from "./routers/user";
import { errorHandler } from "./middleware/errorHandler";
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

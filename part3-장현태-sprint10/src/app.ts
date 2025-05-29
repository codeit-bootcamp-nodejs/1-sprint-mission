import express from "express";
import * as dotenv from "dotenv";
import commentRouter from "./routers/commentRouter";
import articleRouter from "./routers/articleRouter";
import productRouter from "./routers/productRouter";
import userRouter from "./routers/userRouter";
import notificationRouter from "./routers/notificationRouter";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/notifications", notificationRouter);

app.use(errorHandler);

export default app;

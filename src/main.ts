=import express from "express";
import * as dotenv from "dotenv";
import commentRouter from "./routers/comment";
import articleRouter from "./routers/article";
import productRouter from "./routers/product";
import userRouter from "./routers/user";
import notificationRouter from "./routers/notification";
import { errorHandler } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import http from "http";
import { createSocketServer } from "./services/socketService";

dotenv.config();
const app = express();
const server = http.createServer(app);
createSocketServer(server);

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/articles", articleRouter);
app.use("/comments", commentRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/notifications", notificationRouter);

app.use(errorHandler);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
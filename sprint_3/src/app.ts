import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import cookieParser from "cookie-parser";
import { PUBLIC_PATH, STATIC_PATH } from "./lib/constants";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import articleRoute from "./routes/articleRoute";
import commentRoute from "./routes/commentRoute";
import imagesRoute from "./routes/imageRoute";
import {
  defaultNotFoundHandler,
  globalErrorHandler,
} from "./controllers/errorController";
import auth from "./lib/jwtAuth";
import likeRoute from "./routes/likeRoute";
import { setWebSocket } from "./services/websocket";

export const app = express();
export const server = http.createServer(app);

setWebSocket(server);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/articles", articleRoute);
app.use("/comments", auth.verifyAccessToken, commentRoute);
app.use("/likes", auth.verifyAccessToken, likeRoute);
app.use("/images", imagesRoute);

app.use(defaultNotFoundHandler);
app.use(globalErrorHandler);

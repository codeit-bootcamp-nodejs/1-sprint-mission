import express from "express";
import cors from "cors";
import path from "path";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./lib/constants";
import articlesRouter from "./routes/articlesRouter";
import productsRouter from "./routes/productsRouter";
import commentsRouter from "./routes/commentsRouter";
import userRouter from "./routes/userRouter";

import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/articles", articlesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

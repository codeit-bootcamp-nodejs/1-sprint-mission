import express from "express";
import cors from "cors";
import path from "path";
import { PORT, PUBLIC_PATH, STATIC_PATH } from "./src/lib/constants.js";
import articlesRouter from "./src/routes/articlesRouter.js";
import productsRouter from "./src/routes/productsRouter.js";
import commentsRouter from "./src/routes/commentsRouter.js";
import imagesRouter from "./src/routes/imagesRouter.js";
import userRouter from "./src/routes/userRouter.js";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(STATIC_PATH, express.static(path.resolve(process.cwd(), PUBLIC_PATH)));

app.use("/articles", articlesRouter);
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);
app.use("/images", imagesRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

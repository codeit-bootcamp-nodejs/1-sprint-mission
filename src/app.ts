import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";

import productRoute from "./routes/productRoute";
import articleRoute from "./routes/articleRoute";
import commentRoute from "./routes/commentRoute";
import userRoute from "./routes/userRoute";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", userRoute);
app.use("/product", productRoute);
app.use("/article", articleRoute);
app.use("/comment", commentRoute);

const upload = multer({ dest: path.join(__dirname, "../uploads") });
app.use("/files", express.static(path.join(__dirname, "../uploads")));

app.post(
  "/files",
  upload.single("attachment"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

    const filePath = `/files/${req.file.filename}`;
    res.status(200).json({ path: filePath });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

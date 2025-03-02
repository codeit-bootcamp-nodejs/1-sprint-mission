import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const upload = multer({ dest: "./uploads" });
app.use("/files", express.static("uploads"));

app.post("/files", upload.single("attachment"), (req, res) => {
  console.log(req.file);
  const path = `/files/${req.file.filename}`;
  res.json({ path });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server starting on ${process.env.PORT}`);
});

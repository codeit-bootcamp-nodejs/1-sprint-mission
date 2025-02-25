import express from "express";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("attachment"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일 업로드에 실패했습니다." });
  }

  res.json({
    message: "파일 업로드 완료",
    filePath: `/uploads/${req.file.filename}`,
  });
});

export default router;

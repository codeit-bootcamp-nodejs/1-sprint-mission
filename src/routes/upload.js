import express from "express";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post("/", upload.single("attachment"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "파일 업로드에 실패했습니다." });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/files/${
      req.file.filename
    }`;

    res.status(201).json({
      message: "파일 업로드 완료",
      fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "파일 업로드 중 오류가 발생했습니다." });
  }
});

export default router;

import express from "express";
import imageMiddleware from "../middleware/image.js";
import multer from "multer";

const app = express();
const upload = multer({ dest: "./uploads" });
app.use(imageMiddleware);

const uploadRouter = express.Router();

uploadRouter.use("/", express.static("./uploads"));
uploadRouter.route("/").post(upload.single("attachment"), (req, res) => {
  console.log(req.file);
  const path = `/files/${req.file.filename}`;
  res.json({ path, message: "파일 업로드 완료" });
});

export default uploadRouter;

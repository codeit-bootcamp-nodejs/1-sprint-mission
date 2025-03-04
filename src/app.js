import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import productRoute from "./routes/products.js"
import articleRoute from "./routes/articles.js";
import commentRoute from "./routes/comments.js";

dotenv.config();

const app = express();

app.use('/files',express.static('upload'));

app.use(cors());
app.use(express.json());

app.use("/products", productRoute);
app.use("/articles", articleRoute);
app.use("/comments", commentRoute);

const upload = multer({ dest: 'upload/'});

app.post('/files', upload.single('attachment'), (req, res) => {
  const path = `/files/${req.file.filename}`
  res.json({ path });
})

app.listen(3000, () => {
  console.log("Server is listening on PORT ");
});

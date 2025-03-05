export const validateProduct = (req, res, next) => {
  const { name, description, price, tags } = req.body;
  if (!name || !description || price == null) {
    return res
      .status(400)
      .json({ error: "Name, description, and price are required" });
  }
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({ error: "Price must be a positive number" });
  }
  next();
};

export const validateArticle = (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }
  next();
};

export const validateComment = (req, res, next) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Comment content is required" });
  }
  next();
};

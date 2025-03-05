import { CreateProduct } from "../../struct.js";

export const validateProduct = (req, res, next) => {
  const [error] = CreateProduct.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  next();
};

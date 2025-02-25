import { body, validationResult } from "express-validator";

export const validateProduct = [
  body("name").notEmpty().withMessage("상품명을 입력하세요."),
  body("description").notEmpty().withMessage("설명을 입력하세요."),
  body("price").isNumeric().withMessage("가격은 숫자여야 합니다."),
  body("tags").isArray().withMessage("태그는 배열이어야 합니다."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateArticle = [
  body("title").notEmpty().withMessage("제목을 입력하세요."),
  body("content").notEmpty().withMessage("내용을 입력하세요."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const validateComment = [
  body("content").notEmpty().withMessage("댓글 내용을 입력하세요."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

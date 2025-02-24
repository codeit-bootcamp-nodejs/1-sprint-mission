export const PRODUCTS = [
  {
    id: "1234",
    name: "휴지",
    description: "두루마리",
    price: 200,
    tags: ["생활용품"],
  },
  {
    id: "2345",
    name: "시계",
    description: "군대에서 썼던 시계",
    price: 25000,
    tags: ["생활용품", "사치품"],
  },
];

export const ARTICLES = [
  {
    id: "3456",
    title: "군대갈 때 참고사항",
    content: "참고해라 그냥 ㅋㅋ",
  },
  {
    id: "4567",
    title: "코딩 잘해지는 법",
    content: "코드잇 스프린트 수강",
  },
];

export const COMMENTS = [
  {
    content: "휴지가 거칠어요.",
    productId: "1234",
    articleId: null,
  },
  {
    content: "시계 너무 오래썼다.",
    productId: "2345",
    articleId: null,
  },
  {
    content: "좋은 글 감사합니다!",
    productId: null,
    articleId: "3456",
  },
];

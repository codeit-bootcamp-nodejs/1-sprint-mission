import bcrypt from "bcrypt";
const hashedPassword = await bcrypt.hash("password1", 10);

export const users = [
  {
    id: 1,
    email: "user1@example.com",
    nickname: "닉네임1",
    image: null,
    password: hashedPassword,
    createdAt: new Date("2023-07-14T09:00:00Z"),
    updatedAt: new Date("2023-07-14T09:00:00Z"),
  },
  {
    id: 2,
    email: "user2@example.com",
    nickname: "닉네임2",
    image: null,
    password: hashedPassword,
    createdAt: new Date("2023-07-14T09:05:00Z"),
    updatedAt: new Date("2023-07-14T09:05:00Z"),
  },
  {
    id: 3,
    email: "user3@example.com",
    nickname: "닉네임3",
    image: null,
    password: hashedPassword,
    createdAt: new Date("2023-07-14T09:05:00Z"),
    updatedAt: new Date("2023-07-14T09:05:00Z"),
  },
];

export const products = [
  {
    id: 1,
    name: "소니 WH-1000XM5 무선 헤드폰",
    description: "소니의 WH-1000XM5는...",
    price: 450000,
    tags: ["ELECTRONICS"],
    images: [],
    userId: 1,
    createdAt: new Date("2023-07-14T10:00:00Z"),
    updatedAt: new Date("2023-07-14T10:00:00Z"),
  },
  {
    id: 2,
    name: "샤오미 미 밴드 7",
    description: "샤오미 미 밴드 7은...",
    price: 35000,
    tags: ["ELECTRONICS"],
    images: [],
    userId: 1,
    createdAt: new Date("2023-07-14T10:30:00Z"),
    updatedAt: new Date("2023-07-14T10:30:00Z"),
  },
];

export const articles = [
  {
    id: 1,
    title: "첫번째",
    content: "콘텐추",
    image: null,
    userId: 1,
    createdAt: new Date("2025-02-19T07:20:54.019Z"),
    updatedAt: new Date("2025-02-19T07:20:21.453Z"),
  },
  {
    id: 2,
    title: "두번째",
    content: "아티클",
    image: null,
    userId: 2,
    createdAt: new Date("2025-02-19T07:20:20.316Z"),
    updatedAt: new Date("2025-02-19T07:19:26.815Z"),
  },
];

export const comments = [
  {
    id: 1,
    content: "좋은 상품이네요!",
    productId: 1,
    articleId: null,
    userId: 2,
    createdAt: new Date("2025-02-20T12:00:00Z"),
    updatedAt: new Date("2025-02-20T12:00:00Z"),
  },
  {
    id: 2,
    content: "기사 잘 봤어요!",
    productId: null,
    articleId: 1,
    userId: 2,
    createdAt: new Date("2025-02-20T12:10:00Z"),
    updatedAt: new Date("2025-02-20T12:10:00Z"),
  },
];

export const likes = [
  {
    id: 1,
    articleId: 1,
    userId: 2,
    createdAt: new Date("2025-02-20T12:30:00Z"),
    updatedAt: new Date("2025-02-20T12:30:00Z"),
  },
];

export const favorites = [
  {
    id: 1,
    productId: 1,
    userId: 2,
    createdAt: new Date("2025-02-20T12:35:00Z"),
    updatedAt: new Date("2025-02-20T12:35:00Z"),
  },
  {
    id: 2,
    productId: 1,
    userId: 3,
    createdAt: new Date("2025-02-20T12:35:00Z"),
    updatedAt: new Date("2025-02-20T12:35:00Z"),
  },
];

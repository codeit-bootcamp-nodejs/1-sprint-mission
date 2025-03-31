export const USERS = [
  {
    id: "d3b07384-d113-452f-9a53-bf3144b11b11",
    email: "user1@example.com",
    nickname: "UserOne",
    image: null,
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "e99a18c4-31e6-4b2a-bcc3-ff9a2e2b86b6",
    email: "user2@example.com",
    nickname: "UserTwo",
    image: null,
    password: "password123",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PRODUCTS = [
  {
    id: "f7f3a340-4e47-4a87-b72b-4479f989b9b4",
    name: "Product 1",
    description: "A cool product",
    price: 29.99,
    tags: ["tag1", "tag2"],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[0].id,
  },
  {
    id: "be7f0178-5c7f-47c7-b50a-eaff1f4a1eb8",
    name: "Product 2",
    description: "Another awesome product",
    price: 49.99,
    tags: ["tag3", "tag4"],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[1].id,
  },
];

export const ARTICLES = [
  {
    id: "1f8b1e58-6f50-4003-bb66-25e9e31e71ff",
    title: "First Article",
    content: "Content of the first article",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[0].id,
  },
  {
    id: "d28e3c11-93e6-42ac-bf56-d1fcb7391d73",
    title: "Second Article",
    content: "Content of the second article",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[1].id,
  },
];

export const COMMENTS = [
  {
    id: "1b30d3c8-dabe-48c5-b5a0-b7efcc8f529e",
    content: "Great product!",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[0].id,
    productId: PRODUCTS[0].id,
    articleId: null,
  },
  {
    id: "3e2a8bc5-5f74-4a8c-b60f-b6d155f2a39c",
    content: "Very informative article.",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[1].id,
    productId: null,
    articleId: ARTICLES[0].id,
  },
  {
    id: "a62f8f96-6f82-4423-91d3-460b92880f0b",
    content: "Nice features.",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: USERS[0].id,
    productId: PRODUCTS[1].id,
    articleId: null,
  },
];

export const FAVORITES = [
  {
    id: "aa11bb22-cc33-dd44-ee55-ff66778899aa",
    userId: USERS[0].id,
    productId: PRODUCTS[0].id,
  },
  {
    id: "bb22cc33-dd44-ee55-ff66-778899aabbcc",
    userId: USERS[1].id,
    productId: PRODUCTS[1].id,
  },
];

export const LIKES = [
  {
    id: "cc11dd22-ee33-ff44-gg55-hh66778899aa",
    userId: USERS[0].id,
    articleId: ARTICLES[0].id,
  },
  {
    id: "dd22ee33-ff44-gg55-hh66-778899bbccdd",
    userId: USERS[1].id,
    articleId: ARTICLES[1].id,
  },
];

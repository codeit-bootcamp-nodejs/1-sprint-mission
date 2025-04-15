import articleService from "./ArticleService.js";
import productService from "./ProductService.js";

class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = favoriteCount;
  }

  set favoriteCount(Count) {
    throw new Error("call favorite()");
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  favorite() {
    this._favoriteCount += 1;
  }
}

class ElectronicProduct extends Product {
  constructor(name, description, price, tags, favoriteCount = 0, manufactuer) {
    super(name, description, price, tags, favoriteCount);
    this.manufactuer = manufactuer;
  }
}

class Article {
  constructor(title, content, writer, likeCount = 0, createdAt) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this._likeCount = likeCount;
    this.createdAt = new Date();
  }

  set likeCount(count) {
    throw new Error("call like()");
  }

  get likeCount() {
    return this._likeCount;
  }

  like() {
    this._likeCount += 1;
  }
}

console.log("=== Product 배열 ===");
const getProductListRes = await productService.getProductList(1, 10, "삼성");
const products = getProductListRes.list.map((element) => {
  let product;
  if (element.tags.includes("전자제품")) {
    product = new ElectronicProduct(
      element.name,
      element.description,
      element.price,
      element.tags,
      element.images,
    );
  } else {
    product = new Product(
      element.name,
      element.description,
      element.price,
      element.tags,
      element.images,
    );
  }
  product.favorite();
  return product;
});

console.log(products);

console.log("=== Product POST ===");
const createProductRes = await productService.createProduct(
  "삼성 노트북",
  "3월 대학생 할인",
  1000000,
  ["전자제품", "삼성"],
  "https://www.naver.com/blog",
);
console.log(createProductRes);

console.log("=== Product PATCH ===");
const patchProductRes = await productService.patchProduct(createProductRes.id, {
  name: "LG 그램",
  description: "3월 신상품 출시",
  price: 10000000,
  tags: "LG",
  images: "https://www.google.com/images",
});
console.log(patchProductRes);

console.log("=== Prodect get ===");
const getProductRes = await productService.getProduct(patchProductRes.id);
console.log(getProductRes);

console.log("=== Product Delete ===");
const deleteProductRes = await productService.deleteProduct(patchProductRes.id);
console.log(deleteProductRes);

console.log("=== Article 배열 ===");
const getArticleListRes = await articleService.getArticleList(1, 10);
const articles = getArticleListRes.list.map((element) => {
  const article = new Article(element.title, element.content);
  article.like();
  return article;
});
console.log(articles);
console.log(Article.createdAt);

console.log("=== Article POST ===");
const createArticleRes = await articleService.creatArticle(
  "시작",
  "오늘도 힘차게!",
  "https://www.naver.com/images",
);
console.log(createArticleRes);

console.log("=== Article Patch ===");
const patchArticleRes = await articleService.patchArticle(createArticleRes.id, {
  title: "끝",
  content: "고생하셨습니다.",
});
console.log(patchArticleRes);

console.log("=== Article Get ===");
const getArticleRes = await articleService.getArticle(patchArticleRes.id);
console.log(getArticleRes);

console.log("=== Aricle Delete ===");
const deleteArticleRes = await articleService.deleteArticle(patchArticleRes.id);
console.log(deleteArticleRes);

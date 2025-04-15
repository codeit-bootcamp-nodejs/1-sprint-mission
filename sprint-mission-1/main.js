import productService from "./productService.js";
import articleService from "./articleService.js";

// Product 클래스
class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = favoriteCount;
  }

  set favoriteCount(count) {
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
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount = 0,
    manufacturer = null
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

// Article 클래스
class Article {
  constructor(title, content, writer = "", likeCount = 0) {
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

// product 검증
console.log("=== Product 검증 ===");
const getProductListRes = await productService.getProductList(1, 10, "맥북");
const products = getProductListRes.data.list.map((element) => {
  let product;
  if (element.tags.includes("전자제품")) {
    product = new ElectronicProduct(
      element.name,
      element.description,
      element.price,
      element.tags,
      element.images
    );
  } else {
    product = new Product(
      element.name,
      element.description,
      element.price,
      element.tags,
      element.images
    );
  }
  product.favorite();
  return product;
});
console.log(products);

console.log("=== createProduct ====");
const createProductRes = await productService.createProduct(
  "MacBook",
  "MacBook desc",
  1000000,
  ["전자제품"],
  ["https://example.com/images/1"]
);
console.log(createProductRes.data);

console.log("=== getProduct ===");
const productId = createProductRes.data.id;
const getProductRes = await productService.getProduct(productId);
console.log(getProductRes.data);

console.log("=== patchProduct ===");
const patchProductRes = await productService.patchProduct(
  productId,
  "MacBook Pro Update",
  "MacBook Pro Description Update",
  2000000,
  ["전자제품", "애플"],
  ["https://example.com/images/2"]
);
console.log(patchProductRes.data);

console.log("=== deleteProduct ===");
const deleteProductRes = await productService.deleteProduct(productId);
console.log(deleteProductRes.data);

// article 검증
console.log("=== Article 검증 ===");
const getArticleListRes = await articleService.getArticleList(1, 10);
const articles = getArticleListRes.data.list.map((element) => {
  const article = new Article(element.title, element.content);
  article.like();
  article.like();
  return article;
});
console.log(articles);

console.log("=== createArticle ===");
const createArticleRes = await articleService.createArticle(
  "게시글 제목 1",
  "게시글 내용 1",
  "https://example.com/images/1"
);
console.log(createArticleRes.data);
const articleId = createArticleRes.data.id;

console.log("=== getArticle ===");
const getArticleRes = await articleService.getArticle(articleId);
console.log(getArticleRes.data);

console.log("=== patchArticle ===");
const patchArticleRes = await articleService.patchArticle(
  articleId,
  "게시글 제목 1 수정",
  "게시글 내용 1 수정",
  "https://example.com/images/2"
);
console.log(patchArticleRes.data);

console.log("=== deleteArticle ===");
const deleteArticleRes = await articleService.deleteArticle(articleId);
console.log(deleteArticleRes.data);

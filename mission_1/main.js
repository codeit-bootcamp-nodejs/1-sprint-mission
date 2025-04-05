import {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
} from "./ProductService.js";

import {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
} from "./ArticleService.js";

/* ======================= Product 클래스 생성 ======================= */

class Product {
  constructor(name, description, price, tags, images) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = 0;
  }

  favorite() {
    this._favoriteCount += 1;
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  set favoriteCount(value) {
    throw new Error("좋아요는 수정할 수 없습니다.");
  }
}

/* =================== ElectronicProduct 클래스 생성 =================== */

class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    manufacturer,
    favoriteCount
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

/* ======================= Article 클래스 생성 ======================= */

class Article {
  constructor(title, content, writer, likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this._likeCount = likeCount;
    this.createdAt = new Date();
  }

  like() {
    this._likeCount += 1;
  }

  get likeCount() {
    return this._likeCount;
  }

  set likeCount(value) {
    throw new Error("좋아요는 수정할 수 없습니다.");
  }
}

/* ========================= Product 인스턴스 생성 ========================= */
console.log("========== getProductList ==========");
const getProductListRes = await getProductList(1, 10, "");

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

console.log("========== createProduct ==========");
const createProductRes = await createProduct(
  "뉴맥북에어",
  "16GB RAM, 512GB",
  1990000,
  ["전자제품"],
  ["https://apple.macbook.coopang.kr"]
);
console.log(createProductRes.data);

console.log("========== productId ==========");
const productId = createProductRes.data.id;
console.log(productId);

console.log("========== getProduct ==========");
const getProductRes = await getProduct(productId);
console.log(getProductRes.data);

console.log("========== patchProduct ==========");
const patchProductRes = await patchProduct(
  productId,
  "구형맥북에어",
  "구형특별할인행사",
  1000000,
  ["전자제품"],
  ["https://apple3453.co.kr"]
);
console.log(patchProductRes.data);

console.log("========== deleteProduct ==========");
const deleteProductRes = await deleteProduct(productId);
console.log(deleteProductRes.data);

/* ========================= Article 인스턴스 생성 ========================= */

console.log("========== getArticleList ==========");
const getArticleListRes = await getArticleList(1, 10, "");

const articles = getArticleListRes.data.list.map((element) => {
  const article = new Article(element.title, element.content, element.writer);
  return article;
});
console.log(articles);

console.log("========== createArticleList ==========");
const createArticleRes = await createArticle(
  "개발자가 되는방법",
  "직업소개서",
  "https://whatshouldidotobecomeadeveloper.how"
);
console.log(createArticleRes.data);

console.log("========== articleID ==========");
const articleID = createArticleRes.data.id;
console.log(articleID);

console.log("========== getArticle ==========");
const getArticleRes = await getArticle(articleID);
console.log(getArticleRes.data);

console.log("========== patchArticle ==========");
const patchArticleRes = await patchArticle(
  articleID,
  "개발 잘 하는 방법",
  "자기개발",
  "https://howcanidodevelopitfluently.plese"
);
console.log(patchArticleRes.data);

console.log("========== deleteArticle ==========");
const deleteArticleRes = await deleteArticle(articleID);
console.log(deleteArticleRes.data);

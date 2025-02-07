import productService from "./ProductService.js";
import articleService from "./ArticleService.js";

//class Product와 상속 정의하기

class Product {
  constructor(name, description, price, tags, images, favoriteCount = "0") {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = 0;
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

//class Article 정의하기
class Article {
  constructor(title, content, writer, likeCount = "0") {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this._likeCount = likeCount;
  }

  set likeCount(count) {
    throw new Error("call like()!");
  }

  get likeCount() {
    return this._likeCount;
  }

  like() {
    this._likeCount += 1;
  }
}

//Protect 확인
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

console.log("=== Product POST ===");
const createProductRes = await productService.createProduct(
  "삼성 노트북",
  "3월 대학생 할인",
  1000000,
  ["전자제품", "삼성"],
  "https://www.naver.com/blog"
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
const getProductRes = await productService.getProduct(patchProductRes);
console.log(getProductRes);

console.log("=== Product Delete ===");
const deleteProductRes = await productService.deleteProduct(patchProductRes.id);
console.log(deleteProductRes);

//Article 확인
console.log("=== Article 배열 ===");
articleService.getArticleList(1, 10).then((getArticleListRes) => {
  const articles = getArticleListRes.list.map((element) => {
    const article = new Article(element.title, element.content);
    article.like();
    return article;
  });
  console.log(articles);
});

console.log("=== Article POST ===");
articleService
  .createArticle("시작", "오늘도 힘차게!", "https://www.naver.com/images")
  .then((createArticleRes) => {
    console.log(createArticleRes);
  });

console.log("=== Article Patch ===");
articleService
  .patchArticle(408, {
    title: "끝",
    content: "고생하셨습니다.",
  })
  .then((patchArticleRes) => {
    console.log(patchArticleRes);
  });

console.log("=== Article Get ===");
articleService.getArticle(407).then((getArticleRes) => {
  console.log(getArticleRes);
});

console.log("=== Aricle Delete ===");
articleService.deleteArticle(410).then((deleteArticleRes) => {
  console.log(deleteArticleRes);
});

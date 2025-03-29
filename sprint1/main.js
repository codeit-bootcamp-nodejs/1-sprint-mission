import { getProductList } from "./ProductService.js";
import { getArticleList } from "./ArticleService.js";

class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this._price = price;
    this.tags = tags;
    this.images = images;
    this._favoriteCount = favoriteCount;
  }

  get price() {
    return this._price;
  }

  set price(value) {
    if (value >= 0) {
      this._price = value;
    } else {
      console.error("가격은 음수일 수 없습니다.");
    }
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  set favoriteCount(count) {
    throw new Error("call favorite()");
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

class Article {
  constructor(title, content, writer = "", likeCount = 0) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this._likeCount = likeCount;
    this.createdAt = new Date();
  }

  get likeCount() {
    return this._likeCount;
  }

  set likeCount(count) {
    throw new Error("call like()");
  }

  like() {
    this._likeCount += 1;
  }
}

async function main() {
  try {
    const getProductListRes = await getProductList(1, 10, "맥북");
    const productList = getProductListRes.list || [];
    const products = productList.map((product) => {
      let prod;
      if (product.tags.includes("전자제품")) {
        prod = new ElectronicProduct(
          product.name,
          product.description,
          product.price,
          product.tags,
          product.images
        );
      } else {
        prod = new Product(
          product.name,
          product.description,
          product.price,
          product.tags,
          product.images
        );
      }
      prod.favorite();
      return prod;
    });
    console.log("Products:", products);

    const getArticleListRes = await getArticleList(1, 10, "");
    const articleList = getArticleListRes.list || [];
    const articles = articleList.map((article) => {
      const art = new Article(article.title, article.content);
      art.like();
      art.like();
      return art;
    });
    console.log("Articles:", articles);
  } catch (error) {
    console.error("오류 발생", error.message);
  }
}

main();

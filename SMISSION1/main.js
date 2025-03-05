import { getProductList } from "./productService.js";
import { getArticleList } from "./articleService.js";
import { Product, ElectronicProduct } from "./product.js";
import { Article } from "./article.js";

async function main() {
  try {
    //product
    const productData = await getProductList(1, 10, "");
    console.log("Product Data:", productData);
    if (!Array.isArray(productData)) {
      throw new Error("API에서 잘못된 형태의 product list를 받았습니다");
    }

    const products = productData.map((item) => {
      if (item.tags && item.tags.includes("전자제품")) {
        return new ElectronicProduct(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount,
          item.manufacturer
        );
      } else {
        return new Product(
          item.name,
          item.description,
          item.price,
          item.tags,
          item.images,
          item.favoriteCount
        );
      }
    });
    console.log(products);

    console.log("Product Instances:", products);

    //article
    const articleData = await getArticleList(1, 10, "");
    console.log("Article Data:", articleData);
    if (!Array.isArray(articleData)) {
      throw new Error("API에서 잘못된 형태의 article list를 받았습니다");
    }
    const articles = articleData.map((item) => {
      return new Article(item.title, item.content, item.writer, item.likeCount);
    });

    console.log("Article Instances:", articles);
  } catch (error) {
    console.error("main 실행 오류:", error.message);
  }
}

main();

import {
  Product,
  getProductList,
  ElectronicProduct,
  createProduct,
} from "./productService.js";
import { getArticleList, getArticle, Article } from "./articleService.js";

async function createProductInstance() {
  const products = [];
  try {
    
    const productListData = await getProductList();

    productListData.list.forEach((res) => {
      if (res.tags?.includes("전자제품")) {
        const electronicProduct = new ElectronicProduct(
          res.name,
          res.description,
          res.price,
          res.tags,
          res.images,
          res.favoriteCount,
          res.manufacturer
        );
        products.push(electronicProduct);
      } else {
        const product = new Product(
          res.name,
          res.description,
          res.price,
          res.tags,
          res.images,
          res.favoriteCount
        );
        products.push(product);
      }
    });
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const resultProductsArray = await createProductInstance();
console.log("products:", resultProductsArray);



async function createArticleInstace() {
  const articles = [];
  try {
    
    const articleGetList = await getArticleList();
    
    articleGetList.list.forEach((art) => {
      const article = new Article(
        art.title,
        art.content,
        art.writer,
        art.likeCount,
        art.image
      );
      articles.push(article);
    });
    return articles;
  } catch (error) {
    console.log(error);
  }
}

const resultArtcilesArray = await createArticleInstace();
console.log("articles: ", resultArtcilesArray);

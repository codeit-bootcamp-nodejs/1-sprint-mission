import * as ArticleService from "./ArticleService.js";
import * as ProductService from "./ProductService.js";
import { Product, ElectronicProduct } from "./ProductService.js";
import { Article } from "./ArticleService.js";

ArticleService.getArticleList();

ArticleService.createArticle({
  image: "https://test.com",
  content: "테스트내용입니다.",
  title: "게시글 제목입니다.",
});

ArticleService.getArticle("13");

ArticleService.patchArticle("13", {
  image: "https://test2.com",
  content: "수정된 테스트내용입니다.",
  title: "수정된 게시글 제목입니다.",
});

ArticleService.deleteArticle("13");

ProductService.getProductList();
ProductService.getProduct(145);
ProductService.createProduct(
  new Product(
    "테스트 상품 이름입니다.",
    "테스트 상품 설명입니다.",
    1234,
    ["테스트 상품 태그입니다."],
    ["https://test.com"]
  )
);

ProductService.patchProduct(145, {
  name: "수정된 테스트 상품 이름입니다.",
  description: "수정된 테스트 상품 설명입니다.",
  price: 1235,
  tags: ["수정된 테스트 상품 태그입니다3."],
  images: ["https://test.com"],
});

ProductService.deleteProduct(145);

//4번 미션
ProductService.getProductList().then((res) => {
  const products = [];
  const electronicproducts = [];
  res.list.forEach((product) => {
    if (product.tags.includes("전자제품")) {
      electronicproducts.push(
        new ElectronicProduct(
          product.name,
          product.description,
          product.price,
          product.tags,
          product.images
        )
      );
    } else {
      products.push(
        new Product(
          product.name,
          product.description,
          product.price,
          product.tags,
          product.images
        )
      );
    }
  }
)
  console.log("최근 10개중 전자제품이 아닌 상품들");
  console.log(products);
  console.log("최근 10개중 전자제품인 상품들");
  console.log(electronicproducts);
});

ArticleService.getArticleList().then((res) => {
  const articles = [];
  res.list.forEach ((articleList)=>{
    articles.push(new Article(articleList["title"]))
  })
  console.log("최근 글 10개");
  console.log(articles);
});

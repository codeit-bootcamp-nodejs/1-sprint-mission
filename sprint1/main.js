import { Article, getArticleList, createArticle, getArticle, patchArticle, deleteArticle } from './ArticleService.js';
import {
    createProduct,
    ElectronicProduct,
    getProduct,
    getProductList,
    Product,
    patchProduct,
    deleteProduct,
} from './ProductService.js';

// Get the list of products
const productsRes = await getProductList();
const products = productsRes.data.list.map((element) => {
    let product;

    if (element.tags.includes('전자제품')) {
        product = new ElectronicProduct(element);
    } else {
        product = new Product(element);
    }

    return product;
});
console.log(products);

// POST request for an electronic product instance
const produceRes1 = await createProduct({
    images: ['https://example.com/...'],
    tags: ['전자제품'],
    price: 0,
    description: 'string',
    name: '상품 이름',
});
console.log(produceRes1.data);

// Get product by ID
getProduct(198);

// Update a product
const updatedContent = {
    images: ['https://example.com/...'],
    tags: ['전자제품'],
    price: 0,
    description: 'string',
    name: '상품 이름',
};

try {
    const updatedProduct = await patchProduct(197, updatedContent);
    console.log('Updated product:', updatedProduct.data);
} catch (error) {
    console.error('Error:', error);
}

// Delete a product
try {
    await deleteProduct(197);
    console.log('Product deleted successfully');
} catch (error) {
    console.error('Error:', error);
}

// Get the list of articles
getArticleList()
    .then((getArticleListRes) => {
        const articles = getArticleListRes.list.map((element) => {
            const article = new Article(element);

            return article;
        });
        console.log(articles);
    })
    .catch((error) => {
        console.error(error);
    });

// POST request for an article instance
createArticle({
    image: 'https://example.com/...',
    content: '게시글 내용입니다.',
    title: '게시글 제목입니다.',
})
    .then((id) => {
        console.log('Created ID:', id);
    })
    .catch((error) => {
        console.error('ID creation error:', error);
    });

// Get article by ID
getArticle(166);

// Update an article
const updatedData = {
    title: '업데이트된 제목',
    content: '업데이트된 내용',
};
patchArticle(166, updatedData)
    .then((updatedArticle) => {
        console.log('Updated article:', updatedArticle);
    })
    .catch((error) => {
        console.error('Error:', error);
    });

// Delete an article
deleteArticle(166)
    .then(() => {
        console.log('Article deleted successfully');
    })
    .catch((error) => {
        console.error('Error:', error);
    });

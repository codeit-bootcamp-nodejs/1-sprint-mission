/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/
UPDATE users 
SET nickname='test' 
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/
SELECT *
FROM Products
WHERE products.user_id = 1
ORDER BY createdAt DESC
LIMIT 10
OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
*/

SELECT COUNT(*)
FROM Products
WHERE products.user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT *
FROM productlikes 
JOIN products ON productlikes.product_id = products.id
WHERE productlikes.user_id = 1
ORDER BY products.createdAt DESC
LIMIT 10
OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/

SELECT COUNT(*)
FROM productlikes
WHERE productlikes.user_id = 1;


/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/

INSERT INTO products (user_id,images,title ,content ,price)
VALUES (1, ARRAY['https://example.com/images/alice1.png'], 'hub', '맥북용 hub 입니다.', 5000);


/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/
SELECT products.*, COUNT(productlikes.like_id) AS likeCount
FROM products
LEFT JOIN productlikes ON products.id = productlikes.product_id
WHERE products.title = 'test'
GROUP BY products.id, products.user_id, products.title, products.content, products.price, products.images, products.createdAt, products.updatedAt
ORDER BY products.createdAt DESC
LIMIT 10;



/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/
SELECT *
FROM products
WHERE id = 1;


/*
  9. 상품 수정
  - 1번 상품 수정
*/

UPDATE products
SET title = '짝퉁'
WHERE id = 1;


/*
  10. 상품 삭제
  - 1번 상품 삭제
*/

DELETE FROM products
WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/

WITH new_like AS (INSERT INTO likes DEFAULT VALUES RETURNING id)

INSERT INTO productlikes (product_id, like_id, user_id) 
SELECT 2, id, 1 FROM new_like;

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/

DELETE FROM productlikes
WHERE product_id = 2 AND user_id = 1

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/

INSERT INTO comments (user_id, product_id, content) 
VALUES ('1', 'product_2', '이 제품 정말 강추 입니다 !');


/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/
SELECT *
FROM comments 
WHERE product_id = 1 AND createdAt < '2025-03-25'
ORDER BY createdAt DESC
LIMIT 10;


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
SET nickname = 'test',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT *
FROM product
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;

/*
  3. 내가 생성한 상품의 총 개수
*/

SELECT COUNT(*) AS total_count
FROM product
WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT p.*
FROM product_like pl
JOIN product p ON pl.product_id = p.id
WHERE pl.user_id = 1
ORDER BY pl.created_at DESC
LIMIT 10 OFFSET 20;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/

SELECT COUNT(*) AS total_count
FROM product_like
WHERE user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/

INSERT INTO product (title, price, thumbnail, user_id)
VALUES ('예시상품', 15000, 'https://example.com/image.jpg', 1);


/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/

SELECT
  p.id,
  p.title,
  p.price,
  p.thumbnail,
  p.created_at,
  COALESCE(COUNT(pl.id), 0) AS like_count
FROM product p
LEFT JOIN product_detail pd ON p.id = pd.product_id
LEFT JOIN product_like pl ON p.id = pl.product_id
WHERE p.title ILIKE '%test%' OR pd.description ILIKE '%test%'
GROUP BY p.id, p.title, p.price, p.thumbnail, p.created_at
ORDER BY p.created_at DESC
LIMIT 10 OFFSET 0;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/

SELECT
  p.id,
  p.title,
  p.price,
  p.thumbnail,
  pd.description,
  p.created_at,
  COALESCE(COUNT(pl.id), 0) AS like_count
FROM product p
LEFT JOIN product_detail pd ON p.id = pd.product_id
LEFT JOIN product_like pl ON p.id = pl.product_id
WHERE p.id = 1
GROUP BY p.id, p.title, p.price, p.thumbnail, pd.description, p.created_at;

/*
  9. 상품 수정
  - 1번 상품 수정
*/

UPDATE product
SET
  title = '수정된 상품명',
  price = 20000,
  thumbnail = 'https://example.com/updated-image.jpg',
  updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/

DELETE FROM product
WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/

INSERT INTO product_like (product_id, user_id, created_at)
VALUES (2, 1, CURRENT_TIMESTAMP);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/

DELETE FROM product_like
WHERE user_id = 1 AND product_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/

INSERT INTO comment (
  user_id,
  type,
  target_id,
  content,
  created_at,
  updated_at
) VALUES (
  1,
  'PRODUCT',
  2,
  'Good!',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/

SELECT *
FROM comment
WHERE type = 'PRODUCT'
  AND target_id = 1
  AND created_at < '2025-03-25'
ORDER BY created_at DESC
LIMIT 10;

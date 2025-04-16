/* 1번 문제 예시값 삽입문 */
INSERT INTO
  users (email, nickname, password)
VALUES
  ('alice@example.com', 'Alice', 'hashed_pw_1'),
  ('bob@example.com', 'Bobby99', 'hashed_pw_2'),
  ('charlie@example.com', 'Charlie_', 'hashed_pw_3'),
  ('diana@example.com', 'Diana07', 'hashed_pw_4'),
  ('eve@example.com', 'EveTheGreat', 'hashed_pw_5');

/* 2,7 번 문제 예시값 삽입문 */
INSERT INTO
  products (user_id, name, description, price)
VALUES
  (
    1,
    'Product 1',
    'Description for product 1',
    '10.99'
  ),
  (
    1,
    'Product 2',
    'Description for product 2',
    '12.50'
  ),
  (
    1,
    'Product 3',
    'Description for product 3',
    '8.75'
  ),
  (
    1,
    'Product 4',
    'Description for product 4',
    '15.20'
  ),
  (
    1,
    'Product 5',
    'Description for product 5',
    '9.99'
  ),
  (
    1,
    'Product 6',
    'Description for product 6',
    '13.00'
  ),
  (
    1,
    'Product 7',
    'Description for product 7',
    '7.50'
  ),
  (
    1,
    'Product 8',
    'Description for product 8',
    '19.99'
  ),
  (
    1,
    'Product 9',
    'Description for product 9',
    '11.45'
  ),
  (
    1,
    'Product 10',
    'Description for product 10',
    '16.80'
  ),
  (
    1,
    'Product 11',
    'Description for product 11',
    '14.00'
  ),
  (
    1,
    'Product 12',
    'Description for product 12',
    '6.75'
  ),
  (
    1,
    'Product 13',
    'Description for product 13',
    '21.30'
  ),
  (
    1,
    'Product 14',
    'Description for product 14',
    '17.45'
  ),
  (
    1,
    'Product 15',
    'Description for product 15',
    '10.10'
  ),
  (
    1,
    'Product 16',
    'Description for product 16',
    '12.60'
  ),
  (
    1,
    'Product 17',
    'Description for product 17',
    '9.25'
  ),
  (
    1,
    'Product 18',
    'Description for product 18',
    '13.35'
  ),
  (
    1,
    'Product 19',
    'Description for product 19',
    '18.99'
  ),
  (
    1,
    'Product 20',
    'Description for product 20',
    '22.40'
  ),
  (
    1,
    'Product 21',
    'Description for product 21',
    '11.11'
  ),
  (
    1,
    'Product 22',
    'Description for product 22',
    '10.00'
  ),
  (
    1,
    'Product 23',
    'Description for product 23',
    '15.99'
  ),
  (
    1,
    'Product 24',
    'Description for product 24',
    '16.75'
  ),
  (
    1,
    'Product 25',
    'Description for product 25',
    '17.20'
  ),
  (
    1,
    'Product 26',
    'Description for product 26',
    '13.45'
  ),
  (
    1,
    'Product 27',
    'Description for product 27',
    '9.85'
  ),
  (
    1,
    'Product 28',
    'Description for product 28',
    '8.50'
  ),
  (
    1,
    'Product 29',
    'Description for product 29',
    '19.95'
  ),
  (
    1,
    'Product 30',
    'Description for product 30',
    '14.70'
  ),
  (
    1,
    'Product 31',
    'Description for product 31',
    '6.99'
  ),
  (
    1,
    'Product 32',
    'Description for product 32',
    '7.80'
  ),
  (
    1,
    'Product 33',
    'Description for product 33',
    '20.00'
  ),
  (
    1,
    'Product 34',
    'Description for product 34',
    '18.50'
  ),
  (
    1,
    'Product 35',
    'Description for product 35',
    '11.90'
  ),
  (
    1,
    'Product 36',
    'Description for product 36',
    '10.10'
  ),
  (
    1,
    'Product 37',
    'Description for product 37',
    '13.25'
  ),
  (
    1,
    'Product 38',
    'Description for product 38',
    '12.80'
  ),
  (
    1,
    'Product 39',
    'Description for product 39',
    '9.90'
  ),
  (
    1,
    'Product 40',
    'Description for product 40',
    '8.80'
  ),
  (2, 'Test Product 1', '테스트용 설명입니다.', 1000),
  (2, 'Cooltest Sneakers', '쿨한 신발입니다.', 2000),
  (2, 'Testy Sauce', '테스트 소스입니다.', 1500),
  (2, 'Sample Item', '예시 상품입니다.', 1300),
  (2, 'Gaming Mouse', '게임용 마우스입니다.', 3000),
  (2, 'Alpha Tester', '알파 테스터 에디션.', 1200),
  (2, 'Notebook', '노트북입니다.', 5000),
  (2, 'Bluetooth Speaker', '블루투스 스피커입니다.', 2700),
  (2, 'Pro Test Device', '프로 테스터 장치입니다.', 4000),
  (2, 'T-Shirt', '티셔츠입니다.', 900),
  (2, 'Wireless Charger', '무선 충전기입니다.', 1800),
  (2, 'Testament Book', '책입니다.', 1100),
  (2, 'Stylish Hat', '모자입니다.', 1300),
  (2, 'Test Drive Package', '시승 패키지.', 2100),
  (2, 'Desk Lamp', '책상 조명입니다.', 1700),
  (2, 'Water Bottle', '물병입니다.', 800),
  (2, 'Fitness Tracker', '피트니스 트래커입니다.', 2500),
  (2, 'Test Tube Rack', '시험관 거치대입니다.', 1600),
  (2, 'Coffee Mug', '머그컵입니다.', 700),
  (2, 'TestZone Subscrit', '테스트존 구독권입니다.', 2200);

/* 4번 문제 예시값 삽입문 */
INSERT INTO
  product_likes (user_id, product_id)
VALUES
  (1, 1),
  (1, 3),
  (1, 5),
  (1, 7),
  (1, 9),
  (1, 11),
  (1, 13),
  (1, 15),
  (1, 17),
  (1, 19),
  (1, 21),
  (1, 23),
  (1, 25),
  (1, 27),
  (1, 29),
  (1, 31),
  (1, 33),
  (1, 35),
  (1, 37),
  (1, 39),
  (2, 1),
  (2, 2),
  (2, 3),
  (2, 4),
  (2, 5),
  (2, 6),
  (2, 7),
  (2, 8),
  (2, 9),
  (2, 10),
  (2, 11),
  (2, 12),
  (2, 13),
  (2, 14),
  (2, 15),
  (2, 16),
  (2, 17),
  (2, 18),
  (2, 19),
  (2, 20),
  (2, 21),
  (2, 22),
  (2, 23),
  (2, 24),
  (2, 25),
  (2, 26),
  (2, 27),
  (2, 28),
  (2, 29),
  (2, 30),
  (2, 31),
  (2, 32),
  (2, 33),
  (2, 34),
  (2, 35),
  (2, 36),
  (2, 37),
  (2, 38),
  (2, 39),
  (2, 40),
  (2, 41),
  (2, 42),
  (2, 43),
  (2, 44),
  (2, 45),
  (2, 46),
  (2, 47),
  (2, 48),
  (2, 49),
  (2, 50),
  (2, 51),
  (2, 52),
  (2, 53),
  (2, 54),
  (2, 55),
  (2, 56),
  (2, 57),
  (2, 58),
  (2, 59),
  (2, 60),
  (2, 61);

/* 14번 문제 예시값 삽입문 */
INSERT INTO
  COMMENTS (
    user_id,
    content,
    commentable_type,
    commentable_id
  )
VALUES
  (1, '1번상품 좋습니다.', 'products', 1);
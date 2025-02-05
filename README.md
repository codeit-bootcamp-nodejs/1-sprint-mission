
# 요구사항

## 요구사항
---
Node

```
npm i axios
```

start

```
node main.js
```

## 기능 및 구현 상세

1. 클래스 설계 [✅]

- Product 클래스
    - 속성: name, description, price, tags, images, favoriteCount
    - 메소드: favorite() - 호출 시 favoriteCount 증가

- ElectronicProduct 클래스
    - Product 클래스를 상속하며, 추가 속성 manufacturer 포함

- Article 클래스
    - 속성: title, content, writer, likeCount, createdAt
    - 메소드: like() - 호출 시 likeCount 증가

2. 아티클 API 연동 (axios 활용) [✅]

- API 엔드포인트: Panda Market API

    1. getArticleList({ page, pageSize, keyword }) - 아티클 목록 조회 (GET)
    2. getArticle(id) - 특정 아티클 조회 (GET)
    3. createArticle({ title, content, image }) - 아티클 생성 (POST)
    4. patchArticle(id, data) - 아티클 수정 (PATCH)
    5. deleteArticle(id) - 아티클 삭제 (DELETE)

.then()과 .catch()를 활용한 비동기 처리

3. 상품 API 연동 (async/await 활용) [✅]

- API 엔드포인트 동일

    1. getProductList({ page, pageSize, keyword }) - 상품 목록 조회 (GET)
    2. getProduct(id) - 특정 상품 조회 (GET)
    3. createProduct({ name, description, price, tags, images }) - 상품 생성 (POST)
    4. patchProduct(id, data) - 상품 수정 (PATCH)
    5. deleteProduct(id) - 상품 삭제 (DELETE)

async/await를 사용한 비동기 처리 및 try/catch를 통한 오류 처리

4. 데이터 인스턴스화 [✅]

- getProductList()를 통해 받은 데이터를 Product 또는 ElectronicProduct 클래스로 변환하여 products 배열에 저장
    - 해시태그에 전자제품이 포함된 경우 ElectronicProduct 클래스 사용, 그 외에는 Product 클래스 사용

- getArticleList()를 통해 받은 데이터를 Article 클래스로 변환하여 articles 배열에 저장

5. 코드 구조화 [✅]

- ProductService.js: 상품 관련 API 함수 정의

- ArticleService.js: 아티클 관련 API 함수 정의

- main.js: 주요 실행 로직 및 API 호출 결과 확인

- import를 사용하여 모듈을 가져와 실행

기술 스택

- JavaScript

- Node.js

- Axios (API 요청 처리)

### 심화 [✅]
- article 클래스에 createdAt 프로퍼티를 넣어 constructor가 호출 될 시 시간 저장

## 멘토에게
- 셀프 코드 리뷰를 통해 질문 이어가겠습니다.
- 구조나 API 연동에 대한 피드백 부탁드립니다.

# 1기 스프린트 미션2 - 이설
- [✅] Git 활용 과정에서 유닉스 커맨드를 활용해 주세요.
- [✅] README.md 파일을 작성해 주세요.
- [✅] 마크다운 언어를 숙지하여 작성해 주세요.
- [✅] 내용은 자유롭게 작성해 주세요.
- [✅] 본인 브랜치(ex)part1-이설)에 스프린트 미션을 업로드 해 주세요.
- [✅] 적절한 커밋 메시지를 남겨 주세요.
- [✅] 1-Sprint-Mission 레포지토리를 fork 합니다.
- [✅] GitHub에 PR(Pull Request)을 생성해 upstream의 본인 브랜치에 미션을 제출합니다.
- [✅ ] PR 커멘트에 아래 내용들을 포함해 주세요.
  - [✅] 스프린트 미션 요구사항 체크리스트
  - [✅] 완료한 만큼 체크 표시를 해 주세요.

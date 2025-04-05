## 요구사항

### 기본

- [x] PostgreSQL를 이용해 주세요.
- [x] 데이터 모델 간의 관계를 고려하여 onDelete를 설정해 주세요.
- [x] 데이터베이스 시딩 코드를 작성해 주세요.
- [x] 각 API에 적절한 에러 처리를 해 주세요.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.

#### 중고마켓

- [x] Product 스키마를 작성해 주세요.
  - [x] id, name, description, price, tags, createdAt, updatedAt필드를 가집니다.
  - [x] 필요한 필드가 있다면 자유롭게 추가해 주세요.
- [x] 상품 등록 API를 만들어 주세요.
  - [x] name, description, price, tags를 입력하여 상품을 등록합니다.
- [x] 상품 상세 조회 API를 만들어 주세요.
  - [x] id, name, description, price, tags, createdAt를 조회합니다.
- [x] 상품 수정 API를 만들어 주세요.
  - [x] PATCH 메서드를 사용해 주세요.
- [x] 상품 삭제 API를 만들어 주세요.
- [x] 상품 목록 조회 API를 만들어 주세요.
  - [x] id, name, price, createdAt를 조회합니다.
  - [x] offset 방식의 페이지네이션 기능을 포함해 주세요.
  - [x] 최신순(recent)으로 정렬할 수 있습니다.
  - [x] name, description에 포함된 단어로 검색할 수 있습니다.
- [x] 각 API에 적절한 에러 처리를 해 주세요.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.

#### 자유게시판

- [x] Article 스키마를 작성해 주세요.
  - [x] id, title, content, createdAt, updatedAt 필드를 가집니다.
- [x] 게시글 등록 API를 만들어 주세요.
  - [x] title, content를 입력해 게시글을 등록합니다.
- [x] 게시글 상세 조회 API를 만들어 주세요.
  - [x] id, title, content, createdAt를 조회합니다.
- [x] 게시글 수정 API를 만들어 주세요.
- [x] 게시글 삭제 API를 만들어 주세요.
- [x] 게시글 목록 조회 API를 만들어 주세요.

  - [x] id, title, content, createdAt를 조회합니다.
  - [x] offset 방식의 페이지네이션 기능을 포함해 주세요.
  - [x] 최신순(recent)으로 정렬할 수 있습니다.
  - [x] title, content에 포함된 단어로 검색할 수 있습니다.

  #### 댓글

- [x] 댓글 등록 API를 만들어 주세요.
  - [x] content를 입력하여 댓글을 등록합니다.
  - [x] 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
- [x] 댓글 수정 API를 만들어 주세요.
- [x] PATCH 메서드를 사용해 주세요.
- [x] 댓글 삭제 API를 만들어 주세요.
- [x] 댓글 목록 조회 API를 만들어 주세요.

  - [x] id, content, createdAt 를 조회합니다.
  - [x] cursor 방식의 페이지네이션 기능을 포함해 주세요.
  - [x] 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.

  #### 유효성 검증

- [x] 상품 등록 시 필요한 필드(이름, 설명, 가격 등)의 유효성을 검증하는 미들웨어를 구현합니다.
- [x] 게시물 등록 시 필요한 필드(제목, 내용 등)의 유효성 검증하는 미들웨어를 구현합니다.

#### 이미지 업로드

- [x] multer 미들웨어를 사용하여 이미지 업로드 API를 구현해주세요.
  - [x] 업로드된 이미지는 서버에 저장하고, 해당 이미지의 경로를 response 객체에 포함해 반환합니다.

#### 에러 처리

- [x] 모든 예외 상황을 처리할 수 있는 에러 핸들러 미들웨어를 구현합니다.
- [x] 서버 오류(500), 사용자 입력 오류(400 시리즈), 리소스 찾을 수 없음(404) 등 상황에 맞는 상태값을 반환합니다.

#### 라우트 중복 제거

- [x] 중복되는 라우트 경로(예: /users에 대한 get 및 post 요청)를 app.route()로 통합해 중복을 제거합니다.
- [x] express.Router()를 활용하여 중고마켓/자유게시판 관련 라우트를 별도의 모듈로 구분합니다.

### 심화

- [x] .env 파일에 환경 변수를 설정해 주세요.
- [x] CORS를 설정해 주세요.
- [x] render.com으로 배포해 주세요.

## 주요 변경사항

- 미션 요구사항에 따라 구현해 보았습니다.

## 스크린샷

![sprint](https://velog.velcdn.com/images/shinminsoo317/post/b2edd3e5-9bc8-4381-9c79-ac54d012112f/image.jpg)

## 멘토에게

- 셀프 코드 리뷰를 통해 질문 이어가겠습니다.
- comment(댓글)를 POST을 할 때 계속 never가 예상되는데 null 또는 productID/articleID가 입력이 되었다고
  에러가 나와서 어떻게 해야하나 고민을 많이하다가 결국 structs.js의 CreateComment에서 productID/articleID에
  s.any()값을 줘서 어느 값이 들어와도 상관없도록 지정하였더니 에러가 사라졌습니다. 디버깅을 이렇게 해서 comment를
  POST가 되도록 만들긴 했는데 맞는 방법인지 잘 모르겠습니다. 더 좋은 방법이 있을까요?
- productID의 name, description / articleID가 title, content 페이지네이션과 comment의 cursor을
  이용한 페이지네이션을 하였는데 제가 구현한 방법이 어떠한지, 더 좋은 방법이 있는지 궁금합니다.
- error middleware를 수업시간에 배운 코드를 활용하여 app.js에 넣었는데 다른 좋은 방법이 있을까요? 제가 생각했을 땐
  app.js로 다른 router에서 import를 기능들 이후에 error middleware가 있는게 맞는거 같아서 일단 app.js 밑에
  위치 시켰습니다.
- stucts.js의 superstruct로 유효성 검증을 구현했는데, 미션의 유효성 검증 질문처럼 이 외에 미들웨어로 다시 검증을 해야하는 것 인가요?
  저는 일단 유효성 검증을 superstruct로 했기 때문에 따로 유효성 검증 미들웨어를 추가하지는 않았습니다.
- 많이 부족합니다. 많은 피드백 부탁드리겠습니다. 감사합니다!!

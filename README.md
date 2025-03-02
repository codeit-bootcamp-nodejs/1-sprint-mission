## Sprint Mission 3 API Integration

본 프로젝트는 스프린트 미션 3 요구사항을 바탕으로 중고마켓, 자유게시판, 댓글 데이터를 가져오고 조작하는 기능을 구현합니다.

## 프로젝트 구조

```
📦 프로젝트 루트
 ┣ 📂 prisma                  # Prisma 관련 파일
 ┣ 📂 src                     # 애플리케이션 소스 코드
 ┃ ┣ 📜 app.js                # 애플리케이션 실행 및 기능 실행 코드
 ┃ ┣ 📜 struct.js             # 유효성 검증 및 구조 정의
 ┃ ┣ 📂 routes                # 라우터 관련 파일
 ┃ ┃ ┣ 📜 productRoute.js     # Product API 라우터
 ┃ ┃ ┣ 📜 articleRoute.js     # Article API 라우터
 ┃ ┃ ┣ 📜 commentRoute.js     # Comment API 라우터
 ┃ ┣ 📂 uploads               # 이미지 업로드 및 관련 파일
 ┃ ┣ 📂 utils                 # 유틸리티 함수들
 ┃ ┃ ┣ 📜 asyncHandler.js     # 비동기 함수 에러 처리 핸들러
 ┣ 📜 .env                    # 환경 변수 설정
```

## 커밋 컨벤션

| 커밋     | 역할                                                                  |
| -------- | --------------------------------------------------------------------- |
| Feat     | 기능 구현과 관련된 커밋                                               |
| Fix      | 버그를 고친 경우                                                      |
| Refactor | 더 좋은 코드로 개선한 경우 (기능에 변화가 없는 경우) ex-코드리뷰 반영 |
| Docs     | README.md 등 문서를 작성한 경우                                       |
| Chore    | 주석 추가, 자잘한 문서 수정                                           |

## 기술 스택

| 역할                 | 종류                                                                                                                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Programming Language | ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)                                                                                     |
| JavaScript Runtime   | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)                                                                                                          |
| Package Manager      | ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)                                                                                                              |
| ORM                  | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)                                                                                                            |
| Database             | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)                                                                                                |
| Formatting           | ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)                                                                                                      |
| Version Control      | ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) |

## 데이터베이스 모델

```mermaid
erDiagram
    Product {
        string id PK
        string name
        string description
        float price
        string[] tags
        datetime createdAt
        datetime updatedAt
    }

    Article {
        string id PK
        string title
        string content
        datetime createdAt
        datetime updatedAt
    }

    Comment {
        string id PK
        string content
        datetime createdAt
        datetime updatedAt
        string productId FK "references Product(id)"
        string articleId FK "references Article(id)"
    }

    Product ||--o| Comment: "has many"
    Article ||--o| Comment: "has many"
```

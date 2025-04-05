## Panda Market API Integration

본 프로젝트는 Panda Market 플랫폼에서 제공하는 Swagger 를 바탕으로 상품 및 게시글 데이터를 가져오고 조작하는 기능을 구현합니다.

## 프로젝트 구조

```
📦 프로젝트 루트
 ┣ 📜 main.js                # 애플리케이션 실행 및 기능 실행 코드
 ┣ 📜 productService.js       # Product API 관련 함수 정의
 ┗ 📜 articleService.js       # Article API 관련 함수 정의
```

## 커밋 컨밴션

| 커밋     | 역할                                                                  |
| -------- | --------------------------------------------------------------------- |
| Feat     | 기능 구현과 관련된 커밋                                               |
| Fix      | 버그를 고친 경우                                                      |
| Refactor | 더 좋은 코드로 개선한 경우 (기능에 변화가 없는 경우) ex-코드리뷰 반영 |
| Docs     | README.md 등 문서를 작성한 경우                                       |
| Chore    | 주석 추가, 자잘한 문서 수정                                           |

## 기술 스택

| 역할                 | 종류                                                                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Programming Language | ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)                                                                                      |
| JavaScript Runtime   | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)                                                                                                           |
| Package Manager      | ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)                                                                                                               |
| Data Fetching        | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white) ![Fetch](https://img.shields.io/badge/Fetch-239120?style=for-the-badge&logoColor=white)                        |
| Formatting           | ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white) |
| Version Control      | ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)  |

# Sprint Mission 2

**디렉토리 구조**

```bash

.
├── app.js
├── prisma/         # Prisma 설정 및 관리
│   ├── migrations/
│   └── schema.prisma
├── src/
│   └── routes/     # 라우팅 처리
│       ├── article.js # 게시글 라우터
│       ├── product.js # 상품 라우터
│       └── ...
└── uploads/        # 파일 업로드 경로
```

---

**스키마 설계**
<br/>
중고마켓 상품 (Product)<br/>
자유게시판 게시글 (Article)<br/>
댓글 (Comment)<br/>

**관계**

- 상품 - 댓글: 1:N 관계
- 게시글 - 댓글: 1:N 관계
- 댓글 - 상품/게시글: N:1 관계

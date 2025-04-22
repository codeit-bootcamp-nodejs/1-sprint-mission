```mermaid
erDiagram

  users {
    int id PK
    text email
    text nickname
    text image
    text password
    timestamp created_at
    timestamp updated_at
  }

  products {
    int id PK
    int user_id FK
    text name
    text description
    int price
    timestamp created_at
    timestamp updated_at
  }

  product_images {
    int id PK
    int product_id FK
    text url
  }

  product_tags {
    int id PK
    int product_id FK
    text tag
  }

  articles {
    int id PK
    int user_id FK
    text title
    text content
    text image
    timestamp created_at
    timestamp updated_at
  }

  comments {
    int id PK
    int user_id FK
    int article_id FK
    int product_id FK
    text content
    timestamp created_at
    timestamp updated_at
  }

  likes {
    int user_id PK, FK
    int product_id PK, FK
    timestamp created_at
  }

  users ||--o{ products : 작성
  users ||--o{ articles : 작성
  users ||--o{ comments : 작성
  users ||--o{ likes : 좋아요

  products ||--o{ product_images : 이미지
  products ||--o{ product_tags : 태그
  products ||--o{ comments : 댓글
  products ||--o{ likes : 좋아요

  articles ||--o{ comments : 댓글
```

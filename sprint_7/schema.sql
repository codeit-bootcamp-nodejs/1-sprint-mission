BEGIN;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email text NOT NULL UNIQUE,
  nickname text NOT NULL ,
  password text NOT NULL ,
  image text[],
  provider text DEFAULT 'local',
  providerId text,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  image text[],
  likecount INTEGER DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT title_length CHECK (LENGTH(title) <= 10),
  CONSTRAINT content_length CHECK (LENGTH(content) > 10),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  images text[] NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  price INTEGER NOT NULL,
  likecount INTEGER DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT title_length CHECK (LENGTH(title) <= 10),
  CONSTRAINT content_length CHECK (LENGTH(content) > 10)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER,
  article_id INTEGER,
  content text NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE,
  CONSTRAINT content_length CHECK (LENGTH(content) > 5)
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE articlelikes (
  article_id INTEGER NOT NULL,
  like_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (article_id, like_id, user_id),
  FOREIGN KEY (article_id) REFERENCES articles (id),
  FOREIGN KEY (like_id) REFERENCES likes (id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE productlikes (
  product_id INTEGER NOT NULL,
  like_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, like_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  FOREIGN KEY (like_id) REFERENCES likes (id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  content text NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE producttags (
  product_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

CREATE TABLE articletags (
  article_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (article_id, tag_id),
  FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE SET NULL,
  FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,                    
  user_id INTEGER NOT NULL,                 
  target_user_id INTEGER,                   
  type notification_type NOT NULL,                       
  content TEXT NOT NULL,                    
  is_read BOOLEAN DEFAULT FALSE,            
  createdAt TIMESTAMPTZ DEFAULT NOW(),      
  updatedAt TIMESTAMPTZ DEFAULT NOW(),      
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (target_user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TYPE notification_type AS ENUM (
  'COMMENT',    
  'ARTICLE',    
  'PRODUCT'     
);

COMMIT;
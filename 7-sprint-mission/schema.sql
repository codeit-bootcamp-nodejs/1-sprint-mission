CREATE articles (
  id SERIAL PRIMARY KEY,
  title varchar(100) NOT NULL,
  content text NOT NULL,
  image_url varchar(255),
  created_at TIMESTAMP DEFAULT,
  updated_at TIMESTAMP DEFAULT,
  user_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)   
)

CREATE products (
  id SERIAL PRIMARY KEY,
  name varchar(100) NOT NULL,
  description text NOT NULL,
  price int NOT NULL,
  created_at TIMESTAMP DEFAULT,
  updated_at TIMESTAMP DEFAULT,
  user_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)   
)

CREATE comments (
  id SERIAL PRIMARY KEY,
  content text NOT NULL,
  created_at TIMESTAMP DEFAULT,
  updated_at TIMESTAMP DEFAULT,
  article_id int,
  product_id int,
  user_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
)

CREATE users (
  id SERIAL PRIMARY KEY,
  email varchar(255) UNIQUE NOT NULL,
  nickname varchar(100) NOT NULL,
  image_url varchar(255),
  password varchar(100) NOT NULL,
  created_at TIMESTAMP DEFAULT,
  updated_at TIMESTAMP DEFAULT
)

CREATE favorites (
  id SERIAL PRIMARY KEY,
  user_id int NOT NULL,
  created_at TIMESTAMP DEFAULT,
  updated_at TIMESTAMP DEFAULT,
  product_id int NOT NULL,
  FOREIGN kEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
)

CREATE likes (
  id SERIAL PRIMARY KEY,
  user_id int NOT NULL,
  created_at TIMESTAMP DEFAULT,
  updated_at TIMESTAMP DEFAULT,
  article_id int NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
)
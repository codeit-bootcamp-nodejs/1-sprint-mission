import axios from "axios";

const url = new URL("https://panda-market-api-crud.vercel.app/articles");

export class Article {
  constructor(title, content, writer, likeCount, image) {
    this.title = title;
    this.content = content; 
    this.writer = writer;
    this.image = image;
    this.likeCount = likeCount;
    this.createAt = new Date();
  }
  like() {
    this.likeCount++;
  }
}

export function getArticleList(page = 1, pageSize = 10, keyword = "") {
  return axios
    .get(`${url}`, {
      params: {
        page,
        pageSize,
        keyword,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error("Error fetching articles:", error);
      throw error;
    });
}

export function getArticle(articleId) {
  axios
    .get(`${url}/${articleId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

export function createArticle(title, content, image) {
  axios
    .post(`${url}`, {
      title,
      content,
      image,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.err(err);
    });
}

export function patchArticle(articleId, updates) {
  axios
    .patch(`${url}/${articleId}`, updates)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}

export function deleteArticle(articleId) {
  axios
    .delete(`${url}/${articleId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

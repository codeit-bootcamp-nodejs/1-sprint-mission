import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/articles",
  timeout: 10000,
});

export function getArticleList(page = 1, pageSize = 10, keyword = " ") {
  return instance
    .get("/", { params: { page, pageSize, keyword } })
    .then((res) => res)
    .catch((err) => {
      console.error("getArticleList 중 오류 발생:", err.message);
    });
}

export function getArticle(id) {
  return instance
    .get(`/${id}`)
    .then((res) => res)
    .catch((err) => {
      console.error("getArticle 중 오류 발생:", err.message);
    });
}

export function createArticle(title, content, image) {
  return instance
    .post("/", { title, content, image })
    .then((res) => res)
    .catch((err) => {
      console.error("createArticle 중 오류 발생:", err.message);
    });
}

export function patchArticle(id, title, content, image) {
  return instance
    .patch(`/${id}`, { title, content, image })
    .then((res) => res)
    .catch((err) => {
      console.error("patchArticle 중 오류 발생:", err.message);
    });
}

export function deleteArticle(id) {
  return instance
    .delete(`/${id}`)
    .then((res) => res)
    .catch((err) => {
      console.error("deleteArticle 중 오류 발생:", err.message);
    });
}

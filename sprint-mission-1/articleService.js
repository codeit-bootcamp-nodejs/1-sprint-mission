import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/articles",
  timeout: 10000,
});

function getArticleList(page, pageSize, keyword) {
  return instance
    .get("/", { params: { page, pageSize, keyword } })
    .then((res) => res)
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function getArticle(id) {
  return instance
    .get(`/${id}`)
    .then((res) => res)
    .catch((err) => {
      if (err.response) {
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function createArticle(title, content, image) {
  return instance
    .post("/", { title, content, image })
    .then((res) => res)
    .catch((err) => {
      if (err.response) {
        console.log("statusCode:", err.response.status);
        console.log("response headers:", err.response.headers);
        console.log("response data:", err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function patchArticle(id, title, content, image) {
  return instance
    .patch(`/${id}`, { title, content, image })
    .then((res) => res)
    .catch((err) => {
      if (err.response) {
        console.log("statusCode:", err.response.status);
        console.log("response headers:", err.response.headers);
        console.log("response data:", err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

function deleteArticle(id) {
  return instance
    .delete(`/${id}`)
    .then((res) => res)
    .catch((err) => {
      if (err.response) {
        console.log("statusCode:", err.response.status);
        console.log("response headers:", err.response.headers);
        console.log("response data:", err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log("Error", err.message);
      }
    });
}

const articleService = {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
};

export default articleService;

import axios from "axios";

export class Article {
  constructor(title, content, writer, likeCount, image) {
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.likeCount = likeCount;
    this.image = image;
    this.createdAt = new Date();
  }
  like() {
    this.likeCount += 1;
  }
}

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/articles",
  timeout: 3000,
});

export function getArticleList(
  queryParams = { page: 1, pageSize: 10, keyword: "" }
) {
  const res = instance
    .get(`?`, {
      params: queryParams,
    })
    .then((response) => {
      console.log("getArticleList 성공!");
      console.log(response.data)
      return response.data;
    })
    .catch(function (error) {
      if (error.response ||error.response.status<200||error.response.status>=300) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
  return res;
}

export function getArticle(id) {
  const res = instance
    .get(`/${id}`)
    .then((response) => {
      console.log("createArticle 성공!");
    })
    .catch(function (error) {
      if (error.response ||error.response.status<200||error.response.status>=300) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
  return res;
}

export function createArticle(body) {
  const res = instance
    .post(`/`, body)
    .then((response) => {
      console.log("getArticle 성공!");
    })
    .catch(function (error) {
      if (error.response ||error.response.status<200||error.response.status>=300) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
  return res;
}

export function patchArticle(id, body) {
  const res = instance
    .patch(`/${id}`, body)
    .then((response) => {
      console.log("patchArticle 성공!");
    })
    .catch(function (error) {
      if (error.response ||error.response.status<200||error.response.status>=300) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
  return res;
}

export function deleteArticle(id) {
  const res = instance
    .delete(`/${id}`)
    .then((response) => {
      console.log("deleteArticle 성공!");
    })
    .catch(function (error) {
      if (error.response ||error.response.status<200||error.response.status>=300) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        console.error(error.request);
      } else {
        console.error("Error", error.message);
      }
    });
  return res;
}

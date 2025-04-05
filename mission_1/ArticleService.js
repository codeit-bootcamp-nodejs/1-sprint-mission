import axios from "axios";

const pandaMarketApi = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/articles",
  timeout: 10000,
});

export function getArticleList(page, pageSize, keyword) {
  return pandaMarketApi
    .get("/", { params: { page, pageSize, keyword } })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.headers);
        console.log(e.response.status);
        console.log(e.response.data);
      } else if (e.request) {
        console.log(e.request);
      } else {
        console.log("에러가 발생하였습니다", e.message);
      }
    })
    .finally(() => {
      console.log("Finished");
    });
}

export function getArticle(id) {
  return pandaMarketApi
    .get(`/${id}`)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.headers);
        console.log(e.response.status);
        console.log(e.response.data);
      } else if (e.request) {
        console.log(error);
      } else {
        console.log("에러가 발생하였습니다.", e.message);
      }
    })
    .finally(() => {
      console.log("Finished");
    });
}

export function createArticle(title, content, image) {
  return pandaMarketApi
    .post("/", { title, content, image })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.headers);
        console.log(e.response.data);
      } else if (e.request) {
        console.log(e.request);
      } else {
        console.log("에러가 발생하였습니다.", e.message);
      }
    })
    .finally(() => {
      console.log("Finished");
    });
}

export function patchArticle(id, title, content, image) {
  return pandaMarketApi
    .patch(`/${id}`, { title, content, image })
    .then((res) => {
      return res;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.headers);
        console.log(e.response.status);
        console.log(e.response.data);
      } else if (e.request) {
        console.log(e.request);
      } else {
        console.log("에러가 발생하였습니다.", e.message);
      }
    })
    .finally(() => {
      console.log("Finished");
    });
}

export function deleteArticle(id) {
  return pandaMarketApi
    .delete(`${id}`)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.headers);
        console.log(e.response.status);
        console.log(e.response.data);
      } else if (e.request) {
        console.log(e.request);
      } else {
        console.log("에러가 발생하였습니다.", e.message);
      }
    })
    .finally(() => console.log("Finished"));
}

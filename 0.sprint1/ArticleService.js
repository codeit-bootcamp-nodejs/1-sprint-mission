import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/",
  timeout: 5000,
});

function getArticleList(page, pageSize, keyword) {
  return instance
    .get("/articles", {
      params: { page, pageSize, keyword },
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log("리스트 조회에 실패하였습니다.");
      }
    });
}

function getArticle(id) {
  return instance
    .get(`/articles/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log("ID 조회에 실패하였습니다.");
      }
    });
}

function creatArticle(title, content, image) {
  return instance
    .post("/articles", {
      title,
      content,
      image,
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log("작성에 실패하였습니다.");
      }
    });
}

function patchArticle(id, data) {
  return instance
    .patch(`/articles/${id}`, data)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.status);
        console.log(e.response.data);
      } else {
        console.log("수정에 실패하였습니다.");
      }
    });
}

function deleteArticle(id) {
  return instance
    .delete(`/articles/${id}`)
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      if (e.response) {
        console.log(e.response.satus);
        console.log(e.response.data);
      } else {
        console.log("삭제에 실패하였습니다.");
      }
    });
}

const articleService = {
  getArticleList,
  getArticle,
  creatArticle,
  patchArticle,
  deleteArticle,
};

export default articleService;

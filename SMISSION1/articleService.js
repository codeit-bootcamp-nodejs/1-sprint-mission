import axios from "axios";

export async function getArticleList(page = 1, pageSize = 10, keyword = "") {
  const url = `https://panda-market-api-crud.vercel.app/articles?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    console.log("Article API 응답 확인:", data);

    const articleList = data.list;

    if (!Array.isArray(articleList)) {
      throw new Error("잘못된 형태의 API");
    }

    return articleList;
  } catch (error) {
    console.error("article list를 불러오는 중 오류 발생:", error.message);
    throw error;
  }
}

export async function getArticle(articleId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/articles/${articleId}`);
    return response.data;
  } catch (error) {
    console.error("article을 불러오는 중 오류 발생:", error.message);
    throw error;
  }
}

export async function createArticle(article) {
  try {
    const response = await axios.post(`${API_BASE_URL}/articles`, article);
    return response.data;
  } catch (error) {
    console.error("article을 생성 중 오류 발생:", error.message);
    throw error;
  }
}

export async function patchArticle(articleId, updates) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/articles/${articleId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error("article 업데이트 중 오류 발생:", error.message);
    throw error;
  }
}

export async function deleteArticle(articleId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/articles/${articleId}`
    );
    return response.data;
  } catch (error) {
    console.error("article 삭제 중 오류 발생:", error.message);
    throw errer;
  }
}

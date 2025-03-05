import axios from "axios";

export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  const url = `https://panda-market-api-crud.vercel.app/products?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const productList = data.list;

    console.log("Product API 응답 확인:", data);

    if (!Array.isArray(productList)) {
      throw new Error("잘못된 형태의 API");
    }

    return productList;
  } catch (error) {
    console.error("product list를 불러오는 중 오류 발생:", error.message);
    throw error;
  }
}

export async function getProduct(productId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("product를 불러오는 중 오류 발생:", error.message);
    throw error;
  }
}

export async function createProduct(product) {
  try {
    const response = await axios.post(`${API_BASE_URL}/products`, product);
    return response.data;
  } catch (error) {
    console.error("product 생성 중 오류 발생:", error.message);
    throw error;
  }
}

export async function patchProduct(productId, updates) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/products/${productId}`,
      updates
    );
    return response.data;
  } catch (error) {
    console.error("product 업데이트 중 오류 발생:", error.message);
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("product 삭제 중 오류 발생:", error.message);
    throw error;
  }
}

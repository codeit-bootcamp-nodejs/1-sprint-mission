import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/products",
  timeout: 10000,
});

export async function getProductList(page, pageSize, keyword) {
  try {
    const res = await instance.get("/", {
      params: { page, pageSize, keyword },
    });
    return res;
  } catch (err) {
    console.error("getProductList 중 오류 발생:", err.message);
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`/${id}`);
    return res;
  } catch (err) {
    console.error("getProduct 중 오류 발생:", err.message);
  }
}

export async function createProduct(name, description, price, tags, images) {
  try {
    const res = await instance.post("/", {
      name,
      description,
      price,
      tags,
      images,
    });
    return res;
  } catch (err) {
    console.error("createProduct 중 오류 발생:", err.message);
  }
}

export async function patchProduct(id, name, description, price, tags, images) {
  try {
    const res = await instance.patch(`/${id}`, {
      name,
      description,
      price,
      tags,
      images,
    });
    return res;
  } catch (err) {
    console.error("patchProduct 중 오류 발생:", err.message);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`/${id}`);
    return res;
  } catch (err) {
    console.error("deleteProduct 중 오류 발생:", err.message);
  }
}

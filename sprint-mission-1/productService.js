import axios from "axios";

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/products",
  timeout: 10000,
});

async function getProductList(page, pageSize, keyword) {
  let res;
  try {
    res = await instance.get("/", {
      params: { page, pageSize, keyword },
    });
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }
  return res;
}

async function getProduct(id) {
  let res;
  try {
    res = await instance.get(`/${id}`);
  } catch (err) {
    if (err.response) {
      console.log(err.response.status);
      console.log(err.response.headers);
      console.log(err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }
  return res;
}

async function createProduct(name, description, price, tags, images) {
  let res;
  try {
    res = await instance.post("/", { name, description, price, tags, images });
  } catch (err) {
    if (err.response) {
      console.log("statusCode:", err.response.status);
      console.log("response headers:", err.response.headers);
      console.log("response data:", err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }
  return res;
}

async function patchProduct(id, name, description, price, tags, images) {
  let res;
  try {
    res = await instance.patch(`/${id}`, {
      name,
      description,
      price,
      tags,
      images,
    });
  } catch (err) {
    if (err.response) {
      console.log("statusCode:", err.response.status);
      console.log("response headers:", err.response.headers);
      console.log("response data:", err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }
  return res;
}

async function deleteProduct(id) {
  let res;
  try {
    res = await instance.delete(`/${id}`);
  } catch (err) {
    if (err.response) {
      console.log("statusCode:", err.response.status);
      console.log("response headers:", err.response.headers);
      console.log("response data:", err.response.data);
    } else if (err.request) {
      console.log(err.request);
    } else {
      console.log("Error", err.message);
    }
  }
  return res;
}

const productService = {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
};

export default productService;

import axios from "axios";

const pandaMarketApi = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/products",
  timeout: 10000,
});

export async function getProductList(page, pageSize, keyword) {
  let res;
  try {
    const res = await pandaMarketApi.get("/", {
      params: { page, pageSize, keyword },
    });
    return res;
  } catch (e) {
    if (e.response) {
      console.log(e.response.headers);
      console.log(e.response.status);
      console.log(e.response.data);
    } else if (e.request) {
      console.log(e.request);
    } else {
      console.log("에러가 발생하였습니다.", e.message);
    }
  } finally {
    console.log("Finished");
  }
}

export async function getProduct(id) {
  let res;
  try {
    res = await pandaMarketApi.get(`/${id}`);
    return res;
  } catch (e) {
    if (e.response) {
      console.log(e.response.headers);
      console.log(e.response.status);
      console.log(e.response.data);
    } else if (e.request) {
      console.log(e.request);
    } else {
      console.log("에러가 발생하였습니다.", e.message);
    }
  } finally {
    console.log("Finished");
  }
}

export async function createProduct(name, description, price, tags, images) {
  let res;
  try {
    res = await pandaMarketApi.post("/", {
      name,
      description,
      price,
      tags,
      images,
    });
    return res;
  } catch (e) {
    if (e.response) {
      console.log(e.response.headers);
      console.log(e.response.status);
      console.log(e.response.data);
    } else if (e.request) {
      console.log(e.request);
    } else {
      console.log("에러가 발생하였습니다.", e.message);
    }
  } finally {
    console.log("Finished");
  }
}

export async function patchProduct(id, name, description, price, tags, images) {
  let res;
  try {
    res = await pandaMarketApi.patch(`/${id}`, {
      name,
      description,
      price,
      tags,
      images,
    });
    return res;
  } catch (e) {
    if (e.response) {
      console.log(e.response.headers);
      console.log(e.response.status);
      console.log(e.response.data);
    } else if (e.request) {
      console.log(e.request);
    } else {
      console.log("에러가 발생하였습니다.", e.message);
    }
  } finally {
    console.log("Finished");
  }
}

export async function deleteProduct(id) {
  let res;
  try {
    res = await pandaMarketApi.delete(`/${id}`);
    return res;
  } catch (e) {
    if (e.response) {
      console.log(e.response.headers);
      console.log(e.response.status);
      console.log(e.response.data);
    } else if (e.request) {
      console.log(e.request);
    } else {
      console.log("에러가 발생하였습니다.", e.message);
    }
  } finally {
    console.log("Finished");
  }
}

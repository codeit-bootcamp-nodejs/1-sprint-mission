import axios from "axios";

export class Product {
  constructor(name, description, price, tags, images, favoriteCount) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }
  favorite() {
    this.favoriteCount += 1;
  }
}

export class ElectronicProduct extends Product {
  constructor(
    name,
    description,
    price,
    tags,
    images,
    favoriteCount,
    manufacturer
  ) {
    super(name, description, price, tags, images, favoriteCount);
    this.manufacturer = manufacturer;
  }
}

const instance = axios.create({
  baseURL: "https://panda-market-api-crud.vercel.app/products",
  timeout: 10000,
});

export async function getProductList(
  queryParams = { page: 1, pageSize: 10, keyword: "" }
) {
  try {
    const res = await instance.get(`?`, {
      params: queryParams,
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`/${id}`);
    console.log("getProduct 성공!");
    return res;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
}

export async function createProduct(body) {
  try {
    const res = await instance.post(``, body);
    console.log("createProduct 성공!");
    return res;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
}

export async function patchProduct(id, body) {
  try {
    const res = await instance.patch(`/${id}`, body);
    console.log("patchProduct 성공!");
    return res;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }
}
export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`/${id}`);
    console.log("deleteProduct 성공!");
    return res;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
}

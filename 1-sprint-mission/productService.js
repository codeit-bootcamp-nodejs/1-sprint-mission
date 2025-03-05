import axios from "axios";

const url = new URL("https://panda-market-api-crud.vercel.app/products");

export class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.tags = tags;
    this.images = images;
    this.favoriteCount = favoriteCount;
  }
  favorite() {
    this.favoriteCount ++;
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
    manufacturer = ""
  ) {
    super(name, description, price, tags, images, (favoriteCount = 0));
    this.manufacturer = manufacturer;
  }
}

// ---- GET
export async function getProductList(page = 1, pageSize = 10, keyword = "") {
  try {
    const res = await axios.get(
      `${url}`,
      {
        params: {
          page,
          pageSize,
          keyword,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}


export async function getProduct(productId) {
  try {
    const res = await axios.get(
      `${url}/${productId}`
    );
    return res.data;
  } catch (err) {
      console.error(err);
  }
}



export async function createProduct(price, description, name, tags, images) {
  try {
    const res = await axios.post(
      `${url}`, // URL 다시 확인
      {
        price,
        description,
        name,
        tags,
        images,
      }
    );
    return res.data;
  } catch (error) {
    console.error("API 요청 오류:", error); //
    if (error.response) {
      console.error("응답 데이터:", error.response.data);
    } else if (error.request) {
      console.error("요청 오류:", error.request);
    } else {
      console.error("Error", error.message);
    }
  }
}


export async function patchProduct(productId, updates) {
  try {
    const res = await axios.patch(
      `${url}/${productId}`,
      updates
    );
    return res.data;
  } catch (err) {
    console.error(err);
  }
}



export async function deleteProduct(productId) {
  try {
    const res = await axios.delete(
      `${url}/${productId}`,
      updates
    );
    return res.data;
  } catch (err) {
    console.error(err);
  }
}


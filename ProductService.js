async function getProductList(page, pageSize, keyword) {
  let data;
  try {
    const params = { page, pageSize, keyword };
    const url = new URL("https://panda-market-api-crud.vercel.app/products");
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error!");
  } finally {
    console.log("Finshed!");
  }
}

async function getProduct(id) {
  try {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error!");
    return;
  } finally {
    console.log("Finshed!");
  }
}

async function createProduct(name, description, price, tags, images) {
  try {
    const response = await fetch(
      "https://panda-market-api-crud.vercel.app/products",
      {
        method: "POST",
        body: JSON.stringify({
          name: name,
          description: description,
          price: price,
          tags: tags || [],
          images: images || [],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error!");
  } finally {
    console.log("Finshed!");
  }
}

async function patchProduct(id, productData) {
  try {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(productData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error!");
  } finally {
    console.log("Finshed!");
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error!");
  } finally {
    console.log("Finshed!");
  }
}

const productService = {
  getProductList,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
};

export default productService;

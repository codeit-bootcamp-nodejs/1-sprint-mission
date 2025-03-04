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

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error!");
  } finally {
    console.log("Finished");
  }
}

async function getProduct(id) {
  try {
    const res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error!");
  } finally {
    console.log("Finished!");
  }
}

async function createProduct(name, description, price, tags, images) {
  try {
    const res = await fetch(
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

    if (!res.ok) {
      throw new Error(`HTTP error! ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error!");
  } finally {
    console.log("Finished!");
  }
}

async function patchProduct(id, patchData) {
  try {
    const res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(patchData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error!");
  } finally {
    console.log("Finished!");
  }
}

async function deleteProduct(id) {
  try {
    const res = await fetch(
      `https://panda-market-api-crud.vercel.app/products/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! ${res.ststus}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error!");
  } finally {
    console.log("Finished!");
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

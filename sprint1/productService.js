import axios from 'axios';
export class Product {
    constructor({ name, description, price, tags, images, favoriteCount }) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.tags = tags;
        this.images = images;
        this.favoriteCount = favoriteCount;
    }

    favorite() {
        this.favoriteCount++;
    }
}
export class ElectronicProduct extends Product {
    constructor({ name, description, price, tags, images, favoriteCount, manufacturer }) {
        super({ name, description, price, tags, images, favoriteCount });
        this.manufacturer = manufacturer;
    }
}

const instance = axios.create({
    baseURL: 'https://panda-market-api-crud.vercel.app',
    timeout: 10000,
});

export const getProductList = async (queryParams = { page: 1, pageSize: 10, keyword: '' }) => {
    try {
        const res = await instance.get(`/products?`, { params: queryParams });
        return res;
    } catch (e) {
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
            throw new Error('Error occurred while fetching');
        } else if (e.request) {
            console.log('Request was sent, but no response received');
        } else {
            console.log('Other error occurred');
        }
    }
};

export const getProduct = async (id) => {
    try {
        const res = await instance.get(`/products/${id}`);
        return res;
    } catch (e) {
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
            throw new Error('Error occurred while fetching');
        } else if (e.request) {
            console.log('Request was sent, but no response received');
        } else {
            console.log('Other error occurred');
        }
    }
};

export const createProduct = async ({ images, tags, price, description, name }) => {
    try {
        const productData = { images, tags, price, description, name };
        const res = await instance.post('/products', productData);
        return res;
    } catch (e) {
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
            throw new Error('Error occurred while fetching');
        } else if (e.request) {
            console.log('Request was sent, but no response received');
        } else {
            console.log('Other error occurred');
        }
    }
};

export const patchProduct = async (id, updatedContent) => {
    try {
        const res = await instance.patch(`/products/${id}`, updatedContent);
        return res;
    } catch (e) {
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
            throw new Error('Product update failed');
        } else if (e.request) {
            console.log('Request was sent, but no response received');
        } else {
            console.log('Other error occurred');
        }
    }
};

export const deleteProduct = async (id) => {
    try {
        const res = await instance.delete(`/products/${id}`);
        return res;
    } catch (e) {
        if (e.response) {
            console.log(e.response.status);
            console.log(e.response.data);
            throw new Error('Product deletion failed');
        } else if (e.request) {
            console.log('Request was sent, but no response received');
        } else {
            console.log('Other error occurred');
        }
    }
};

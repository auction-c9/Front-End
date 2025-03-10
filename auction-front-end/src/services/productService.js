import axios from 'axios';
import apiConfig from '../config/apiConfig';

const getAllProducts = async () => {
    const response = await axios.get(apiConfig.products);
    return response.data;
};

const createProduct = async (productData) => {
    const formData = new FormData();
    for (const key in productData) {
        formData.append(key, productData[key]);
    }
    const response = await axios.post(apiConfig.products, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export default {
    getAllProducts,
    createProduct,
    // Các hàm khác...
};

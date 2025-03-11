import apiConfig from '../config/apiConfig';
import axios from 'axios';

const getProductById = async (id) => {
    const response = await axios.get(`${apiConfig.products}/${id}`);
    return response.data;
};

const createProduct = async (formData) => {
    const response = await axios.post(apiConfig.products, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

const productService = {
    getProductById,
    createProduct,
};

export default productService;

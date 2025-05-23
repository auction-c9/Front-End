// src/services/categoryService.js

import axios from 'axios';
import apiConfig from '../config/apiConfig';

// Service để lấy danh sách danh mục và sản phẩm từ backend
const categoryService = {
    getAllCategories: async () => {
        try {
            const response = await axios.get(apiConfig.categories);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách danh mục:', error);
            throw error;
        }
    },

    getAllProducts: async () => {
        try {
            const response = await axios.get(apiConfig.products);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            throw error;
        }
    }
};

export default categoryService;

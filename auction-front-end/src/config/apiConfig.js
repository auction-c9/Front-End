// src/config/apiConfig.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
export default {
    products: `${API_BASE_URL}/products`,
    // Các API khác...
};

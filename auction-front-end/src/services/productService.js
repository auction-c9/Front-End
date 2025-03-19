import apiConfig from '../config/apiConfig';
import axios from 'axios';

// Lấy token từ localStorage
const getAuthToken = () => localStorage.getItem('token');

const getProductById = async (id) => {
    const token = getAuthToken();
    const response = await axios.get(`${apiConfig.products}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}` // Thêm token khi lấy sản phẩm
        }
    });
    return response.data;
};

const createProduct = async (formData) => {
    const token = getAuthToken();
    // Cập nhật endpoint: thêm '/create' nếu backend định nghĩa endpoint tạo sản phẩm là '/api/products/create'
    const response = await axios.post(`${apiConfig.products}/create`, formData, {
        headers: {
            Authorization: `Bearer ${token}` // Thêm token khi tạo sản phẩm
            // Không cần set 'Content-Type': axios sẽ tự động xử lý multipart/form-data
        }
    });
    return response.data;
};



const productService = {
    getProductById,
    createProduct,
};

export default productService;

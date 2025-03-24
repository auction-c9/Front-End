import apiConfig from "../config/apiConfig";
import axios from "axios";
import * as response from "framer-motion/m";

const getCustomers = async (page, size) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.customers}?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const getCustomerById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.customers}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const getAllProductsForAdmin = async (page, size) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.adminProducts}/all?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const getProductById = async (productId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.adminProducts}/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const deleteProduct = async (productId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${apiConfig.adminProducts}/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const sendWarningEmail = async (accountId) => {
    const token = localStorage.getItem('token');

    console.log("Token lấy từ localStorage:", token);

    try {
        const response = await axios.post(
            `${apiConfig.accounts}/warning/${accountId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi email cảnh cáo:", error);
        if (error.response) {
            console.error("Chi tiết lỗi từ server:", error.response.data);
        }
        throw error;
    }
};

const getAllTransactions = async (page, size) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.adminTransactions}?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}


const adminService = {
    getCustomers,
    getCustomerById,
    getAllProductsForAdmin,
    getProductById,
    deleteProduct,
    sendWarningEmail,
    getAllTransactions,
};
export default adminService;
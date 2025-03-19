import apiConfig from "../config/apiConfig";
import axios from "axios";

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

const getProducts = async (page, size) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.adminProducts}?page=${page}&size=${size}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const getProductById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${apiConfig.adminProducts}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${apiConfig.adminProducts}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

const adminService = {
    getCustomers,
    getCustomerById,
    getProducts,
    getProductById,
    deleteProduct,
};
export default adminService;
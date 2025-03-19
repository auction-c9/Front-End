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

const customerService = {
    getCustomers,
    getCustomerById,
};
export default customerService;
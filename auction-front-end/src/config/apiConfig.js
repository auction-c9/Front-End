import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export default {
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
    bids: `${API_BASE_URL}/bids`,
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        profile: `${API_BASE_URL}/auth/profile`,
        refresh: `${API_BASE_URL}/auth/refresh`
    },
};

export const api = axios.create({
    baseURL: API_BASE_URL,
});

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
    };
};
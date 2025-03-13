import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Hàm kiểm tra route không yêu cầu token
const isUnauthorizedRoute = (url) => {
    const unauthorizedRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/refresh',
        '/auth/register-question' // Đảm bảo đúng chính tả
    ];
    return unauthorizedRoutes.some(route => url?.includes(route));
};

// ========== Các hàm quản lý token ==========
const getAccessToken = () => localStorage.getItem("accessToken");
const setAccessToken = (token) => localStorage.setItem("accessToken", token);
const setRefreshToken = (token) => localStorage.setItem("refreshToken", token);
const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

// ========== Interceptor Request ==========
api.interceptors.request.use(
    (config) => {
        // Chỉ thêm token khi không phải route unauthorized
        if (!isUnauthorizedRoute(config.url)) {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);



// ========== Export ==========
export default {
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
    bids: `${API_BASE_URL}/bids`,
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        profile: `${API_BASE_URL}/auth/profile`,
        refresh: `${API_BASE_URL}/auth/refresh`,
        registerQuestion: `${API_BASE_URL}/auth/register-question`
    },
    auctions: `${API_BASE_URL}/auctions`,
};

export {
    api,
    getAccessToken,
    setAccessToken,
    setRefreshToken,
    clearTokens
};
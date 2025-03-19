import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Hàm kiểm tra route không yêu cầu token
const isUnauthorizedRoute = (url) => {
    const unauthorizedRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/register-question',
        '/api/auth/google'
];
    return unauthorizedRoutes.some(route => url?.includes(route));
};

// ========== Quản lý Token ========== //
const getToken = () => localStorage.getItem("token");
const setToken = (token) => localStorage.setItem("token", token);
const clearTokens = () => localStorage.removeItem('token');

// Gắn token vào request tự động
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token && !isUnauthorizedRoute(config.url)) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý lỗi (Không còn refreshToken nên chỉ redirect nếu 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        if (isUnauthorizedRoute(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            clearTokens();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// ========== Export ========== //
export default {
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
    bids: `${API_BASE_URL}/bids`,
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        profile: `${API_BASE_URL}/auth/profile`,
        registerQuestion: `${API_BASE_URL}/auth/register-question`,
        google: `${API_BASE_URL}/auth/google`
    },
    auctions: `${API_BASE_URL}/auctions`,
    transactions: `${API_BASE_URL}/transactions`,
    customers: `${API_BASE_URL}/admin/customers`,
};

export {
    api,
    getToken,
    setToken,
    clearTokens
};
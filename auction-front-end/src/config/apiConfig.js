import axios from 'axios';
import jwtDecode from "jwt-decode";

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

// Xử lý lỗi: redirect nếu gặp 401 (Unauthorized)
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

// ========== Export các endpoint API ========== //
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
    adminTransactions: `${API_BASE_URL}/admin/transactions`,
    adminProducts: `${API_BASE_URL}/admin/products`,
    accounts: `${API_BASE_URL}/accounts`,
    statistics: `${API_BASE_URL}/admin/statistics/`,
    // Endpoint cho notifications
    notifications: `${API_BASE_URL}/notifications`,
    notificationsRead: `${API_BASE_URL}/notifications/read`,
    // Endpoint cho search: tìm kiếm phiên đấu giá theo tên, danh mục và giá khởi điểm
    searchAuctions: `${API_BASE_URL}/auctions/search`,
    // Nếu cần định nghĩa lại route cho profile:
    profile: (accountID) => `/auctions/profile${accountID}/`
};

export {
    api,
    getToken,
    setToken,
    clearTokens
};

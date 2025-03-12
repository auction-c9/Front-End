import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// Lấy access token từ localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Lấy refresh token từ localStorage
const getRefreshToken = () => localStorage.getItem("refreshToken");

// Set access token vào localStorage
const setAccessToken = (token) => localStorage.setItem("accessToken", token);

// Set refresh token vào localStorage
const setRefreshToken = (token) => localStorage.setItem("refreshToken", token);

// Xóa token khi đăng xuất hoặc lỗi
const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
};

// Gắn token vào request tự động
api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Xử lý tự động refresh token nếu accessToken hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    // Gửi yêu cầu refresh token
                    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    });

                    const { accessToken: newAccessToken } = res.data;

                    // Cập nhật accessToken mới
                    setAccessToken(newAccessToken);

                    // Gắn accessToken mới vào headers và gửi lại request ban đầu
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token failed", refreshError);
                    clearTokens(); // Xóa token nếu refresh thất bại
                    window.location.href = "/login"; // Chuyển về trang login
                }
            } else {
                clearTokens(); // Xóa token nếu không có refresh token
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default {
    products: `${API_BASE_URL}/products`,
    categories: `${API_BASE_URL}/categories`,
    bids: `${API_BASE_URL}/bids`,
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        profile: `${API_BASE_URL}/auth/profile`,
        refresh: `${API_BASE_URL}/auth/refresh`
    },
    auctions: `${API_BASE_URL}/auctions`,
};

export { api, getAccessToken, setAccessToken, setRefreshToken, clearTokens };

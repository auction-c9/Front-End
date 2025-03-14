// AuthService.js
import { api,setToken, clearTokens } from '../config/apiConfig';
import ENDPOINTS from '../config/apiConfig';

/**
 * Đăng nhập vào hệ thống
 * @param {Object} credentials - Thông tin đăng nhập (username, password, …)
 * @returns {Promise<Object>} Dữ liệu phản hồi từ server (token, setToken, customerId, …)
 */
const login = async (credentials) => {
    try {
        console.log("Dữ liệu gửi lên server (credentials):", JSON.stringify(credentials, null, 2));
        const response = await api.post(ENDPOINTS.auth.login, credentials);
        console.log("Phản hồi từ server:", response.data);


        const { token, customerId } = response.data;

        // Lưu accessToken và refreshToken vào localStorage thông qua hàm hỗ trợ
        setToken(token);
        // Lưu customerId vào localStorage nếu có
        if (customerId) {
            localStorage.setItem("customerId", customerId);
            console.log("✅ customerId đã được lưu:", customerId);
        } else {
            console.warn("⚠️ customerId không có trong phản hồi của API");
        }

        return response.data;
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
};

const getProfile = async () => {
    try {
        const response = await api.get(ENDPOINTS.auth.profile);
        console.log("Thông tin profile:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Lỗi lấy profile:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
};

const logout = () => {
    clearTokens();
    localStorage.removeItem("customerId");
    window.location.href = "/login";
};

const loginWithGoogle = async (googleToken) => {
    try {
        const response = await api.post(ENDPOINTS.auth.google, { token: googleToken });
        const { token, customerId } = response.data;

        setToken(token);
        if (customerId) {
            localStorage.setItem("customerId", customerId);
        }

        return response.data;
    } catch (error) {
        console.error("❌ Lỗi đăng nhập Google:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập bằng Google thất bại');
    }
};

export {
    login,
    getProfile,
    logout,
    loginWithGoogle
};

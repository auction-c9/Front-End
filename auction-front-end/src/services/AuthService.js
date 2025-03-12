import { api, setAccessToken, setRefreshToken, clearTokens } from '../config/apiConfig';
import ENDPOINTS from '../config/apiConfig';

/**
 * Đăng nhập vào hệ thống
 * @param {Object} credentials - Thông tin đăng nhập (email, password)
 * @returns {Promise<Object>} Dữ liệu phản hồi từ server (token, user info, v.v.)
 */
const login = async (credentials) => {
    try {
        console.log("Dữ liệu gửi lên server (credentials):", JSON.stringify(credentials, null, 2));
        const response = await api.post(ENDPOINTS.auth.login, credentials);
        console.log("Phản hồi từ server:", response.data);

        // Lưu accessToken và refreshToken vào localStorage
        const { accessToken, refreshToken } = response.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);

        return response.data;
    } catch (error) {
        console.error("Lỗi đăng nhập:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
};

/**
 * Lấy thông tin người dùng đang đăng nhập (profile)
 * @returns {Promise<Object>} Dữ liệu profile người dùng
 */
const getProfile = async () => {
    try {
        const response = await api.get(ENDPOINTS.auth.profile);
        return response.data;
    } catch (error) {
        console.error("Lỗi lấy profile:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
};

/**
 * Đăng xuất (clear tokens và chuyển hướng)
 */
const logout = () => {
    clearTokens();
    window.location.href = "/login"; // Chuyển về trang login
};

export { login, getProfile, logout };

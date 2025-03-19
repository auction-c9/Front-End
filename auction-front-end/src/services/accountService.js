import apiConfig from "../config/apiConfig";
import axios from "axios";

const lockAccount = async (accountId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${apiConfig.accounts}/lock/${accountId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi khóa tài khoản:", error);
        throw error;
    }
};

const unlockAccount = async (accountId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${apiConfig.accounts}/unlock/${accountId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi mở khóa tài khoản:", error);
        throw error;
    }
};

const accountService = {
    lockAccount,
    unlockAccount
};

export default accountService;

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as AuthService from "../services/AuthService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Khi load lại trang, lấy token từ localStorage và decode
    useEffect(() => {
        const initializeAuth = () => {
        const savedToken = localStorage.getItem('token');
        const savedCustomerId = localStorage.getItem('customerId');

        if (savedToken) {
            try {
                const decoded = jwtDecode(savedToken);
                setUser({ username: decoded.sub ,customerId: savedCustomerId});
                setToken(savedToken);
            } catch (err) {
                logout();
            }
        }
        setLoading(false);};
        initializeAuth();
    }, []);

    // Hàm đăng nhập
    const login = async (credentials) => {
        try {
            const { token } = await AuthService.login(credentials);
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setUser({ username: decoded.sub });
            setToken(token);
        } catch (err) {
            throw new Error('Đăng nhập thất bại');
        }
    };

    const loginWithGoogle = async (googleToken) => {
        try {
            const { token, customerId } = await AuthService.loginWithGoogle(googleToken);
            localStorage.setItem('token', token);
            if (customerId) localStorage.setItem('customerId', customerId);

            const decoded = jwtDecode(token);
            setUser({ username: decoded.sub, customerId });
            setToken(token);
        } catch (error) {
            if (error.response?.status === 409) {
                alert("Vui lòng kiểm tra email để xác nhận liên kết trước khi đăng nhập!");
            } else {
                console.error("Lỗi đăng nhập:", error);
            }
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerId'); // Nếu có lưu customerId
        setUser(null);
        setToken(null);
        window.location.href = "/login"; // Điều hướng về login
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login,loginWithGoogle , logout,setUser,setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

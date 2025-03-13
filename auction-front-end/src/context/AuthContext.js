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
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            try {
                const decoded = jwtDecode(savedToken);
                setUser({ username: decoded.sub });
                setToken(savedToken);
            } catch (err) {
                logout(); // Token lỗi thì đăng xuất
            }
        }
        setLoading(false);
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

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('customerId'); // Nếu có lưu customerId
        setUser(null);
        setToken(null);
        window.location.href = "/login"; // Điều hướng về login
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as AuthService from '../services/AuthService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthContext - User data:", user);
    }, [user]);

    useEffect(() => {
        const initializeAuth = () => {
            const savedToken = localStorage.getItem("token");

            if (savedToken) {
                try {
                    const decoded = jwtDecode(savedToken);
                    console.log("Decoded Token:", decoded); // 🐛 Debug xem token có trường id không
                    setUser({ username: decoded.sub, id: decoded.customerId, role: decoded.role });
                    setToken(savedToken);
                } catch (err) {
                    logout(); // Token lỗi
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    // Hàm đăng nhập
    const login = async (credentials) => {
        try {
            const { token } = await AuthService.login(credentials);
            localStorage.setItem("token", token);
            const decoded = jwtDecode(token);
            console.log("Decoded Token on Login:", decoded); // 🐛 Debug sau khi login
            setUser({ username: decoded.sub, id: decoded.customerId });
            setToken(token);
        } catch {
            throw new Error("Đăng nhập thất bại");
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
        setUser(null);
        setToken(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login,loginWithGoogle , logout,setUser,setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

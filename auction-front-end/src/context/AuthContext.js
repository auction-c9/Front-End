import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as AuthService from "../services/AuthService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ username: decoded.sub });
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const { token } = await AuthService.login(credentials); // Gọi service
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setUser({ username: decoded.sub });
        } catch (err) {
            throw new Error('Đăng nhập thất bại');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth = () => useContext(AuthContext);
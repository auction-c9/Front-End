import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Logout() {
    const { logout } = useAuth(); // Lấy hàm logout từ context
    const navigate = useNavigate();

    useEffect(() => {
        logout(); // Thực hiện logout và clear token
        navigate('/login'); // Điều hướng về trang login
    }, [logout, navigate]);

    return null; // Không cần render gì cả
}

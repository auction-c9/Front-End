import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap';
import { Search, ShoppingCart, Bell } from 'react-feather';
import { User as UserIcon } from "react-feather";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../styles/Header.css';

const searchSchema = Yup.object().shape({
    query: Yup.string().required('Vui lòng nhập từ khóa tìm kiếm'),
});

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState([]); // ✅ Định nghĩa useState trước khi sử dụng
    const [stompClient, setStompClient] = useState(null);  // ✅ Thêm state để lưu client WebSocket

    // 🔥 Sửa lỗi: useEffect phải nằm trong component
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-auction'); // Dùng SockJS
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
        });

        client.onConnect = () => {
            console.log('WebSocket connected');
            client.subscribe('/user/queue/notifications', (message) => {
                const notification = JSON.parse(message.body);
                setNotifications(prev => [notification, ...prev]);
            });
        };

        client.activate();
        setStompClient(client); // ✅ Lưu client vào state để quản lý

        return () => {
            client.deactivate();
        };
    }, []);

    const handleSearch = (values, { resetForm }) => {
        navigate(`/search?query=${values.query}`);
        resetForm();
    };

    return (
        <header className="header">
            {/* Top Header */}
            <div className="top-header">
                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-text">C9-Stock</Link>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <Formik
                        initialValues={{ query: '' }}
                        validationSchema={searchSchema}
                        onSubmit={handleSearch}
                    >
                        {() => (
                            <Form className="search-form">
                                <Field
                                    type="text"
                                    name="query"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="search-input"
                                />
                                <button type="submit" className="search-button">
                                    <Search size={20} />
                                </button>
                                <ErrorMessage name="query" component="div" className="error-text" />
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* User & Navigation */}
                <div className="nav-icons">
                    {/* Dropdown Thông báo */}
                    <Dropdown align="end" className="icon-link">
                        <Dropdown.Toggle as="div" style={{ cursor: "pointer" }}>
                            <Bell size={22} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ minWidth: "300px" }}>
                            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                {notifications.length > 0 ? (
                                    notifications.map((notification, index) => (
                                        <Dropdown.Item key={index}>
                                            <div>
                                                <strong>{notification.message}</strong>
                                                <div style={{ fontSize: "0.9rem" }}>
                                                    {new Date(notification.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>Không có thông báo</Dropdown.Item>
                                )}
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Link to="/cart" className="icon-link">
                        <ShoppingCart size={22} />
                    </Link>

                    {user ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                                <UserIcon size={20} className="me-2" />
                                <span>
                                    {user?.username
                                        ? `Xin chào, ${user.username.includes('@') ? user.username.split('@')[0] : user.username}`
                                        : "Tài khoản"}
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">Thông tin tài khoản</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/auction-register">Lịch sử đăng ký đấu giá</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/product/add">Thêm sản phẩm đấu giá</Dropdown.Item>
                                {user?.role === "ROLE_ADMIN" && (
                                    <Dropdown.Item as={Link} to="/admin">Trang quản trị</Dropdown.Item>
                                )}
                                <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <div className="auth-buttons">
                            <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/register')}>
                                Đăng ký
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Header (Danh mục) */}
            <div className="bottom-header">
                <nav className="category-nav">
                    <Link to="/categories" className="nav-link">Danh mục</Link>
                    <Link to="/auctions/live" className="nav-link">Đang diễn ra</Link>
                    <Link to="/auctions/upcoming" className="nav-link">Sắp diễn ra</Link>
                    <Link to="/auctions/ended" className="nav-link">Đã diễn ra</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;

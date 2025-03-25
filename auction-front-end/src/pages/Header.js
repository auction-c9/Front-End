// Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Dropdown, Badge } from 'react-bootstrap';
import { Search, ShoppingCart, Bell } from 'react-feather';
import { User as UserIcon } from "react-feather";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import '../styles/Header.css';
import NotificationDropdown from './notification/NotificationDropdown';
import CustomToggle from "./notification/CustomToggle";
import SearchBar from './search/SearchBar'; // Đường dẫn tùy theo cấu trúc thư mục

const searchSchema = Yup.object().shape({
    query: Yup.string(),
});

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // kết nối WebSocket
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socket = new SockJS("http://localhost:8080/ws-auction");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => {
                console.log(str);
            },
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('WebSocket connected');
                client.subscribe('/user/queue/notifications', (message) => {
                    try {
                        const notification = JSON.parse(message.body);
                        setNotifications(prev => [notification, ...prev]);
                    } catch (error) {
                        console.error('Error parsing notification:', error);
                    }
                });

            }
        });


        client.activate();
        return () => {
            client.deactivate();
        };
    }, [user]);
    useEffect(() => {

    }, [notifications]);


    // Fetch thông báo ban đầu khi user đã đăng nhập
    useEffect(() => {
        console.log("User object:", user);
        if (!user || !user.customerId) return;
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        fetch(`http://localhost:8080/api/notifications/${user.customerId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
        })
            .then((response) => {
                if (!response.ok) {
                    // Đọc nội dung phản hồi để biết thêm chi tiết lỗi
                    return response.text().then(text => {
                        console.error("Error response:", text);
                        throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                setNotifications(data);
            })
            .catch((error) => console.error("Error fetching notifications:", error));
    }, [user]);

    const handleSearch = (values, { resetForm }) => {
        navigate(`/search?query=${values.query}`);
        resetForm();
    };

    const handleNotificationClick = (e) => {
        e.preventDefault();
        setShowDropdown(prev => !prev);

        const token = localStorage.getItem("token");
        if (!user || !user.customerId) {
            console.error("User or customerId không tồn tại");
            return;
        }
        fetch(`http://localhost:8080/api/notifications/${user.customerId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setNotifications(data);
            })
            .catch((error) => console.error("Error fetching notifications:", error));
    };

    // Tính số lượng thông báo chưa đọc (hoặc tổng thông báo nếu không dùng isRead)
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const updateNotifications = (auctionId, customerId) => {
        setNotifications(prev => prev.map(n => {
            if (n.auctionId === auctionId && n.customerId === customerId) {
                return { ...n, isRead: true };
            }
            return n;
        }));
        const token = localStorage.getItem("token");
        fetch(`http://localhost:8080/api/notifications/read/${customerId}/${auctionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })

            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setNotifications(data);
            })
            .catch((error) => console.error("Error updating notifications:", error));
    };
    return (
        <header className="header">
            <div className="top-header">
                <div className="logo">
                    <Link to="/" className="logo-text">C9-Stock</Link>
                </div>



                <div className="nav-icons">
                    <Dropdown
                        align="end"
                        className="icon-link"
                        show={showDropdown}
                        onToggle={() => setShowDropdown(prev => !prev)}
                    >
                        <Dropdown.Toggle as={CustomToggle} onClick={handleNotificationClick}>
                            <Bell size={22} />
                            {unreadCount > 0 && (
                                <Badge bg="danger" style={{ position: 'absolute', top: 0, right: 0 }}>
                                    {unreadCount}
                                </Badge>
                            )}
                        </Dropdown.Toggle>
                        <NotificationDropdown
                            notifications={notifications}
                            updateNotifications={updateNotifications}
                        />
                    </Dropdown>

                    {/*<Link to="/cart" className="icon-link">*/}
                    {/*    <ShoppingCart size={22} />*/}
                    {/*</Link>*/}

                    {user ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                                <UserIcon size={20} className="me-2" />
                                <span>
                                    {user.username
                                        ? `Xin chào, ${user.username.includes('@') ? user.username.split('@')[0] : user.username}`
                                        : "Tài khoản"}
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">Thông tin tài khoản</Dropdown.Item>
                                {user.role === "ROLE_USER" && (
                                    <Dropdown.Item as={Link} to="/product/add">Thêm sản phẩm đấu giá</Dropdown.Item>
                                )}
                                {user.role === "ROLE_ADMIN" && (
                                    <Dropdown.Item as={Link} to="/admin">Trang dành cho admin</Dropdown.Item>
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

            <div className="bottom-header">
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <SearchBar/>
                </div>
            </div>
        </header>
    );
};

export default Header;

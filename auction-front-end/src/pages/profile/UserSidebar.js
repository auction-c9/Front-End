import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHistory, FaGavel } from "react-icons/fa";

const UserSidebar = () => {
    return (
        <div className="user-sidebar">
            <nav>
                <Link to="/profile">
                    <FaUser /> Quản lý trang cá nhân
                </Link>
                <Link to="/auction-register">
                    <FaHistory /> Lịch sử đăng ký đấu giá
                </Link>
                <Link to="/bid-history">
                    <FaGavel /> Lịch sử đấu giá mặt hàng
                </Link>
            </nav>
        </div>
    );
};

export default UserSidebar;

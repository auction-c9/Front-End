import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaMoneyBillWave } from "react-icons/fa";

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">
            <nav>
                <Link to="/admin/customers"><FaUsers /> Quản lý thành viên</Link>
                <Link to="/admin/products"><FaBoxOpen /> Quản lý sản phẩm</Link>
                <Link to="/admin/transactions"><FaMoneyBillWave /> Quản lý giao dịch</Link>
            </nav>
        </div>
    );
};

export default AdminSidebar;

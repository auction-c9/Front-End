import React from "react";
import Header from "../Header";
import AdminSidebar from "./AdminSidebar";
import "../../styles/admin.css"

const AdminDashboard = () => {
    return (
        <div>
            <Header/>
            <div className="admin-layout">
                <div className="admin-container">
                    <AdminSidebar/>
                    <div className="admin-content">
                        <h1>Trang quản trị viên</h1>
                        <p>Chào mừng bạn đến trang quản trị!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

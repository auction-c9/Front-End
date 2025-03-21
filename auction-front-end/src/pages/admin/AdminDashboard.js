import React from "react";
import AdminSidebar from "./AdminSidebar";
import "../../styles/admin.css"
import AdminStatistics from "./AdminStatistics";

const AdminDashboard = () => {
    return (
        <div>
            <div className="admin-layout">
                <div className="admin-container">
                    <AdminSidebar/>
                    <div className="admin-content">
                        <h1 className="text-3xl font-bold mb-4">Bảng điều khiển Admin</h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

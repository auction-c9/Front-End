import React, {useState} from "react";
import AdminSidebar from "./AdminSidebar";
import "../../styles/admin.css";
import UserStatistics from "./UserStatistics";
import AuctionStatistics from "./AuctionStatistics";
import TransactionStatistics from "./TransactionStatistics";

const AdminDashboard = () => {
    const [selectedTab, setSelectedTab] = useState("user");

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <AdminSidebar/>
                <div className="admin-content">

                    {/* Nút chọn loại thống kê */}
                    <div className="flex justify-center items-center space-x-4 admin-tab-buttons">
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold transition bg-gray-200 hover:bg-gray-300 mx-3 ${
                                selectedTab === "user" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => setSelectedTab("user")}
                        >
                            Thống kê Người dùng
                        </button>
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold transition bg-gray-200 hover:bg-gray-300 mx-3 ${
                                selectedTab === "auction" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => setSelectedTab("auction")}
                        >
                            Thống kê Đấu giá
                        </button>
                        <button
                            className={`px-6 py-2 rounded-lg font-semibold transition bg-gray-200 hover:bg-gray-300 mx-3 ${
                                selectedTab === "transaction" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => setSelectedTab("transaction")}
                        >
                            Thống kê Giao dịch
                        </button>
                    </div>

                    {/* Hiển thị thống kê theo lựa chọn */}
                    <div className="admin-content-container">
                        {selectedTab === "user" && <UserStatistics/>}
                        {selectedTab === "auction" && <AuctionStatistics/>}
                        {selectedTab === "transaction" && <TransactionStatistics/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

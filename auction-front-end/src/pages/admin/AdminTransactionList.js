import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminService from "../../services/adminService";
import "../../styles/admin.css";
import AdminSidebar from "./AdminSidebar";

const AdminTransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllTransactions(page, 10);
            setTransactions(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách giao dịch", error);
            toast.error("Lỗi khi lấy danh sách giao dịch!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <AdminSidebar />
                <div className="admin-content">
                    <h2>Danh sách giao dịch</h2>

                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : (
                        <>
                            <table className="transaction-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Khách hàng</th>
                                    <th>Đấu giá</th>
                                    <th>Số tiền</th>
                                    <th>Loại giao dịch</th>
                                    <th>Phương thức</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày thanh toán</th>
                                </tr>
                                </thead>
                                <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td>{tx.id}</td>
                                        <td>{tx.customerName}</td>
                                        <td>
                                            <a href={`/auction/${tx.auctionId}`} className="auction-link">
                                                {tx.productName}
                                            </a>
                                        </td>
                                        <td>{tx.amount.toLocaleString("vi-VN")} VNĐ</td>
                                        <td>{tx.transactionType}</td>
                                        <td>{tx.paymentMethod}</td>
                                        <td>{tx.status}</td>
                                        <td>{new Date(tx.createdAt).toLocaleDateString("vi-VN")}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0}
                                    style={{ padding: '5px 10px' }}
                                >
                                    ❮ Trước
                                </button>
                                <span style={{padding: '5px 10px'}}>
                                            Trang {page + 1} / {totalPages}
                                        </span>
                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages - 1}
                                    style={{padding: '5px 10px'}}
                                >
                                    Sau ❯
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTransactionList;

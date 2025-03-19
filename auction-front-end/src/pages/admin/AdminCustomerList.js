import React, { useState, useEffect } from "react";
import customerService from "../../services/customerService";
import "../../styles/admin.css"
import AdminSidebar from "./AdminSidebar";

const AdminCustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const data = await customerService.getCustomers(page, 5);
                setCustomers(data.content);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching customers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [page]);

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <AdminSidebar/>
                <div className="admin-content">
                    <h2>Danh sách thành viên</h2>

                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : (
                        <>
                            <table className="customer-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên</th>
                                    <th>Địa chỉ</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                </tr>
                                </thead>
                                <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.customerId}>
                                        <td>{customer.customerId}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.address}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="pagination">
                                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                                    ❮ Trước
                                </button>
                                <span>Trang {page + 1} / {totalPages}</span>
                                <button onClick={() => setPage(page + 1)} disabled={page === totalPages - 1}>
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

export default AdminCustomerList;

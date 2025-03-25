import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminService from "../../services/adminService";
import accountService from "../../services/accountService";
import Modal from "react-modal";
import "../../styles/admin.css";
import AdminSidebar from "./AdminSidebar";
import {FaLock, FaUnlock, FaEye, FaExclamationTriangle} from "react-icons/fa";

Modal.setAppElement("#root");

const AdminCustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await adminService.getCustomers(page, 10);
            setCustomers(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng", error);
            toast.error("Lỗi khi lấy danh sách khách hàng!");
        } finally {
            setLoading(false);
        }
    };

    const openDetailModal = async (customerId) => {
        try {
            const customerData = await adminService.getCustomerById(customerId);
            setSelectedCustomer(customerData);
            setModalIsOpen(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết khách hàng", error);
            toast.error("Lỗi khi lấy chi tiết khách hàng");
        }
    };

    const closeModal = () => {
        setSelectedCustomer(null);
        setModalIsOpen(false);
    };

    const handleLockAccount = async (accountId) => {
        try {
            const account = customers.find(customer => customer.account?.accountId === accountId);
            if (account) {
                if (account.account.locked) {
                    await accountService.unlockAccount(accountId);
                    toast.success("Tài khoản đã được mở khóa!");
                } else {
                    await accountService.lockAccount(accountId);
                    toast.success("Tài khoản đã bị khóa và email cảnh báo đã được gửi!");
                }
                fetchCustomers();
            }
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái tài khoản", error);
            toast.error("Đã xảy ra lỗi khi thực hiện thao tác.");
        }
    };

    const handleSendWarningEmail = async (accountId) => {
        try {
            console.log("Bắt đầu gửi email cảnh cáo cho accountId:", accountId);
            await adminService.sendWarningEmail(accountId);
            console.log("Gửi email cảnh cáo thành công cho accountId:", accountId);

        } catch (error) {
            console.error("Lỗi khi gửi email cảnh cáo:", error);

            // Kiểm tra nếu có response từ server
            if (error.response) {
                console.error("Chi tiết lỗi từ server:", error.response.data);
                toast.error(`Lỗi: ${error.response.data.message || "Gửi email thất bại!"}`);
            } else if (error.request) {
                // Lỗi do không nhận được phản hồi từ server
                console.error("Không nhận được phản hồi từ server:", error.request);
                toast.error("Lỗi: Không nhận được phản hồi từ máy chủ!");
            } else {
                // Lỗi xảy ra trước khi gửi request
                console.error("Lỗi khi chuẩn bị gửi request:", error.message);
                toast.error(`Lỗi: ${error.message}`);
            }
        }
    };



    return (
        <div className="admin-layout">
            <div className="admin-container">
                <AdminSidebar />
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
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
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
                                        <td>{customer.account?.locked ? "Bị khóa" : "Hoạt động"}</td>
                                        <td>
                                            <button
                                                className={customer.account?.locked ? "unlock-btn" : "lock-btn"}
                                                onClick={() => handleLockAccount(customer.account?.accountId)}
                                            >
                                                {customer.account?.locked ? <FaUnlock/> : <FaLock/>}

                                            </button>
                                            <button
                                                className="detail-btn"
                                                onClick={() => openDetailModal(customer.customerId)}
                                            >
                                                <FaEye/>
                                            </button>
                                            <button
                                                className="warning-btn"
                                                onClick={() => handleSendWarningEmail(customer.account?.accountId)}
                                            >
                                                <FaExclamationTriangle/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="pagination" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 0}
                                    style={{padding: '5px 10px'}}
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

            {/* Modal Xem chi tiết khách hàng */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="custom-modal"
                overlayClassName="overlay-modal"
            >
                <h3>Chi tiết khách hàng</h3>
                {selectedCustomer ? (
                    <div>
                        <p><strong>Tên:</strong> {selectedCustomer.name}</p>
                        <p><strong>CCCD:</strong> {selectedCustomer.identityCard}</p>
                        <p><strong>Số tài khoản:</strong> {selectedCustomer.bankAccount}</p>
                        <p><strong>Tên ngân hàng:</strong> {selectedCustomer.bankName}</p>
                        <p><strong>Trạng thái tài
                            khoản:</strong> {selectedCustomer.account?.locked ? "Bị khóa" : "Hoạt động"}</p>
                    </div>
                ) : (
                    <p>Đang tải thông tin chi tiết...</p>
                )}
                <div className="modal-actions">
                    <button className="cancel-btn" onClick={closeModal}>Đóng</button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminCustomerList;
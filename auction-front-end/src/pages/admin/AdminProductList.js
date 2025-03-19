import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminService from "../../services/adminService";
import Modal from "react-modal";
import "../../styles/admin.css";
import AdminSidebar from "./AdminSidebar";
import { FaEye, FaTrash } from "react-icons/fa";

Modal.setAppElement("#root");

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await adminService.getProducts(page, 5);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm", error);
            toast.error("Lỗi khi lấy sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    const openDetailModal = async (productId) => {
        try {
            const productData = await adminService.getProductById(productId);
            setSelectedProduct(productData);
            setModalIsOpen(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm", error);
            toast.error("Lỗi khi lấy chi tiết sản phẩm");
        }
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalIsOpen(false);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await adminService.deleteProduct(productId);
            toast.success("Sản phẩm đã bị xóa!");
            fetchProducts(); // Cập nhật lại danh sách sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm", error);
            toast.error("Đã xảy ra lỗi khi xóa sản phẩm.");
        }
    };

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <AdminSidebar />
                <div className="admin-content">
                    <h2>Danh sách sản phẩm của khách hàng</h2>

                    {loading ? (
                        <div className="loading">Đang tải...</div>
                    ) : (
                        <>
                            <table className="product-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Người đăng</th>
                                    <th>Danh mục</th>
                                    <th>Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {products.map((product) => (
                                    <tr key={product.productId}>
                                        <td>{product.productId}</td>
                                        <td>{product.name}</td>
                                        <td>{product.account?.customer?.name}</td>
                                        <td>{product.category?.name}</td>
                                        <td>
                                            <button
                                                className="detail-btn"
                                                onClick={() => openDetailModal(product.productId)}
                                            >
                                                <FaEye /> Xem chi tiết
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteProduct(product.productId)}
                                            >
                                                <FaTrash /> Xóa
                                            </button>
                                        </td>
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

            {/* Modal Xem chi tiết sản phẩm */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="custom-modal"
                overlayClassName="overlay-modal"
            >
                <h3>Chi tiết sản phẩm</h3>
                {selectedProduct ? (
                    <div>
                        <p><strong>Tên sản phẩm:</strong> {selectedProduct.name}</p>
                        <p><strong>Giá:</strong> {selectedProduct.basePrice}</p>
                        <p><strong>Ngày đăng:</strong> {selectedProduct.createdAt}</p>
                        <p><strong>Trạng thái:</strong> {selectedProduct.status}</p>
                        <p><strong>Người đăng:</strong> {selectedProduct.account?.customer?.name}</p>
                        <p><strong>Danh mục:</strong> {selectedProduct.category?.name}</p>
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

export default AdminProductList;
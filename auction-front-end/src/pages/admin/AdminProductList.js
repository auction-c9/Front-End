import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminService from "../../services/adminService";
import "../../styles/admin.css";
import AdminSidebar from "./AdminSidebar";
import { FaTrash } from "react-icons/fa";

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await adminService.getAllProductsForAdmin(page, 5);
            setProducts(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm", error);
            toast.error("Lỗi khi lấy sản phẩm!");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này vĩnh viễn?")) {
            try {
                await adminService.deleteProduct(productId);
                toast.success("Sản phẩm đã bị xóa vĩnh viễn!");
                fetchProducts();
            } catch (error) {
                console.error("Lỗi khi xóa sản phẩm", error);
                toast.error("Đã xảy ra lỗi khi xóa sản phẩm.");
            }
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
                                    <th>Mô tả</th>
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
                                        <td>{product.description}</td>
                                        <td>
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
                                <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1}>
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

export default AdminProductList;
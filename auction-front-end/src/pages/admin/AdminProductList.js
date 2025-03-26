import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import adminService from "../../services/adminService";
import "../../styles/admin.css";
import AdminSidebar from "./AdminSidebar";
import { FaTrash } from "react-icons/fa";
import CustomPagination from "../profile/CustomPagination";
import {Button, Table} from "react-bootstrap";


Modal.setAppElement("#root");

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        console.log("Fetching products for page:", page);
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log("Starting to fetch products...");

            const response = await adminService.getAllProductsForAdmin(page, 10);
            console.log("API response:", response);

            if (!response || !response.content) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }

            // Debug chi tiết từng sản phẩm
            response.content.forEach(p => {
                console.log(`Product ${p.productId}:`, {
                    name: p.name,
                    accountId: p.account?.accountId,
                    customer: p.account?.customer,
                    customerType: typeof p.account?.customer
                });
            });

            setProducts(response.content);
            setTotalPages(response.totalPages);

        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(`Lỗi khi tải sản phẩm: ${error.message}`);
            setProducts([]);
            setTotalPages(0);
        } finally {
            console.log("Fetch completed, setting loading to false");
            setLoading(false);
        }
    };

    const getCustomerName = (product) => {
        try {
            // Kiểm tra null/undefined
            if (!product?.account) return 'Không xác định';

            // Nếu customer là object đầy đủ
            if (product.account.customer && typeof product.account.customer === 'object') {
                return product.account.customer.name || `Khách hàng #${product.account.customer.customerId}`;
            }

            // Nếu customer chỉ là ID (number)
            if (typeof product.account.customer === 'number') {
                // Tìm trong danh sách đã load
                const fullCustomer = products.find(
                    p => p.account?.customer?.customerId === product.account.customer
                )?.account?.customer;

                return fullCustomer?.name || `Khách hàng #${product.account.customer}`;
            }

            return 'Không xác định';
        } catch (error) {
            console.error('Error getting customer name:', error);
            return 'Lỗi xác định';
        }
    };

    const getCategoryName = (product) => {
        return product.category?.name || 'Không có danh mục';
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedProduct(null);
        setModalIsOpen(false);
    };

    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        toast.info("Đang xóa sản phẩm...");
        try {
            await adminService.deleteProduct(selectedProduct.productId);
            toast.success("Sản phẩm đã bị xóa thành công! Email đã gửi đến người đăng bài.");

            // Nếu xóa sản phẩm cuối cùng trên trang
            if (products.length === 1 && page > 0) {
                setPage(page - 1);
            } else {
                fetchProducts();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error(`Xóa sản phẩm thất bại: ${error.message}`);
        } finally {
            closeModal();
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="admin-layout">
            <div className="admin-container">
                <AdminSidebar />
                <div className="admin-content">
                    <h2>Danh sách sản phẩm của khách hàng</h2>

                    {loading ? (
                        <div className="loading" style={{ padding: '20px', textAlign: 'center' }}>
                            Đang tải dữ liệu...
                        </div>
                    ) : (
                        <>
                            {products.length === 0 ? (
                                <div className="no-products" style={{ padding: '20px', textAlign: 'center' }}>
                                    Không tìm thấy sản phẩm nào
                                </div>
                            ) : (
                                <>
                                    <Table striped bordered hover className="product-table" style={{ width: '100%', marginTop: '20px' }}>
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
                                                <td>{getCustomerName(product)}</td>
                                                <td>{getCategoryName(product)}</td>
                                                <td>{product.description || 'Không có mô tả'}</td>
                                                <td>
                                                    <Button
                                                        className="delete-btn"
                                                        onClick={() => openModal(product)}
                                                    >
                                                        <FaTrash  />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>

                                    <CustomPagination
                                        currentPage={page}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        maxVisiblePages={5}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        overlay: { zIndex: 1050, backgroundColor: "rgba(0, 0, 0, 0.5)" },
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '500px'
                    }
                }}
            >
                <h2>Xác nhận xóa</h2>
                <p>Bạn có chắc chắn muốn xóa sản phẩm "<b>{selectedProduct?.name}</b>" không?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button
                        onClick={closeModal}
                        style={{ padding: '5px 15px', background: '#ccc' }}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleDeleteProduct}
                        style={{ padding: '5px 15px', background: '#ff4444', color: 'white' }}
                    >
                        Xóa
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminProductList;
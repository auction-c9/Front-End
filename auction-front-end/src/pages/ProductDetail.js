import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Lỗi khi tải chi tiết sản phẩm:', error);
                toast.error('❌ Không thể tải chi tiết sản phẩm!');
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div>Đang tải...</div>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Chi tiết sản phẩm</h2>
            <div style={{ marginBottom: '20px' }}>
                <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>← Quay lại danh sách</Link>
            </div>

            <h3>{product.name}</h3>

            <div style={{ marginBottom: '15px' }}>
                <strong>Danh mục:</strong> {product.category?.name || 'Chưa xác định'}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Mô tả:</strong>
                <p>{product.description}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Giá khởi điểm:</strong> {formatCurrency(product.basePrice)}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Bước giá:</strong> {formatCurrency(product.bidStep)}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Thời gian bắt đầu:</strong> {format(new Date(product.auctionStartTime), 'dd/MM/yyyy HH:mm')}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <strong>Thời gian kết thúc:</strong> {format(new Date(product.auctionEndTime), 'dd/MM/yyyy HH:mm')}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <strong>Ảnh đại diện:</strong>
                <div>
                    <img src={product.avatarUrl} alt="Avatar" style={{ maxWidth: '300px', borderRadius: '8px', marginTop: '10px' }} />
                </div>
            </div>

            <div>
                <strong>Ảnh chi tiết:</strong>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                        product.imageUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Detail ${index}`} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                        ))
                    ) : (
                        <p>Không có ảnh chi tiết</p>
                    )}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default ProductDetail;

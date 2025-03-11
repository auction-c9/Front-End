// src/components/ProductList.js
import React, { useEffect, useState } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        productService.getAllProducts()
            .then(data => setProducts(data))
            .catch(error => {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            });
    }, []);

    return (
        <div>
            <h2>Danh sách sản phẩm</h2>
            {products.length === 0 ? (
                <p>Không có sản phẩm nào</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ccc', padding: '8px', width: '250px' }}>
                            <h3>{product.name}</h3>
                            <p>Mô tả: {product.description}</p>
                            <p>Giá: {product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;

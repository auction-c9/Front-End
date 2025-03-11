// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const searchSchema = Yup.object().shape({
    query: Yup.string().required('Vui lòng nhập từ khóa tìm kiếm'),
});

const Header = () => {
    const navigate = useNavigate();

    const handleSearch = (values, { resetForm }) => {
        console.log('Searching for:', values.query);
        // Ví dụ: chuyển hướng đến trang kết quả tìm kiếm với query
        navigate(`/search?query=${values.query}`);
        resetForm();
    };

    return (
        <header>
            {/* Header trên cùng */}
            <div className="top-header">
                <div className="logo">
                    <Link to="/">C9-Stock</Link>
                </div>
                <div className="search-container">
                    <Formik
                        initialValues={{ query: '' }}
                        validationSchema={searchSchema}
                        onSubmit={handleSearch}
                    >
                        {() => (
                            <Form>
                                <Field
                                    type="text"
                                    name="query"
                                    placeholder="Search for auctions by category, product, seller..."
                                />
                                <button type="submit">Tìm kiếm</button>
                                <ErrorMessage name="query" component="div" style={{ color: 'red' }} />
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="nav-links">
                    <Link to="/buyers">For Buyers</Link>
                    <Link to="/sellers">For Sellers</Link>
                    <Link to="/support">Hỗ trợ</Link>
                </div>
                <div className="auth-links">
                    <button className="sign-in">Đăng nhập</button>
                    <button className="register-now">Đăng ký</button>
                    <Link to="/add-product">
                        <button className="register-now">Thêm sản phẩm</button>
                    </Link>
                </div>
            </div>

            {/* Header bên dưới (danh sách danh mục) */}
            <div className="bottom-header">
                <nav className="category-nav">
                    <Link to="/auctions">Tất cả sản phẩm</Link>
                    <Link to="/category/appliances">Thiết bị gia dụng</Link>
                    <Link to="/category/mobile">Điện thoại di động</Link>
                    <Link to="/categories">Tất cả danh mục</Link>
                    <Link to="/brand/samsung">Samsung</Link>
                    <Link to="/sellers">Tất cả người bán</Link>
                    <Link to="/auctions/live">Đang diễn ra</Link>
                    <Link to="/auctions/new">Hàng mới</Link>
                    <Link to="/status">Tất cả tình trạng</Link>
                    <Link to="/region/northeast">Miền Đông Bắc</Link>
                    <Link to="/region/central-west">Miền Trung Tây</Link>
                    <Link to="/region/south">Miền Nam</Link>
                    <Link to="/regions">Tất cả khu vực</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;

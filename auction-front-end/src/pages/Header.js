import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from "../context/AuthContext";
import { Dropdown } from 'react-bootstrap';
import '../styles/Header.css'; // Nếu bạn muốn tách style riêng

const searchSchema = Yup.object().shape({
    query: Yup.string().required('Vui lòng nhập từ khóa tìm kiếm'),
});

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSearch = (values, { resetForm }) => {
        console.log('Searching for:', values.query);
        navigate(`/search?query=${values.query}`);
        resetForm();
    };

    return (
        <header>
            {/* Top Header */}
            <div className="top-header d-flex justify-content-between align-items-center p-3 shadow-sm">
                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-text">C9-Stock</Link>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <Formik
                        initialValues={{ query: '' }}
                        validationSchema={searchSchema}
                        onSubmit={handleSearch}
                    >
                        {() => (
                            <Form className="d-flex">
                                <Field
                                    type="text"
                                    name="query"
                                    placeholder="Tìm kiếm sản phẩm, danh mục, người bán..."
                                    className="form-control me-2"
                                />
                                <button type="submit" className="btn btn-primary">Tìm kiếm</button>
                                <ErrorMessage name="query" component="div" className="text-danger mt-1" />
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* Navigation & Auth */}
                <div className="d-flex align-items-center gap-3">
                    <Link to="/buyers" className="nav-link">Dành cho người mua</Link>
                    <Link to="/sellers" className="nav-link">Dành cho người bán</Link>
                    <Link to="/support" className="nav-link">Hỗ trợ</Link>

                    {user ? (
                        // Khi đã đăng nhập
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic">
                                Xin chào, {user.username}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">Thông tin tài khoản</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/product/add">Thêm sản phẩm đấu giá</Dropdown.Item> {/* Nút thêm sản phẩm */}
                                <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        // Khi chưa đăng nhập
                        <>
                            <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/register')}>
                                Đăng ký
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Bottom Header (Danh mục) */}
            <div className="bottom-header bg-light p-2 shadow-sm">
                <nav className="category-nav d-flex flex-wrap justify-content-center gap-3">
                    <Link to="/auctions" className="nav-link">Tất cả sản phẩm</Link>
                    <Link to="/category/appliances" className="nav-link">Thiết bị gia dụng</Link>
                    <Link to="/category/mobile" className="nav-link">Điện thoại di động</Link>
                    <Link to="/categories" className="nav-link">Tất cả danh mục</Link>
                    <Link to="/brand/samsung" className="nav-link">Samsung</Link>
                    <Link to="/sellers" className="nav-link">Tất cả người bán</Link>
                    <Link to="/auctions/live" className="nav-link">Đang diễn ra</Link>
                    <Link to="/auctions/new" className="nav-link">Hàng mới</Link>
                    <Link to="/status" className="nav-link">Tình trạng</Link>
                    <Link to="/region/northeast" className="nav-link">Miền Đông Bắc</Link>
                    <Link to="/region/central-west" className="nav-link">Miền Trung Tây</Link>
                    <Link to="/region/south" className="nav-link">Miền Nam</Link>
                    <Link to="/regions" className="nav-link">Khu vực khác</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;

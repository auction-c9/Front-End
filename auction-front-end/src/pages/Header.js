import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {useAuth} from '../context/AuthContext';
import {Dropdown} from 'react-bootstrap';
import {Search, ShoppingCart, User, Menu} from 'react-feather';
import {User as UserIcon} from "react-feather";
import '../styles/Header.css';

const searchSchema = Yup.object().shape({
    query: Yup.string().required('Vui lòng nhập từ khóa tìm kiếm'),
});

const Header = () => {
    const navigate = useNavigate();
    const {user, logout} = useAuth();

    const handleSearch = (values, {resetForm}) => {
        navigate(`/search?query=${values.query}`);
        resetForm();
    };

    return (
        <header className="header">
            {/* Top Header */}
            <div className="top-header">
                {/* Logo */}
                <div className="logo">
                    <Link to="/" className="logo-text">C9-Stock</Link>
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <Formik
                        initialValues={{query: ''}}
                        validationSchema={searchSchema}
                        onSubmit={handleSearch}
                    >
                        {() => (
                            <Form className="search-form">
                                <Field
                                    type="text"
                                    name="query"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="search-input"
                                />
                                <button type="submit" className="search-button">
                                    <Search size={20}/>
                                </button>
                                <ErrorMessage name="query" component="div" className="error-text"/>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* User & Navigation */}
                <div className="nav-icons">
                    <Link to="/cart" className="icon-link">
                        <ShoppingCart size={22}/>
                    </Link>

                    {user ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                                <UserIcon size={20} className="me-2"/>
                                <span>
        {user?.username
            ? `Xin chào, ${user.username.includes('@') ? user.username.split('@')[0] : user.username}`
            : "Tài khoản"}
    </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/profile">Thông tin tài khoản</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/product/add">Thêm sản phẩm đấu giá</Dropdown.Item>
                                <Dropdown.Item onClick={logout}>Đăng xuất</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <>
                            <>
                                {!user && (
                                    <div className="auth-buttons">
                                        <button className="btn btn-outline-primary" onClick={() => navigate('/login')}>
                                            Đăng nhập
                                        </button>
                                        <button className="btn btn-primary" onClick={() => navigate('/register')}>
                                            Đăng ký
                                        </button>
                                    </div>
                                )}

                            </>

                        </>
                    )}
                </div>
            </div>

            {/* Bottom Header (Danh mục) */}
            <div className="bottom-header">
                <nav className="category-nav">
                    <Link to="/categories" className="nav-link">Danh mục</Link>
                    <Link to="/auctions/live" className="nav-link">Đang diễn ra</Link>
                    <Link to="/auctions/upcoming" className="nav-link">Sắp diễn ra</Link>
                    <Link to="/auctions/ended" className="nav-link">Đã diễn ra</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;

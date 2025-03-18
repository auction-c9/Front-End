import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'react-feather';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h4>Thông tin</h4>
                    <ul>
                        <li><Link to="/about">Giới thiệu</Link></li>
                        <li><Link to="/contact">Liên hệ</Link></li>
                        <li><Link to="/terms">Điều khoản</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Hỗ trợ</h4>
                    <ul>
                        <li><Link to="/faq">Câu hỏi thường gặp</Link></li>
                        <li><Link to="/support">Trung tâm hỗ trợ</Link></li>
                        <li><Link to="/shipping">Vận chuyển & Thanh toán</Link></li>
                    </ul>
                </div>
                
                <div className="footer-column">
                    <h4>Kết nối với chúng tôi</h4>
                    <div className="social-icons">
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                    </div>
                </div>
            </div>

            {/* Bản quyền */}
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} C9-Stock. Bản quyền thuộc về chúng tôi.
            </div>
        </footer>
    );
};

export default Footer;

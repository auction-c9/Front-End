// src/components/Sidebar.js
import React from 'react';
import ToggleSection from './ToggleSection';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            {/* Section: Vị trí */}
            <details>
                <summary>Vị trí</summary>
                <div className="filter-content">
                    <label>
                        <input type="checkbox" name="location" value="Hà Nội" /> Hà Nội
                    </label>
                    <label>
                        <input type="checkbox" name="location" value="Đà Nẵng" /> Đà Nẵng
                    </label>
                    <label>
                        <input type="checkbox" name="location" value="Hồ Chí Minh" /> Hồ Chí Minh
                    </label>
                    <Link to="#" className="see-all">
                        Xem thêm
                    </Link>
                </div>
            </details>

            {/* Section: Tình trạng */}
            <details>
                <summary>Tình trạng</summary>
                <div className="filter-content">
                    <label>
                        <input type="checkbox" name="condition" value="New" /> Mới
                    </label>
                    <label>
                        <input type="checkbox" name="condition" value="Like New" /> Như Mới
                    </label>
                    <label>
                        <input type="checkbox" name="condition" value="Mixed Condition" /> Nhiều tình trạng
                    </label>
                    <label>
                        <input type="checkbox" name="condition" value="Scratch & Dent Appliances" /> Hàng trầy xước
                    </label>
                    <ToggleSection>
                        <>
                            <label>
                                <input type="checkbox" name="condition" value="Unspecified" /> Không xác định
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used - Fair" /> Đã qua sử dụng - Khá
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used - Good" /> Đã qua sử dụng - Tốt
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used A" /> Đã qua sử dụng A
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used B" /> Đã qua sử dụng B
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used C" /> Đã qua sử dụng C
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used D" /> Đã qua sử dụng D
                            </label>
                            <label>
                                <input type="checkbox" name="condition" value="Used E" /> Đã qua sử dụng E
                            </label>
                        </>
                    </ToggleSection>
                </div>
            </details>

            {/* Section: Hình thức vận chuyển */}
            <details>
                <summary>Hình thức vận chuyển</summary>
                <div className="filter-content">
                    <label>
                        <input type="checkbox" name="shipment-type" value="LTL" /> LTL (Hàng ghép)
                    </label>
                    <label>
                        <input type="checkbox" name="shipment-type" value="Parcel" /> Bưu kiện (Parcel)
                    </label>
                    <label>
                        <input type="checkbox" name="shipment-type" value="Truckload" /> Nguyên xe (Truckload)
                    </label>
                </div>
            </details>

            {/* Section: Danh mục */}
            <details>
                <summary>Danh mục</summary>
                <div className="filter-content">
                    <label>
                        <input type="checkbox" name="category" value="Apparel, Shoes & Accessories" /> Quần áo, Giày dép & Phụ kiện
                    </label>
                    <label>
                        <input type="checkbox" name="category" value="Appliances" /> Đồ gia dụng
                    </label>
                    <label>
                        <input type="checkbox" name="category" value="Automotive Supplies" /> Phụ tùng ô tô
                    </label>
                    <label>
                        <input type="checkbox" name="category" value="Books, Movies & Music" /> Sách, Phim & Nhạc
                    </label>
                    <label>
                        <input type="checkbox" name="category" value="Building & Industrial" /> Xây dựng & Công nghiệp
                    </label>
                    <ToggleSection>
                        <>
                            <label>
                                <input type="checkbox" name="category" value="Cell Phones" /> Điện thoại di động
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Electronics" /> Thiết bị điện tử
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Furniture" /> Nội thất
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Groceries" /> Hàng tạp hóa
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Health & Beauty" /> Sức khỏe & Làm đẹp
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Home & Garden" /> Nhà & Vườn
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Jewelry & Watches" /> Trang sức & Đồng hồ
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Mixed Lots" /> Hỗn hợp
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Office Supplies & Equipment" /> Văn phòng phẩm & Thiết bị
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Other" /> Khác
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Sports & Outdoors" /> Thể thao & Ngoài trời
                            </label>
                            <label>
                                <input type="checkbox" name="category" value="Toys, Kids & Baby" /> Đồ chơi, Trẻ em & Em bé
                            </label>
                        </>
                    </ToggleSection>
                </div>
            </details>

            {/* Section: Giá */}
            <details>
                <summary>Giá</summary>
                <div className="filter-content">
                    <div className="price-range">
                        <input type="text" placeholder="Từ" />
                        <span>-</span>
                        <input type="text" placeholder="Đến" />
                    </div>
                    <Link to="#" className="see-all">
                        Áp dụng
                    </Link>
                </div>
            </details>
        </aside>
    );
};

export default Sidebar;

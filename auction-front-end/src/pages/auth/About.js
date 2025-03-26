import React from "react";

const AboutAuction = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4">GIỚI THIỆU VỀ TRANG WEB ĐẤU GIÁ</h1>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">1. Tổng Quan</h2>
                <p>Chào mừng bạn đến với <strong>C9 Stock</strong>, nền tảng đấu giá trực tuyến hàng đầu, kết nối người mua và người bán một cách dễ dàng, minh bạch và an toàn.</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">2. Sứ Mệnh và Tầm Nhìn</h2>
                <ul className="list-disc pl-5">
                    <li><strong>Sứ mệnh:</strong> Cung cấp một môi trường đấu giá công bằng, minh bạch và đáng tin cậy.</li>
                    <li><strong>Tầm nhìn:</strong> Trở thành nền tảng đấu giá trực tuyến hàng đầu tại Việt Nam.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">3. Lợi Ích Khi Tham Gia Đấu Giá</h2>
                <ul className="list-disc pl-5">
                    <li>Hàng ngàn sản phẩm thuộc nhiều danh mục khác nhau.</li>
                    <li>Hệ thống đấu giá minh bạch và công khai.</li>
                    <li>Thanh toán linh hoạt với VNPAY và PayPal.</li>
                    <li>Hỗ trợ khách hàng 24/7.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">4. Cách Thức Hoạt Động</h2>
                <ol className="list-decimal pl-5">
                    <li>Đăng ký tài khoản.</li>
                    <li>Tìm kiếm và lựa chọn sản phẩm.</li>
                    <li>Đặt giá và tham gia đấu giá.</li>
                    <li>Thanh toán và nhận hàng.</li>
                </ol>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">5. Chính Sách Bảo Mật</h2>
                <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và áp dụng các biện pháp bảo mật cao cấp để đảm bảo an toàn giao dịch.</p>
            </section>

        </div>
    );
};

export default AboutAuction;

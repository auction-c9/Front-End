import React from "react";

const TermsOfService = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4">ĐIỀU KHOẢN DỊCH VỤ</h1>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">1. Giới thiệu</h2>
                <p>Chào mừng bạn đến với <strong>C9 Stock</strong>. Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">2. Quyền và trách nhiệm của người dùng</h2>
                <ul className="list-disc pl-5">
                    <li>Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
                    <li>Không được thực hiện hành vi gian lận hoặc vi phạm pháp luật trong quá trình đấu giá.</li>
                    <li>Chịu trách nhiệm với mọi giao dịch thực hiện trên tài khoản của mình.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">3. Quy định đấu giá</h2>
                <ul className="list-disc pl-5">
                    <li>Người tham gia phải đặt giá theo các bước giá hợp lệ.</li>
                    <li>Người trả giá cao nhất khi phiên đấu giá kết thúc sẽ là người chiến thắng.</li>
                    <li>Người chiến thắng có trách nhiệm hoàn tất thanh toán trong thời gian quy định.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">4. Phương thức thanh toán</h2>
                <p>Chúng tôi hỗ trợ nhiều phương thức thanh toán như VNPAY, PayPal để tạo sự thuận tiện cho khách hàng.</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">5. Xử lý vi phạm</h2>
                <p>Chúng tôi có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện hành vi vi phạm điều khoản sử dụng.</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">6. Liên hệ</h2>
                <p>Nếu có bất kỳ thắc mắc nào về điều khoản dịch vụ, vui lòng liên hệ với chúng tôi qua email: <strong>daugia123@gmail.com</strong>.</p>
            </section>
        </div>
    );
};

export default TermsOfService;
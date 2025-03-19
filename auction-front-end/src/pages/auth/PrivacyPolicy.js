import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold text-center mb-4">CHÍNH SÁCH BẢO MẬT</h1>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">1. Giới thiệu</h2>
                <p>Chúng tôi cam kết bảo vệ quyền riêng tư của người dùng khi truy cập và sử dụng dịch vụ trên trang web đấu giá...</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">2. Thu thập thông tin</h2>
                <ul className="list-disc pl-5">
                    <li><strong>Thông tin cá nhân</strong>: Họ tên, email, số điện thoại, địa chỉ, thông tin thanh toán.</li>
                    <li><strong>Thông tin giao dịch</strong>: Lịch sử đấu giá, số tiền thanh toán, phương thức thanh toán.</li>
                    <li><strong>Thông tin kỹ thuật</strong>: Địa chỉ IP, loại trình duyệt, thiết bị truy cập.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">3. Mục đích sử dụng thông tin</h2>
                <ul className="list-disc pl-5">
                    <li>Cung cấp và quản lý dịch vụ đấu giá.</li>
                    <li>Xác minh danh tính và xử lý giao dịch thanh toán.</li>
                    <li>Cải thiện trải nghiệm người dùng và dịch vụ.</li>
                    <li>Đảm bảo an toàn và ngăn chặn các hành vi gian lận.</li>
                    <li>Tuân thủ các quy định pháp luật liên quan.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">4. Bảo mật thông tin</h2>
                <p>Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của người dùng khỏi mất mát, truy cập trái phép hoặc rò rỉ thông tin.</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">5. Chia sẻ thông tin</h2>
                <p>Chúng tôi không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ các trường hợp sau:</p>
                <ul className="list-disc pl-5">
                    <li>Khi có sự đồng ý của bạn.</li>
                    <li>Khi cần thiết để xử lý giao dịch thanh toán.</li>
                    <li>Khi có yêu cầu từ cơ quan pháp luật.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">6. Quyền của người dùng</h2>
                <ul className="list-disc pl-5">
                    <li>Truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình.</li>
                    <li>Hủy đăng ký nhận thông tin quảng cáo.</li>
                    <li>Yêu cầu ngừng xử lý dữ liệu cá nhân trong một số trường hợp nhất định.</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">7. Thay đổi chính sách</h2>
                <p>Chúng tôi có thể cập nhật chính sách bảo mật này bất cứ lúc nào. Mọi thay đổi sẽ được thông báo trên trang web.</p>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">8. Liên hệ</h2>
                <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: <strong>daugia123@gmail.com</strong>.</p>
            </section>
        </div>
    );
};

export default PrivacyPolicy;

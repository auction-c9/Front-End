import React from "react";
import {FaRegEdit, FaShieldAlt, FaCheckCircle, FaTools, FaUserShield} from "react-icons/fa";  // Import các icon phù hợp

const PrivacyPolicy = () => {
    return (
        <div className="container mx-auto p-4">
            <div>
            <h1 className="text-2xl font-bold text-center mb-4">CHÍNH SÁCH BẢO MẬT</h1>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">1. Giới thiệu</h2>
                <ul>
                    <p>Chúng tôi cam kết bảo vệ quyền riêng tư của người dùng khi truy cập và sử dụng dịch vụ trên trang
                        web đấu giá. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông
                        tin cá nhân của bạn.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">2. Thu thập thông tin</h2>
                <ul>
                    <p><FaUserShield/> <span className="font-semibold">Thông tin cá nhân:</span> Chúng tôi thu thập
                        thông tin như họ tên, email, số điện thoại, địa chỉ và thông tin thanh toán của bạn.</p>
                    <p><FaTools/> <span className="font-semibold">Thông tin giao dịch:</span> Bao gồm lịch sử đấu giá,
                        số tiền thanh toán và phương thức thanh toán của bạn.</p>
                    <p><FaShieldAlt/> <span className="font-semibold">Thông tin kỹ thuật:</span> Chúng tôi thu thập địa
                        chỉ IP, loại trình duyệt và thiết bị mà bạn sử dụng để truy cập dịch vụ.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">3. Mục đích sử dụng thông tin</h2>
                <ul>
                    <p><FaCheckCircle/> Cung cấp dịch vụ đấu giá: Chúng tôi sử dụng thông tin của bạn để cung cấp và
                        quản lý dịch vụ đấu giá.</p>
                    <p><FaShieldAlt/> Xác minh và xử lý giao dịch: Chúng tôi sử dụng thông tin để xác minh danh tính và
                        xử lý các giao dịch thanh toán của bạn.</p>
                    <p><FaRegEdit/> Cải thiện trải nghiệm: Thông tin được sử dụng để cải thiện trải nghiệm người dùng và
                        nâng cao chất lượng dịch vụ.</p>
                    <p><FaUserShield/> Đảm bảo an toàn: Chúng tôi sử dụng thông tin để bảo vệ dịch vụ khỏi các hành vi
                        gian lận và đảm bảo sự an toàn cho người dùng.</p>
                    <p><FaTools/> Tuân thủ pháp luật: Chúng tôi sử dụng thông tin để tuân thủ các quy định pháp luật
                        hiện hành.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">4. Bảo mật thông tin</h2>
                <ul><p>Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của người dùng khỏi
                    mất mát, truy cập trái phép hoặc rò rỉ thông tin. Tuy nhiên, không có phương thức truyền tải dữ liệu
                    qua Internet nào là hoàn toàn an toàn, vì vậy chúng tôi không thể đảm bảo tuyệt đối về mức độ bảo
                    mật.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">5. Chia sẻ thông tin</h2>
                <ul>
                    <p><FaCheckCircle/> Sự đồng ý của bạn: Chúng tôi chỉ chia sẻ thông tin khi có sự đồng ý của bạn.</p>
                    <p><FaTools/> Cần thiết cho giao dịch: Chúng tôi chia sẻ thông tin khi cần thiết để xử lý giao dịch
                        thanh toán.</p>
                    <p><FaShieldAlt/> Yêu cầu từ cơ quan pháp luật: Chúng tôi có thể chia sẻ thông tin nếu có yêu cầu từ
                        cơ quan pháp luật hoặc khi chúng tôi tin rằng việc chia sẻ là cần thiết để bảo vệ quyền lợi hợp
                        pháp của chúng tôi.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">6. Quyền của người dùng</h2>
                <ul>
                    <p><FaRegEdit/> Quyền truy cập và chỉnh sửa: Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá
                        nhân của mình bất cứ lúc nào.</p>
                    <p><FaRegEdit/> Hủy đăng ký quảng cáo: Bạn có quyền hủy đăng ký nhận thông tin quảng cáo từ chúng
                        tôi.</p>
                    <p><FaUserShield/> Yêu cầu ngừng xử lý dữ liệu: Bạn có quyền yêu cầu ngừng xử lý dữ liệu cá nhân
                        trong các trường hợp nhất định, chẳng hạn như khi thông tin không còn chính xác hoặc khi bạn rút
                        lại sự đồng ý của mình.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">7. Thay đổi chính sách</h2>
                <ul><p>Chúng tôi có thể cập nhật chính sách bảo mật này bất cứ lúc nào. Mọi thay đổi sẽ được thông báo
                    trên
                    trang web của chúng tôi và sẽ có hiệu lực ngay khi được công bố.</p>
                </ul>
            </section>

            <section className="mb-4">
                <h2 className="text-xl font-semibold">8. Liên hệ</h2>
                <ul><p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này hoặc cách thức chúng tôi xử lý dữ liệu
                    của
                    bạn, vui lòng liên hệ với chúng tôi qua email: <strong>daugia123@gmail.com</strong>.</p>
                </ul>
            </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;

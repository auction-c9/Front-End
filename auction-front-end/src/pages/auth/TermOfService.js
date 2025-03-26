import React from "react";
import {Container} from "react-bootstrap";

const TermsOfService = () => {
    return (
        <Container className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">ĐIỀU KHOẢN DỊCH VỤ</h1>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">1. Giới thiệu</h2>
                <p className="text-lg">Chào mừng bạn đến với <strong>C9 Stock</strong>. Bằng việc truy cập và sử dụng
                    dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">2. Quyền và trách nhiệm của người dùng</h2>
                <div className="pl-6">
                    <p className="text-lg">2.1 Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản.</p>
                    <p className="text-lg">2.2 Không được thực hiện hành vi gian lận hoặc vi phạm pháp luật trong quá
                        trình đấu giá.</p>
                    <p className="text-lg">2.3 Chịu trách nhiệm với mọi giao dịch thực hiện trên tài khoản của mình.</p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">3. Quy định đấu giá</h2>
                <div className="pl-6">
                    <p className="text-lg">3.1 Người tham gia phải đặt giá theo các bước giá hợp lệ.</p>
                    <p className="text-lg">3.2 Người trả giá cao nhất khi phiên đấu giá kết thúc sẽ là người chiến
                        thắng.</p>
                    <p className="text-lg">3.3 Người chiến thắng có trách nhiệm hoàn tất thanh toán trong thời gian quy
                        định.</p>
                    <p className="text-lg">
                        3.4 Để tham gia đấu giá, người dùng cần đặt cọc trước một khoản tiền bằng <strong>10% giá trị
                        khởi điểm</strong> của sản phẩm.
                        Tuy nhiên, số tiền đặt cọc tối thiểu là <strong>10.000 VND</strong>, ngay cả khi 10% giá trị
                        khởi điểm thấp hơn mức này.
                        Khoản đặt cọc sẽ được hoàn lại sau 5 ngày làm việc nếu người dùng không thắng đấu giá và không
                        vi phạm quy định đấu giá của chúng tôi.
                    </p>
                    <p className="text-lg">
                        3.5 Đối với người bán, cần đặt cọc <strong>20% giá trị khởi điểm</strong> của sản phẩm. Sau khi
                        kết thúc phiên đấu giá, hệ thống sẽ thu <strong>10% giá bán</strong> làm phí giao dịch.
                    </p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">4. Quy định sản phẩm</h2>
                <div className="pl-6">
                    <p className="text-lg">4.1 Người bán có trách nhiệm tuân thủ các quy định của Luật Thương Mại và các
                        văn bản pháp luật liên quan đến hoạt động trưng bày, giới thiệu hàng hóa.</p>
                    <p className="text-lg">4.2 Người bán phải đảm bảo tất cả chứng từ cung cấp cho trang web đều được
                        scan từ chứng từ gốc, không được làm giả, chỉnh sửa, tẩy xóa.</p>
                    <p className="text-lg">4.3 Người Bán được quyền đăng các sản phẩm lên trang web để đấu giá. Tuy
                        nhiên, <strong>NGHIÊM CẤM</strong> đăng tải các sản phẩm sau:</p>
                    <div className="pl-8">
                        <p className="text-lg">- Sản phẩm có nội dung phản động, chống phá, khiêu dâm, bạo lực, đi ngược
                            thuần phong mỹ tục, xâm phạm chủ quyền, an ninh quốc gia.</p>
                        <p className="text-lg">- Sản phẩm chứa thông tin sai lệch, làm mất uy tín của trang web.</p>
                        <p className="text-lg">- Sản phẩm xúc phạm, khích bác đến người khác dưới bất kỳ hình thức
                            nào.</p>
                        <p className="text-lg">- Sản phẩm tuyên truyền thông tin bị pháp luật nghiêm cấm như: ma túy, vũ
                            khí, bạo lực.</p>
                        <p className="text-lg">- Các sản phẩm văn hóa đồi trụy (băng đĩa, sách báo, vật phẩm).</p>
                        <p className="text-lg">- Tài liệu bí mật quốc gia, bí mật kinh doanh, bí mật cá nhân.</p>
                        <p className="text-lg">- Con người và/hoặc các bộ phận cơ thể con người.</p>
                        <p className="text-lg">- Động vật và chế phẩm từ động vật (bao gồm động vật hoang dã).</p>
                        <p className="text-lg">- Sản phẩm có tính chất phân biệt chủng tộc, xúc phạm đến dân tộc hoặc
                            quốc gia khác.</p>
                        <p className="text-lg">- Hình ảnh mang tính cá nhân (hình cá nhân, gia đình, trẻ em).</p>
                        <p className="text-lg">- Vi phạm quyền sở hữu trí tuệ và/hoặc nhãn hiệu hàng hóa của bên thứ
                            ba.</p>
                        <p className="text-lg">- Sản phẩm nằm trong danh sách cấm/hạn chế theo quy định của pháp
                            luật.</p>
                    </div>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">5. Các hành vi không được thực hiện</h2>
                <div className="pl-6">
                    <p className="text-lg">5.1 Sử dụng thông tin, hình ảnh, âm thanh vi phạm pháp luật, trái với thuần
                        phong mỹ tục Việt Nam.</p>
                    <p className="text-lg">5.2 Xúc phạm uy tín, danh dự, nhân phẩm của tổ chức, cá nhân.</p>
                    <p className="text-lg">5.3 Sử dụng hình ảnh, lời nói, chữ viết của cá nhân khi chưa có sự đồng
                        ý.</p>
                    <p className="text-lg">5.4 Cung cấp thông tin sai lệch về khả năng kinh doanh, chất lượng, giá,
                        nguồn gốc sản phẩm.</p>
                    <p className="text-lg">5.5 Cạnh tranh không lành mạnh theo quy định pháp luật.</p>
                    <p className="text-lg">5.6 Quảng cáo cho doanh nghiệp khác bằng cách chèn logo, địa chỉ, đường link
                        của website khác.</p>
                    <p className="text-lg">5.7 Đăng bán lặp đi lặp lại một sản phẩm trên nhiều danh mục (spam).</p>
                    <p className="text-lg">5.8 Thay đổi nội dung tin đăng để gian lận đánh giá hoặc tạo đơn ảo.</p>
                    <p className="text-lg">5.9 Người Bán khi tham gia đấu giá trên trang web cần tuân thủ các quy định
                        trên để đảm bảo môi trường đấu giá minh bạch, công bằng và hợp pháp.</p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">6. Giao dịch ngoài nền tảng</h2>
                <div className="pl-6">
                    <p className="text-lg">6.1 Trách nhiệm của người dùng khi giao dịch ngoài nền tảng: Người dùng có
                        thể tự do thực hiện giao dịch trực tiếp với nhau mà không qua nền tảng của chúng tôi. Tuy nhiên,
                        khi giao dịch ngoài hệ thống của trang web, người dùng hoàn toàn chịu trách nhiệm về các thỏa
                        thuận, thanh toán, giao nhận hàng hóa và việc giải quyết các tranh chấp phát sinh giữa các
                        bên.</p>
                    <p className="text-lg">6.2 Khuyến cáo về giao dịch ngoài nền tảng: Chúng tôi khuyến khích người dùng
                        chỉ thực hiện giao dịch qua nền tảng của chúng tôi để đảm bảo an toàn, bảo mật và tuân thủ các
                        quy định pháp luật. Giao dịch ngoài hệ thống có thể tiềm ẩn rủi ro về bảo mật thông tin, thanh
                        toán không an toàn và không có sự bảo vệ từ các quy trình xử lý tranh chấp của chúng tôi.</p>
                    <p className="text-lg">6.3 Quy trình giải quyết tranh chấp (nếu có): Trong trường hợp phát sinh
                        tranh chấp liên quan đến giao dịch ngoài nền tảng, chúng tôi không can thiệp trực tiếp vào việc
                        giải quyết giữa các bên. Tuy nhiên, chúng tôi sẽ cung cấp thông tin liên quan đến tài khoản của
                        người dùng nếu có yêu cầu hợp pháp từ các cơ quan chức năng.</p>
                    <p className="text-lg">6.4 Cảnh báo về hành vi gian lận và lừa đảo: Chúng tôi nghiêm cấm mọi hành vi
                        gian lận, lừa đảo, hoặc vi phạm pháp luật trong các giao dịch diễn ra ngoài nền tảng của chúng
                        tôi. Nếu phát hiện hành vi gian lận hoặc vi phạm, người dùng có thể thông báo ngay lập tức cho
                        chúng tôi qua email <strong>daugiavn123@gmail.com</strong>.</p>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">7. Xử lý sau khi nhận hàng</h2>
                <div className="pl-6">
                    <p className="text-lg">7.1 Đối với người mua</p>
                    <div className="pl-6">
                        <p className="text-lg">- Người mua có <strong>03 ngày</strong> để kiểm tra sản phẩm và khiếu nại
                            nếu có lỗi hoặc không đúng mô tả.</p>
                        <p className="text-lg">- Nếu có khiếu nại, người mua phải cung cấp bằng chứng (<strong>hình ảnh,
                            video</strong>,...) để được hỗ trợ trả hàng và hoàn tiền.</p>
                        <p className="text-lg">- Nếu sản phẩm bị lỗi do người bán, người bán phải chịu phí vận chuyển
                            hoàn trả.</p>
                        <p className="text-lg">- Nếu lỗi không hợp lệ hoặc người mua thay đổi ý định, yêu cầu trả hàng
                            có thể bị từ chối.</p>
                    </div>

                    <p className="text-lg">7.2 Đối với người bán</p>
                    <div className="pl-6">
                        <p className="text-lg">- Nếu sau <strong>03 ngày</strong> kể từ khi hàng được giao mà không có
                            khiếu nại từ người mua, hệ thống sẽ tự động xác nhận giao dịch thành công. <strong>Số tiền
                                thanh toán sẽ được chuyển vào tài khoản người bán trong vòng 24 giờ</strong> làm việc kể
                            từ thời điểm xác nhận.</p>
                        <p className="text-lg">- Đối với các giao dịch giá trị lớn (trên 50 triệu VND), thời gian chuyển
                            tiền có thể kéo dài thêm <strong>1-2 ngày làm việc</strong> để hoàn tất các thủ tục kiểm tra
                            an toàn.</p>
                        <p className="text-lg">- Trong trường hợp có khiếu nại hợp lệ, người bán có quyền yêu cầu người
                            mua trả hàng trước khi hoàn tiền.</p>
                        <p className="text-lg">- Nếu người bán có thể chứng minh rằng sản phẩm đúng với mô tả, khiếu nại
                            có thể bị từ chối.</p>
                        <p className="text-lg">- Nếu người mua gửi trả hàng, người bán cần kiểm tra sản phẩm trong
                            vòng <strong>03 ngày</strong> kể từ khi nhận lại.</p>
                        <p className="text-lg">- Nếu phát hiện sản phẩm bị hư hại do lỗi của người mua, người bán có
                            quyền từ chối hoàn tiền hoặc chỉ hoàn lại một phần.</p>
                    </div>

                    <p className="text-lg">7.3 Quy trình giải quyết tranh chấp</p>
                    <div className="pl-6">
                        <p className="text-lg">- Nếu người mua và người bán không thể thỏa thuận, nền tảng sẽ đóng vai
                            trò trung gian để giải quyết.</p>
                        <p className="text-lg">- Nền tảng có quyền yêu cầu cung cấp bằng chứng từ cả hai phía trước khi
                            đưa ra quyết định cuối cùng.</p>
                        <p className="text-lg">- Thời gian xử lý khiếu nại có thể kéo dài từ <strong>3 - 7 ngày làm
                            việc</strong>.</p>
                    </div>
                </div>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">8. Phương thức thanh toán</h2>
                <p className="text-lg">Chúng tôi hỗ trợ nhiều phương thức thanh toán như VNPAY, PayPal để tạo sự thuận
                    tiện cho khách hàng.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">9. Xử lý vi phạm</h2>
                <p className="text-lg">Chúng tôi có quyền tạm khóa hoặc xóa tài khoản nếu phát hiện hành vi vi phạm điều
                    khoản sử dụng.</p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold">10. Liên hệ</h2>
                <p className="text-lg">Nếu có bất kỳ thắc mắc nào về điều khoản dịch vụ, vui lòng liên hệ với chúng tôi
                    qua email: <strong>daugiavn123@gmail.com</strong>.</p>
            </section>
        </Container>
    );
};

export default TermsOfService;

import React, {useState, useEffect} from "react";
import axios from "axios";
import apiConfig from "../../config/apiConfig";

const PlaceBid = ({auctionId, startingPrice, currentPrice, bidStep, token: propToken, customerId: propCustomerId}) => {
    const [bidAmount, setBidAmount] = useState("");
    const [depositAmount, setDepositAmount] = useState(0);

    const [error, setError] = useState("");
    const [showPaymentOptions, setShowPaymentOptions] = useState(false); // 🆕 Hiển thị phương thức thanh toán

    const [token, setToken] = useState(propToken || localStorage.getItem("token"));
    const [customerId, setCustomerId] = useState(propCustomerId || localStorage.getItem("customerId"));

    const minBid = currentPrice + bidStep;

    useEffect(() => {
        console.log("[DEBUG] Token từ props:", propToken);
        console.log("[DEBUG] Token từ Local Storage:", localStorage.getItem("token"));
        console.log("[DEBUG] Token state:", token);

        if (!token) {
            const storedToken = localStorage.getItem("token");
            if (storedToken) setToken(storedToken);
        }
    }, [token, propToken]);

    useEffect(() => {
        console.log("[DEBUG] customerId từ props:", propCustomerId);
        console.log("[DEBUG] customerId từ Local Storage:", localStorage.getItem("customerId"));
        console.log("[DEBUG] customerId state trước update:", customerId);

        if (!customerId) {
            const storedCustomerId = localStorage.getItem("customerId");
            if (storedCustomerId) setCustomerId(storedCustomerId);
        }
        console.log("[DEBUG] customerId state sau update:", customerId);
    }, [customerId, propCustomerId]);

    useEffect(() => {
        // 💰 Tính tiền đặt cọc dựa trên giá khởi điểm (VD: 10%)
        setDepositAmount(startingPrice * 0.05);
    }, [startingPrice]);

    const handleBidSubmit = async (e) => {

        e.preventDefault();
        const numericBid = parseFloat(bidAmount);

        console.log("🚀 [DEBUG] Token trước khi gửi bid:", token);
        console.log("🚀 [DEBUG] customerId trước khi gửi bid:", customerId);
        console.log("🚀 [DEBUG] Headers gửi đi:", {Authorization: `Bearer ${token}`});

        if (!token) {
            setError("Bạn cần đăng nhập để đấu giá.");
            return;
        }

        if (!customerId) {
            console.error("⚠️ [ERROR] customerId bị undefined!");
            setError("Lỗi hệ thống: Không tìm thấy thông tin người dùng.");
            return;
        }

        if (isNaN(numericBid) || numericBid < minBid) {
            setError(`Giá phải lớn hơn hoặc bằng ${minBid.toLocaleString()} VNĐ.`);
            return;
        }

        console.log("🔄 [DEBUG] Gửi bid:", {auctionId, bidAmount: numericBid, customerId, token});

        try {
            await axios.post(
                `${apiConfig.bids}`,
                {auctionId, bidAmount: numericBid, customerId}, // Sửa key từ currentPrice -> bidAmount
                {headers: {Authorization: `Bearer ${token}`}}
            );
            // Lưu số tiền để thanh toán
            // setBidAmountForPayment(numericBid);

            setBidAmount("");
            setError("");
            // alert("🎉 Đặt giá thành công!");
            // 🆕 Hiển thị lựa chọn thanh toán sau khi đặt giá thành công
            setShowPaymentOptions(true);
        } catch (err) {
            console.error("❌ [ERROR] Bid thất bại:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Gửi giá đấu thất bại. Vui lòng thử lại.");
        }
    };

    const handlePayment = async (method) => {

        if (!auctionId) {
            console.error("❌ [ERROR] auctionId bị undefined!");
            setError("Lỗi: Không tìm thấy auctionId.");
            return;
        }

        try {
            const response = await axios.post(
                `${apiConfig.transactions}/create`,
                {
                    customerId,
                    auctionId,
                    amount: parseFloat(depositAmount),
                    paymentMethod: method,
                    returnUrl: window.location.href  // Gửi returnUrl từ frontend
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );

            const {redirectUrl} = response.data;
            if (redirectUrl) {
                window.location.href = redirectUrl; // Chuyển hướng đến trang thanh toán
            } else {
                alert("Không thể tạo giao dịch. Vui lòng thử lại!");
            }
        } catch (err) {
            console.error("❌ [ERROR] Thanh toán thất bại:", err.response?.data || err.message);
            setError("Thanh toán thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <form onSubmit={handleBidSubmit} style={{marginTop: "1rem"}}>
                <input
                    type="number"
                    placeholder={`Nhập từ ${minBid.toLocaleString()} VNĐ`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={minBid}
                    style={{padding: "0.5rem", marginRight: "0.5rem"}}
                />
                <button type="submit" style={{padding: "0.5rem 1rem"}}>
                    Đặt giá
                </button>
                {error && <p style={{color: "red", marginTop: "0.5rem"}}>{error}</p>}
            </form>

            {showPaymentOptions && (
                <div style={{marginTop: "1rem"}}>
                    <h3>Chọn phương thức thanh toán:</h3>
                    <p><strong>Số tiền đặt cọc:</strong> {depositAmount.toLocaleString('vi-VN')} VNĐ</p>
                    <button
                        onClick={() => handlePayment("PAYPAL")}
                        style={{
                            padding: "0.5rem 1rem",
                            marginRight: "0.5rem",
                            backgroundColor: "#0070ba",
                            color: "#fff"
                        }}
                    >
                        Thanh toán bằng PayPal
                    </button>
                    <button
                        onClick={() => handlePayment("VNPAY")}
                        style={{padding: "0.5rem 1rem", backgroundColor: "#e41e25", color: "#fff"}}
                    >
                        Thanh toán bằng VNPAY
                    </button>
                </div>
            )}
        </>


    );
};

export default PlaceBid;
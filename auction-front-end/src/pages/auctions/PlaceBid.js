import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import apiConfig from "../../config/apiConfig";
import {FaPaypal} from "react-icons/fa";
import {AiOutlineCreditCard} from "react-icons/ai";

const PlaceBid = ({
                      auctionId,
                      currentPrice,
                      bidStep,
                      depositAmount, // ✅ Nhận từ props
                      token: propToken,
                      customerId: propCustomerId,
                      ownerId // 👈 Thêm ownerId để kiểm tra người đăng bài
                  }) => {
    const navigate = useNavigate();
    const [bidAmount, setBidAmount] = useState("");
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState(propToken || localStorage.getItem("token"));
    const [customerId, setCustomerId] = useState(propCustomerId || localStorage.getItem("customerId"));

    const minBid = currentPrice + bidStep;
    const isOwner = customerId === ownerId; // ✅ Kiểm tra chủ sản phẩm

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

    // Hàm kiểm tra đặt cọc
    const checkDeposit = async () => {
        try {
            const response = await axios.get(`${apiConfig.bids}/deposit/check/${auctionId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            return response.data; // true hoặc false
        } catch (err) {
            console.error("❌ [ERROR] Kiểm tra đặt cọc:", err);
            return false;
        }
    };


    const handleBidSubmit = async (e) => {
        e.preventDefault();

        // ✅ Kiểm tra trước: Nếu là chủ sản phẩm, không cho đấu giá
        if (isOwner) {
            setError("Bạn không thể tham gia đấu giá sản phẩm của chính mình.");
            return;
        }

        const numericBid = parseFloat(bidAmount);

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

        // ✅ Kiểm tra đặt cọc *sau* khi đã xác nhận không phải chủ sản phẩm
        const hasDeposit = await checkDeposit();
        if (!hasDeposit) {
            setError("Bạn cần thanh toán đặt cọc để đấu giá!");
            setShowPaymentOptions(true);
            return;
        }

        try {
            await axios.post(
                `${apiConfig.bids}/auction/${auctionId}`,
                {bidAmount: numericBid},
                {headers: {Authorization: `Bearer ${token}`}}
            );

            setBidAmount("");
            setError("");
            toast.success("🎉 Đặt giá thành công!");

            setTimeout(() => {
                navigate('/auctions');
            }, 2000);
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
        const finalDepositAmount = Math.max(depositAmount, 10000);

        try {
            console.log("🔄 [DEBUG] Gửi thanh toán:", {customerId, auctionId, depositAmount, method});

            const response = await axios.post(
                `${apiConfig.transactions}/create`,
                {
                    customerId,
                    auctionId,
                    amount: finalDepositAmount, // ✅ Dùng từ props
                    paymentMethod: method,
                    returnUrl: window.location.href
                },
                {headers: {Authorization: `Bearer ${token}`}}
            );

            const {redirectUrl} = response.data;
            if (redirectUrl) {
                window.location.href = redirectUrl;
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
                <div style={{display: "flex", alignItems: "center"}}>
                    <input
                        type="number"
                        placeholder={`Nhập từ ${minBid.toLocaleString()} VNĐ`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={minBid}
                        style={{
                            padding: "0.5rem",
                            marginRight: "0.5rem",
                            width: "200px",
                        }}
                        disabled={isOwner} // ❌ Không cho nhập nếu là chủ bài
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "0.5rem 1rem",
                            backgroundColor: "#f0c674",
                            color: "black",
                            border: "none",
                            borderRadius: "5px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: isOwner ? "not-allowed" : "pointer",
                            opacity: isOwner ? 0.6 : 1,
                            whiteSpace: "nowrap" // Đảm bảo chữ không bị xuống dòng
                        }}
                        disabled={isOwner}
                    > Đặt giá
                    </button>
                </div>


                {error && <p style={{color: "red", marginTop: "0.5rem"}}>{error}</p>}
                {isOwner && (
                    <p style={{color: "orange", marginTop: "0.5rem"}}>
                        Bạn không thể đấu giá sản phẩm do chính mình đăng.
                    </p>
                )}
            </form>

            {showPaymentOptions && (
                <div style={{marginTop: "1rem"}}>
                    <h3>Chọn phương thức thanh toán:</h3>
                    <p>
                        <strong>Số tiền đặt
                            cọc:</strong> {Math.max(depositAmount, 10000).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p style={{fontSize: "0.9rem", color: "gray", marginTop: "-0.5rem"}}>
                        (Lưu ý: Số tiền đặt cọc tối thiểu là 10,000 VNĐ)
                    </p>
                    <div className="payment-buttons">
                        <button
                            className="btn-paypal"
                            onClick={() => handlePayment("PAYPAL")}
                        ><FaPaypal size={24} style={{marginRight: 8}}/>
                            PayPal
                        </button>
                        <button
                            className="btn-vnpay"
                            onClick={() => handlePayment("VNPAY")}
                        >
                            <AiOutlineCreditCard size={24}
                                                 style={{marginRight: 8}}/>
                            VNPAY
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={2000}/>
        </>
    );
};

export default PlaceBid;

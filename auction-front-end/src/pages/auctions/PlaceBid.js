import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../config/apiConfig";

const PlaceBid = ({ auctionId, currentPrice, bidStep, token: propToken, customerId: propCustomerId }) => {
    const [bidAmount, setBidAmount] = useState("");
    const [error, setError] = useState("");
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

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        const numericBid = parseFloat(bidAmount);

        console.log("🚀 [DEBUG] Token trước khi gửi bid:", token);
        console.log("🚀 [DEBUG] customerId trước khi gửi bid:", customerId);
        console.log("🚀 [DEBUG] Headers gửi đi:", { Authorization: `Bearer ${token}` });

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

        console.log("🔄 [DEBUG] Gửi bid:", { auctionId, bidAmount: numericBid, customerId, token });

        try {
            await axios.post(
                `${apiConfig.bids}`,
                { auctionId, bidAmount: numericBid, customerId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBidAmount("");
            setError("");
            alert("🎉 Đặt giá thành công!");
        } catch (err) {
            console.error("❌ [ERROR] Bid thất bại:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Gửi giá đấu thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <form onSubmit={handleBidSubmit} style={{ marginTop: "1rem" }}>
            <input
                type="number"
                placeholder={`Nhập từ ${minBid.toLocaleString()} VNĐ`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minBid}
                style={{ padding: "0.5rem", marginRight: "0.5rem" }}
            />
            <button type="submit" style={{ padding: "0.5rem 1rem" }}>
                Đặt giá
            </button>
            {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
        </form>
    );
};

export default PlaceBid;

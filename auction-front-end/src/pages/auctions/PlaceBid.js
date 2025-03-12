import React, { useState, useEffect } from "react";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import { useAuth } from "../../context/AuthContext";

const PlaceBid = ({ auctionId }) => {
    const [bidAmount, setBidAmount] = useState("");
    const [error, setError] = useState("");
    const [minBid, setMinBid] = useState(0);
    const { token } = useAuth();

    useEffect(() => {
        axios.get(`${apiConfig.auctions}/${auctionId}`)
            .then(({ data }) => {
                setMinBid(data.currentPrice + data.bidStep);
            })
            .catch(() => setError("Không thể tải thông tin đấu giá."));
    }, [auctionId]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        const numericBid = parseFloat(bidAmount);

        if (!token) {
            setError("Bạn cần đăng nhập để đấu giá.");
            return;
        }

        if (isNaN(numericBid) || numericBid < minBid) {
            setError(`Giá phải lớn hơn hoặc bằng ${minBid.toLocaleString()} VNĐ.`);
            return;
        }

        try {
            await axios.post(`${apiConfig.bids}`, { auctionId, bidAmount: numericBid }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBidAmount("");
            setError("");
            alert("Đặt giá thành công!");
        } catch {
            setError("Gửi giá đấu thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <form onSubmit={handleBidSubmit}>
            <input
                type="number"
                placeholder={`Nhập từ ${minBid.toLocaleString()} VNĐ`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={minBid}
            />
            <button type="submit">Đặt giá</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default PlaceBid;

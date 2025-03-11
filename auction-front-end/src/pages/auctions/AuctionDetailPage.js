// src/components/auctions/AuctionDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import PlaceBid from "./PlaceBid";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const customerId = 1; // giả sử lấy từ user đăng nhập

    useEffect(() => {
        axios.get(`${apiConfig.auctions}/${id}`)
            .then(response => setAuction(response.data))
            .catch(error => console.error('Lỗi khi lấy chi tiết phiên đấu giá:', error));
    }, [id]);

    if (!auction) return <p>Đang tải dữ liệu...</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold">{auction.product.productName}</h1>
            <p>Mô tả: {auction.product.description}</p>
            <p>Giá hiện tại: {auction.currentPrice} VND</p>
            <p>Thời gian kết thúc: {new Date(auction.auctionEndTime).toLocaleString()}</p>

            {/* Form đấu giá */}
            <PlaceBid auctionId={auction.auctionId} customerId={customerId} />
        </div>
    );
};

export default AuctionDetailPage;

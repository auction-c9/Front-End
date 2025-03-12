// src/components/auctions/AuctionDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import PlaceBid from "./PlaceBid";
import Header from "../../pages/Header"; // Import Header

const AuctionDetailPage = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const customerId = 1; // Ví dụ: lấy từ user đã đăng nhập

    useEffect(() => {
        axios
            .get(`${apiConfig.auctions}/${id}`)
            .then((response) => setAuction(response.data))
            .catch((error) =>
                console.error("Lỗi khi lấy chi tiết phiên đấu giá:", error)
            );
    }, [id]);

    if (!auction) return <p>Đang tải dữ liệu...</p>;

    // Giả sử một số trường dữ liệu của bạn như sau:
    const productName = auction.product?.name || "Chưa có tên sản phẩm";
    const location = auction.product?.location || "Chưa rõ địa điểm";
    const condition = auction.product?.condition || "Mới";
    const originalRetail = auction.product?.originalRetail || 0;
    const currentPrice = auction.currentPrice || 0;
    const closeDate = new Date(auction.auctionEndTime).toLocaleString();
    const timeLeft = getTimeLeft(auction.auctionEndTime);

    // Hàm tính thời gian còn lại (phút/giây) ví dụ đơn giản
    function getTimeLeft(endTime) {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now; // milliseconds
        if (diff <= 0) return "0s còn lại";

        const totalSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}p ${seconds}s còn lại`;
    }

    return (
        <>
            <Header />
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
            {/* Header */}


            {/* Tên sản phẩm + số lượng, tình trạng, giá gốc... */}
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {productName}, 70 sản phẩm, Tình trạng {condition}, Ước tính giá gốc €{originalRetail}, {location}
            </h2>

            {/* Khối 2 cột: Thông tin chính bên trái, hình ảnh bên phải */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {/* Cột trái */}
                <div style={{ flex: "1 1 300px" }}>
                    {/* Giá khởi điểm */}
                    <div style={{ marginBottom: "1rem" }}>
                        <span style={{ fontWeight: "bold" }}>Giá khởi điểm: </span>
                        <span style={{ fontSize: "1.1rem", color: "#333" }}>{currentPrice}</span>{" "}
                        <small style={{ color: "blue", cursor: "pointer" }}>(Làm mới)</small>{" "}
                        <span style={{ color: "#999" }}>0 lượt đấu giá</span>
                    </div>

                    {/* Giá đấu tối đa của bạn */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="maxBid" style={{ display: "block", marginBottom: "0.25rem" }}>
                            Giá đấu tối đa của bạn
                        </label>
                        <input
                            type="number"
                            id="maxBid"
                            placeholder={`Nhập từ ${currentPrice}VND trở lên`}
                            style={{ padding: "0.5rem", width: "100%", maxWidth: "200px" }}
                        />
                        <div style={{ marginTop: "0.5rem" }}>
                            <button
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    padding: "0.5rem 1rem",
                                    border: "none",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                }}
                            >
                                Đấu giá ngay
                            </button>
                        </div>
                    </div>

                    {/* Phí bổ sung */}
                    <div style={{ marginBottom: "0.5rem" }}>
                        <span>Phí bổ sung: </span>
                        <strong>+ 10.00 B-Stock Fee</strong>
                    </div>

                    {/* Giá trung bình mỗi sản phẩm */}
                    <div style={{ marginBottom: "0.5rem" }}>
                        <span>Giá trung bình mỗi sản phẩm: </span>
                        <strong>€1.43</strong>
                    </div>

                    {/* Thời gian còn lại */}
                    <div style={{ marginBottom: "0.5rem" }}>
                        <span>Thời gian còn lại: </span>
                        <strong style={{ color: "red" }}>{timeLeft}</strong>
                    </div>

                    {/* Ngày kết thúc */}
                    <div style={{ marginBottom: "1rem" }}>
                        <span>Ngày kết thúc: </span>
                        <strong>{closeDate} GMT</strong>
                    </div>

                    {/* Form Đấu giá (PlaceBid) */}
                    <div style={{ marginTop: "1rem" }}>
                        <PlaceBid auctionId={auction.auctionId} customerId={customerId} />
                    </div>
                </div>

                {/* Cột phải - Hình ảnh sản phẩm */}
                <div style={{ flex: "0 0 300px" }}>
                    <img
                        src={
                            auction.product?.image ||
                            "https://via.placeholder.com/300x300?text=No+Image"
                        }
                        alt={auction.product?.name}
                        style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "auto",
                            display: "block",
                            marginBottom: "0.5rem",
                        }}
                    />
                    <div style={{ fontSize: "0.9rem", color: "#555" }}>
                        9 ảnh.{" "}
                        <strong style={{ color: "blue", cursor: "pointer" }}>
                            Đăng nhập hoặc đăng ký
                        </strong>{" "}
                        để xem
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default AuctionDetailPage;

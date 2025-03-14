import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import PlaceBid from "./PlaceBid";
import Header from "../../pages/Header";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const { token, user } = useAuth();
    const customerId = user?.id;

    const [auction, setAuction] = useState(null);
    // startingPrice: giá khởi điểm lấy từ Auction.currentPrice
    const [startingPrice, setStartingPrice] = useState(null);
    // currentBidPrice: giá hiện tại lấy từ Bid.bidAmount của bid cuối cùng
    const [currentBidPrice, setCurrentBidPrice] = useState(null);
    const [priceUpdated, setPriceUpdated] = useState(false);
    const [highestBidder, setHighestBidder] = useState("");
    const [bidHistory, setBidHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");

    // Hàm định dạng tiền tệ
    const formatCurrency = (value) =>
        value !== null ? value.toLocaleString("vi-VN") + " VNĐ" : "Chưa có giá";

    // Lấy dữ liệu phiên đấu giá từ backend
    useEffect(() => {
        axios
            .get(`${apiConfig.auctions}/${id}`)
            .then((response) => {
                const data = response.data;
                setAuction(data);

                // Giá khởi điểm từ Auction.currentPrice
                setStartingPrice(data.currentPrice);

                // Nếu có lịch sử đấu giá, lấy bidAmount của bid cuối cùng làm "Giá hiện tại"
                if (data.bidHistory && data.bidHistory.length > 0) {
                    const latestBid = data.bidHistory[data.bidHistory.length - 1];
                    setCurrentBidPrice(latestBid.bidAmount);
                    setHighestBidder(latestBid.customerName || "Chưa có");
                } else {
                    // Nếu chưa có lượt đấu giá, currentBidPrice là null
                    setCurrentBidPrice(null);
                    setHighestBidder("Chưa có");
                }
                setBidHistory(data.bidHistory || []);
                updateTimeLeft(data.auctionEndTime);
            })
            .catch((error) =>
                console.error("Lỗi khi lấy chi tiết phiên đấu giá:", error)
            );
    }, [id]);

    // Cập nhật thời gian còn lại cho phiên đấu giá
    useEffect(() => {
        let interval;
        if (auction?.auctionEndTime) {
            interval = setInterval(() => updateTimeLeft(auction.auctionEndTime), 1000);
        }
        return () => clearInterval(interval);
    }, [auction]);

    // Hàm cập nhật thời gian còn lại
    function updateTimeLeft(endTime) {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        if (diff <= 0) {
            setTimeLeft("Đã kết thúc");
            return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours > 0 ? `${hours}g ` : ""}${minutes}p ${seconds}s còn lại`);
    }

    // Kết nối WebSocket để nhận cập nhật bid mới từ backend
    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws-auction");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(`/topic/auction/${id}`, (message) => {
                    const bidUpdate = JSON.parse(message.body);
                    // Nếu thông điệp chứa bidAmount, cập nhật giá hiện tại từ Bid.bidAmount
                    if (bidUpdate.bidAmount) {
                        setCurrentBidPrice(bidUpdate.bidAmount);
                        setHighestBidder(bidUpdate.customerName || bidUpdate.highestBidder || "Chưa có");
                        setBidHistory(bidUpdate.bidHistory);
                        setPriceUpdated(true);
                        setTimeout(() => setPriceUpdated(false), 1000);
                    }
                });
            },
            onStompError: (error) => console.error("WebSocket error:", error),
        });
        client.activate();
        return () => client.deactivate();
    }, [id]);

    if (!auction) return <p>Đang tải dữ liệu...</p>;

    return (
        <>
            <Header />
            <div className="container">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {auction.product?.name || "Chưa có tên sản phẩm"}
                </motion.h2>
                <p>{auction.product?.description || "Chưa có mô tả"}</p>

                <div className="info-section">
                    <div className="info-left">
                        <div>
                            <strong>Giá khởi điểm:</strong>{" "}
                            {startingPrice !== null ? formatCurrency(startingPrice) : "Đang tải..."}
                        </div>
                        <div>
                            <strong>Giá đặt cọc:</strong>{" "}
                            {startingPrice !== null ? formatCurrency(startingPrice * 0.1) : "Đang tải..."}
                        </div>

                        <motion.div
                            className={`current-price ${priceUpdated ? "highlight" : ""}`}
                            animate={{ scale: priceUpdated ? 1.1 : 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <strong>Giá hiện tại:</strong>{" "}
                            {currentBidPrice !== null
                                ? formatCurrency(currentBidPrice)
                                : "Chưa có lượt đấu giá"}
                        </motion.div>
                        <div>
                            <strong>Người đấu giá cao nhất:</strong>{" "}
                            <span style={{ color: "blue" }}>{highestBidder}</span>
                        </div>
                        <div>
                            <strong>Bước giá:</strong> {formatCurrency(auction.bidStep)}
                        </div>
                        <div>
                            <strong>Thời gian còn lại:</strong>{" "}
                            <span style={{ color: "red" }}>{timeLeft}</span>
                        </div>

                        <PlaceBid
                            auctionId={auction.auctionId}
                            // Truyền currentPrice dưới dạng currentBidPrice để PlaceBid tính minBid dựa trên bidAmount
                            currentPrice={currentBidPrice}
                            bidStep={auction.bidStep}
                            token={token}
                            customerId={customerId}
                        />
                    </div>
                    <div className="info-right">
                        <AnimatePresence>
                            {auction.product?.image ? (
                                <motion.img
                                    src={auction.product.image}
                                    alt={auction.product.name || "Sản phẩm"}
                                    onError={(e) => {
                                        e.target.src = "/default-image.jpg";
                                    }}
                                    className="product-image"
                                />
                            ) : (
                                <img
                                    src="/default-image.jpg"
                                    alt="Sản phẩm"
                                    className="product-image"
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <h3>Lịch sử đấu giá</h3>
                <ul className="bid-history">
                    {bidHistory.length > 0 ? (
                        bidHistory.map((bid, index) => (
                            <li key={index}>
                                <strong>{bid.customerName}</strong> đã đặt{" "}
                                <span>{formatCurrency(bid.bidAmount)}</span> lúc{" "}
                                <em>{new Date(bid.bidTime).toLocaleTimeString("vi-VN")}</em>
                            </li>
                        ))
                    ) : (
                        <p>Chưa có lượt đấu giá nào.</p>
                    )}
                </ul>
            </div>

            <style jsx>{`
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 1rem;
                }
                .info-section {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                }
                .info-left {
                    flex: 1 1 50%;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .info-right {
                    flex: 1 1 40%;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                .product-image {
                    width: 100%;
                    max-width: 350px;
                    height: auto;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                .highlight {
                    background: #fffae6;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: background 0.5s ease;
                }
                .bid-history li {
                    padding: 0.25rem 0;
                    border-bottom: 1px solid #eee;
                }
            `}</style>
        </>
    );
};

export default AuctionDetailPage;

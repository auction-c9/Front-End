import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import PlaceBid from "./PlaceBid";
import Header from "../../pages/Header";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [highestBidder, setHighestBidder] = useState(""); // Người đấu giá cao nhất
    const [bidHistory, setBidHistory] = useState([]); // Lịch sử đấu giá
    const [timeLeft, setTimeLeft] = useState(""); // Đồng hồ đếm ngược
    const customerId = 1; // Giả định người dùng hiện tại
    const [stompClient, setStompClient] = useState(null);

    // Kết nối WebSocket
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-auction');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");

                // Đăng ký lắng nghe kênh đấu giá
                client.subscribe(`/topic/auction/${id}`, (message) => {
                    const bidUpdate = JSON.parse(message.body);
                    console.log("Received bid update: ", bidUpdate);
                    setCurrentPrice(bidUpdate.currentPrice); // Cập nhật giá hiện tại
                    setHighestBidder(bidUpdate.highestBidder); // Cập nhật người đấu giá cao nhất
                    setBidHistory(bidUpdate.bidHistory); // Cập nhật lịch sử đấu giá
                });
            },
            onStompError: (error) => {
                console.error("WebSocket error: ", error);
            },
        });

        client.activate();
        setStompClient(client);

        return () => {
            if (client) client.deactivate(); // Ngắt kết nối khi rời trang
        };
    }, [id]);

    // Fetch dữ liệu ban đầu
    useEffect(() => {
        axios
            .get(`${apiConfig.auctions}/${id}`)
            .then((response) => {
                setAuction(response.data);
                setCurrentPrice(response.data.currentPrice); // Set giá khởi đầu
                setHighestBidder(response.data.highestBidder || "Chưa có");
                setBidHistory(response.data.bidHistory || []);
                updateTimeLeft(response.data.auctionEndTime);
            })
            .catch((error) => console.error("Lỗi khi lấy chi tiết phiên đấu giá:", error));
    }, [id]);

    // Đồng hồ đếm ngược
    useEffect(() => {
        let interval;
        if (auction?.auctionEndTime) {
            interval = setInterval(() => {
                updateTimeLeft(auction.auctionEndTime);
            }, 1000);
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

    if (!auction) return <p>Đang tải dữ liệu...</p>;

    return (
        <>
            <Header />
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
                <h2>{auction.product?.name || "Chưa có tên sản phẩm"}</h2>
                <div>
                    <div>
                        <span>Giá hiện tại: </span>
                        <strong>{currentPrice} VNĐ</strong>
                    </div>
                    <div>
                        <span>Người đấu giá cao nhất: </span>
                        <strong style={{ color: "blue" }}>{highestBidder}</strong>
                    </div>
                    <div>
                        <span>Bước giá: </span>
                        <strong>{auction.bidStep} VNĐ</strong>
                    </div>
                    <div>
                        <span>Thời gian còn lại: </span>
                        <strong style={{ color: "red" }}>{timeLeft}</strong>
                    </div>
                    <PlaceBid auctionId={auction.auctionId} customerId={customerId} />
                </div>

                {/* Lịch sử đấu giá */}
                <h3>Lịch sử đấu giá</h3>
                <ul>
                    {bidHistory.length > 0 ? (
                        bidHistory.map((bid, index) => (
                            <li key={index}>
                                {bid.customerName} đã đặt giá {bid.bidAmount} VNĐ lúc {new Date(bid.timestamp).toLocaleTimeString()}
                            </li>
                        ))
                    ) : (
                        <p>Chưa có lượt đấu giá nào.</p>
                    )}
                </ul>
            </div>
        </>
    );
};

export default AuctionDetailPage;

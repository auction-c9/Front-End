// AuctionDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import PlaceBid from "./PlaceBid";
import Header from "../../pages/Header";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../../context/AuthContext";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const { token, user } = useAuth(); // Lấy thông tin token và user từ AuthContext
    const customerId = user?.id; // Hoặc tạm thời mock const customerId = 1;

    const [auction, setAuction] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [highestBidder, setHighestBidder] = useState("");
    const [bidHistory, setBidHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");
    const [stompClient, setStompClient] = useState(null);

    // Kết nối WebSocket
    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-auction');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");

                // Subscribe vào topic auction
                client.subscribe(`/topic/auction/${id}`, (message) => {
                    const bidUpdate = JSON.parse(message.body);
                    console.log("Received bid update: ", bidUpdate);
                    setCurrentPrice(bidUpdate.currentPrice);
                    setHighestBidder(bidUpdate.highestBidder);
                    setBidHistory(bidUpdate.bidHistory);
                });
            },
            onStompError: (error) => console.error("WebSocket error: ", error),
        });

        client.activate();
        setStompClient(client);

        return () => client.deactivate();
    }, [id]);

    // Fetch thông tin đấu giá ban đầu
    useEffect(() => {
        axios
            .get(`${apiConfig.auctions}/${id}`)
            .then((response) => {
                const data = response.data;
                setAuction(data);
                setCurrentPrice(data.currentPrice);
                setHighestBidder(data.highestBidder || "Chưa có");
                setBidHistory(data.bidHistory || []);
                updateTimeLeft(data.auctionEndTime);
            })
            .catch((error) => console.error("Lỗi khi lấy chi tiết phiên đấu giá:", error));
    }, [id]);

    // Đồng hồ đếm ngược
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

    if (!auction) return <p>Đang tải dữ liệu...</p>;

    return (
        <>
            <Header />
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
                <h2>{auction.product?.name || "Chưa có tên sản phẩm"}</h2>
                <div>
                    <div><span>Giá hiện tại: </span><strong>{currentPrice} VNĐ</strong></div>
                    <div><span>Người đấu giá cao nhất: </span><strong style={{ color: "blue" }}>{highestBidder}</strong></div>
                    <div><span>Bước giá: </span><strong>{auction.bidStep} VNĐ</strong></div>
                    <div><span>Thời gian còn lại: </span><strong style={{ color: "red" }}>{timeLeft}</strong></div>

                    {/* Truyền dữ liệu sang PlaceBid */}
                    <PlaceBid
                        auctionId={auction.auctionId}
                        currentPrice={currentPrice}
                        bidStep={auction.bidStep}
                        token={token}
                        customerId={customerId}
                    />
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

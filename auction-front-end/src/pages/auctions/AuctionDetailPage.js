import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const customerId = user?.id;

    const [auction, setAuction] = useState(null);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [priceUpdated, setPriceUpdated] = useState(false);
    const startingPriceRef = useRef(null);
    const [depositAmount, setDepositAmount] = useState(0);
    const [highestBidder, setHighestBidder] = useState("");
    const [bidHistory, setBidHistory] = useState([]);
    const [timeLeft, setTimeLeft] = useState("");

    console.log("useParams():", useParams()); // Debugging

    useEffect(() => {
        if (!id) {
            console.error("ID không hợp lệ:", id);
            navigate("/not-found");
        }
    }, [id, navigate]);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-auction');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Connected to WebSocket");
                client.subscribe(`/topic/auction/${id}`, (message) => {
                    const bidUpdate = JSON.parse(message.body);
                    setCurrentPrice(bidUpdate.currentPrice);
                    setHighestBidder(bidUpdate.highestBidder);
                    setBidHistory(bidUpdate.bidHistory);
                    setPriceUpdated(true);
                    setTimeout(() => setPriceUpdated(false), 1000);
                });
            },
            onStompError: (error) => console.error("WebSocket error: ", error),
        });
        client.activate();
        return () => client.deactivate();
    }, [id]);

    useEffect(() => {
        axios
            .get(`${apiConfig.auctions}/${id}`)
            .then((response) => {
                const data = response.data;
                if (!data) {
                    console.error("Dữ liệu phiên đấu giá không hợp lệ");
                    return;
                }
                setAuction(data);
                setCurrentPrice(data.currentPrice);
                setHighestBidder(data.highestBidder || "Chưa có");
                setBidHistory(data.bidHistory || []);
                if (startingPriceRef.current === null) {
                    startingPriceRef.current = data.currentPrice;
                    setDepositAmount(data.currentPrice * 0.05);
                }
                updateTimeLeft(data.auctionEndTime);
            })
            .catch((error) => {
                console.error("Lỗi khi lấy chi tiết phiên đấu giá:", error);
            });
    }, [id]);

    useEffect(() => {
        let interval;
        if (auction?.auctionEndTime) {
            interval = setInterval(() => updateTimeLeft(auction.auctionEndTime), 1000);
        }
        return () => clearInterval(interval);
    }, [auction]);

    function updateTimeLeft(endTime) {
        if (!endTime) return;
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
            <div className="container">
                <motion.h2>{auction.product?.name || "Chưa có tên sản phẩm"}</motion.h2>
                <p>{auction.product?.description || "Chưa có mô tả"}</p>
                <div className="info-section">
                    <div className="info-left">
                        <div><strong>Giá khởi điểm:</strong> {startingPriceRef.current?.toLocaleString('vi-VN')} VNĐ</div>
                        <div><strong>Giá đặt cọc:</strong> {depositAmount.toLocaleString('vi-VN')} VNĐ</div>
                        <motion.div className={`current-price ${priceUpdated ? 'highlight' : ''}`}>
                            <strong>Giá hiện tại:</strong> {currentPrice.toLocaleString('vi-VN')} VNĐ
                        </motion.div>
                        <div><strong>Người đấu giá cao nhất:</strong> <span style={{ color: 'blue' }}>{highestBidder}</span></div>
                        <div><strong>Bước giá:</strong> {auction.bidStep.toLocaleString('vi-VN')} VNĐ</div>
                        <div><strong>Thời gian còn lại:</strong> <span style={{ color: 'red' }}>{timeLeft}</span></div>
                        <PlaceBid auctionId={auction.auctionId} currentPrice={currentPrice} bidStep={auction.bidStep} token={token} customerId={customerId} />
                    </div>
                    <div className="info-right">
                        <AnimatePresence>
                            {auction.product?.image ? (
                                <motion.img src={auction.product.image} alt={auction.product.name || 'Sản phẩm'} className="product-image" />
                            ) : (
                                <img src="/default-image.jpg" alt="Sản phẩm" className="product-image" />
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuctionDetailPage;

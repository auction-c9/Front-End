import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import PlaceBid from "./PlaceBid";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import "../../styles/AuctionDetailPage.css";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const customerId = user?.id;

    // Khai báo state
    const [auction, setAuction] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [highestBidder, setHighestBidder] = useState("Chưa có");
    const [timeLeft, setTimeLeft] = useState("");
    const [priceUpdated, setPriceUpdated] = useState(false);
    const winnerBid = bidHistory.reduce((max, bid) => bid.isWinner ? bid : max, null);

    // Sử dụng useEffect để log dữ liệu sau khi state được khởi tạo
    useEffect(() => {
        console.log("customerId:", customerId);
        console.log("user:", user);
        if (auction) {
            console.log("auction.product?.account?.id:", auction.product?.account?.accountId);
        } else {
            console.log("Auction data is not yet loaded");
        }
    }, [auction, customerId, user]);



    useEffect(() => {
        console.log("Auction Object:", auction);
        console.log("Product:", auction?.product);
        console.log("Account:", auction?.product?.account);
        console.log("Account ID:", auction?.product?.account?.accountId);
    }, [auction]);

    useEffect(() => {
        console.log("Bid History:", bidHistory);
        console.log("Winner Bid:", winnerBid);
    }, [bidHistory, winnerBid]);
    useEffect(() => {
        console.log("Bid History:", bidHistory);
        bidHistory.forEach(bid => console.log(`Bid ID: ${bid.bidId}, isWinner: ${bid.isWinner}`));
    }, [bidHistory]);


    // ===== LẤY DỮ LIỆU ĐẤU GIÁ =====
    useEffect(() => {
        if (!id) {
            navigate("/not-found");
            return;
        }

        const fetchAuctionData = async () => {
            try {
                const res = await axios.get(`${apiConfig.auctions}/${id}`);
                console.log("Auction Data:", res.data);
                setAuction(res.data);
                updateTimeLeft(res.data.auctionEndTime);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đấu giá:", error);
                navigate("/not-found");
            }
        };

        fetchAuctionData();
    }, [id, navigate]);
    useEffect(() => {
        if (auction?.status === "ended") {
            const fetchUpdatedBids = async () => {
                try {
                    const res = await axios.get(`${apiConfig.bids}/auction/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    console.log("Updated Bid History:", res.data);
                    setBidHistory(res.data);
                } catch (error) {
                    console.error("Lỗi khi cập nhật lịch sử đấu giá:", error);
                }
            };
            fetchUpdatedBids();
        }
    }, [auction?.status, id, token]);


    // ===== LỊCH SỬ ĐẤU GIÁ VÀ KẾT NỐI WEBSOCKET =====
    useEffect(() => {
        if (!token || !id) return;

        const fetchBidHistory = async () => {
            try {
                const res = await axios.get(`${apiConfig.bids}/auction/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBidHistory(res.data);
                updateHighestBidder(res.data);
            } catch (error) {
                console.error("Lỗi lấy lịch sử đấu giá:", error);
            }
        };

        fetchBidHistory();

        const socket = new SockJS("http://localhost:8080/ws-auction");
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log("Đã kết nối WebSocket");
                client.subscribe(`/topic/auctions/${id}`, (message) => {
                    const newBid = JSON.parse(message.body);
                    setBidHistory((prev) => [newBid, ...prev]);
                    setHighestBidder(newBid.user?.username || "Ẩn danh");
                    setPriceUpdated(true);
                    setTimeout(() => setPriceUpdated(false), 1000);
                });
            },
            onStompError: (err) => console.error("Lỗi WebSocket:", err),
        });
        client.activate();

        return () => client.deactivate();
    }, [id, token]);

    // ===== ĐẾM NGƯỢC THỜI GIAN =====
    useEffect(() => {
        if (!auction) return;

        updateTimeLeft();
        const interval = setInterval(updateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [auction]);


    // ===== CÁC HÀM HỖ TRỢ =====
    const updateTimeLeft = () => {
        if (!auction) return;

        const now = new Date();
        let end;

        if (auction.status === "pending") {
            end = new Date(auction.auctionStartTime);
        } else if (auction.status === "active") {
            end = new Date(auction.auctionEndTime);
        } else {
            setTimeLeft("Đã kết thúc");
            return;
        }

        const diff = end - now;
        if (diff <= 0) {
            setTimeLeft(auction.status === "pending" ? "Đang bắt đầu..." : "Đã kết thúc");
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours > 0 ? `${hours}g ` : ""}${minutes}p ${seconds}s`);
    };


    const updateHighestBidder = (bids) => {
        if (bids.length > 0) {
            const highest = bids.reduce((max, bid) => (bid.bidAmount > max.bidAmount ? bid : max), bids[0]);
            setHighestBidder(highest.user?.username || "Ẩn danh");
        } else {
            setHighestBidder("Chưa có");
        }
    };

    // ===== TÍNH GIÁ TRỊ =====
    const startingPrice = parseFloat(auction?.currentPrice) || 0;
    const depositAmount = startingPrice * 0.1;
    const bidStep = parseFloat(auction?.bidStep) || 0;
    const highestBidAmount = bidHistory[0]?.bidAmount || startingPrice;

    if (!auction) return <p className="loading-text">Đang tải dữ liệu...</p>;

    return (
        <>
            <motion.h2 className="auction-title">{auction?.product?.name || "Sản phẩm chưa xác định"}</motion.h2>
            <div className="auction-detail">
                <div className="auction-content">
                    <div className="auction-image">
                        {auction.product?.image && (
                            <img src={auction.product.image} alt={auction.product.name} className="product-image" />
                        )}
                    </div>

                    <div className="auction-info">
                        <p>{auction.product?.description || "Không có mô tả"}</p>
                        <div className="info-section">
                            <div>
                                <strong>Giá khởi điểm:</strong> {startingPrice.toLocaleString("vi-VN")} VNĐ
                            </div>
                            <div>
                                <strong>Giá đặt cọc:</strong> {depositAmount.toLocaleString("vi-VN")} VNĐ
                            </div>
                            <div>
                                <strong>Bước giá:</strong> {bidStep.toLocaleString("vi-VN")} VNĐ
                            </div>

                            <motion.div
                                className={`current-price ${priceUpdated ? "highlight" : ""}`}
                                animate={{scale: priceUpdated ? 1.1 : 1}}
                                transition={{duration: 0.3}}
                            >
                                Giá hiện tại: {highestBidAmount.toLocaleString("vi-VN")} VNĐ
                            </motion.div>

                            <div>
                                <strong>Người Đấu giá cao nhất:</strong>{" "}
                                {highestBidder !== "Chưa có" && bidHistory[0]?.user ? (
                                    <a href={`/profile/${bidHistory[0].user.accountId}`} className="highest-bidder">
                                        {highestBidder}
                                    </a>
                                ) : (
                                    <span className="highest-bidder">{highestBidder}</span>
                                )}
                            </div>
                            <div>
                                <strong>Thời gian còn lại:</strong> <span className="time-left">{timeLeft}</span>
                            </div>
                            <div>
                                <strong>Người đăng bán:</strong>{" "}
                                {auction.product?.account ? (
                                    <a href={`/profile/${auction.product.account.accountId}`}>
                                        {auction.product.account.username}
                                    </a>
                                ) : (
                                    <span>Chưa có thông tin</span>
                                )}
                            </div>
                        </div>

                        {auction.status === "pending" ? (
                            <p style={{ color: "orange", fontWeight: "bold", marginTop: "1rem" }}>
                                ⚠️ Phiên đấu giá chưa bắt đầu.
                            </p>
                        ) : auction.status === "ended" ? (
                            <p style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}>
                                ⚠️ Phiên đấu giá đã kết thúc.
                                {winnerBid ? (
                                    <>
                                        Người thắng:{" "}
                                        <a href={`/profile/${winnerBid.user?.accountId}`} className="highest-bidder">
                                            {winnerBid.user?.username || "Ẩn danh"}
                                        </a>
                                    </>
                                ) : (
                                    "Không có người thắng."
                                )}
                            </p>
                        ) : customerId !== undefined && customerId !== null ? (
                            customerId === auction.product?.account?.accountId ? (
                                <p style={{ color: "red", fontWeight: "bold", marginTop: "1rem" }}>
                                    ⚠️ Bạn là chủ bài đăng, không thể tham gia đấu giá.
                                </p>
                            ) : (
                                <PlaceBid
                                    auctionId={auction.auctionId}
                                    currentPrice={highestBidAmount}
                                    bidStep={bidStep}
                                    startingPrice={startingPrice}
                                    depositAmount={depositAmount}
                                    token={token}
                                    customerId={customerId}
                                    ownerId={auction.product?.account?.accountId}
                                />
                            )
                        ) : token ? (
                            <p style={{ color: "blue", fontWeight: "bold", marginTop: "1rem" }}>
                                🔹 Đang tải thông tin người dùng...
                            </p>
                        ) : (
                            <p style={{ color: "blue", fontWeight: "bold", marginTop: "1rem" }}>
                                🔹 Vui lòng đăng nhập để tham gia đấu giá.
                            </p>
                        )}

                    </div>
                </div>

                <h3 className="bid-history-title">Lịch sử đấu giá</h3>
                <ul className="bid-history">
                    {bidHistory.map((bid) => (
                        <li key={bid.bidId}>
                            <strong>{bid.user?.username || "Ẩn danh"}</strong> -{" "}
                            <span>{bid.bidAmount.toLocaleString("vi-VN")} VNĐ</span>
                            <em> lúc {new Date(bid.bidTime).toLocaleString("vi-VN")}</em>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default AuctionDetailPage;

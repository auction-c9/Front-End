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
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import AuctionRanking from "./AuctionRanking";

const AuctionDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const customerId = user?.customerId;

    // State
    const [auction, setAuction] = useState(null);
    const [bidHistory, setBidHistory] = useState([]);
    const [highestBidder, setHighestBidder] = useState("Chưa có");
    const [timeLeft, setTimeLeft] = useState("");
    const [priceUpdated, setPriceUpdated] = useState(false);
    const [showFinalPaymentOptions, setShowFinalPaymentOptions] = useState(false);
    const [error, setError] = useState("");

    // Tìm winner (nếu có)
    const winnerBid = bidHistory.reduce(
        (max, bid) => (bid.isWinner ? bid : max),
        null
    );

    // ===== LẤY DỮ LIỆU ĐẤU GIÁ =====
    useEffect(() => {
        if (!id) {
            navigate("/not-found");
            return;
        }

        const fetchAuctionData = async () => {
            try {
                const res = await axios.get(`${apiConfig.auctions}/${id}`);
                setAuction(res.data);
                updateTimeLeft(res.data.auctionEndTime);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đấu giá:", error);
                navigate("/not-found");
            }
        };

        fetchAuctionData();
    }, [id, navigate]);

    // Nếu đấu giá đã kết thúc, tải lại bidHistory để có trạng thái mới nhất (winner)
    useEffect(() => {
        if (auction?.status === "ended") {
            const fetchUpdatedBids = async () => {
                try {
                    const res = await axios.get(`${apiConfig.bids}/auction/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
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
        if (!id) return;

        const fetchBidHistory = async () => {
            try {
                const config = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};
                const res = await axios.get(`${apiConfig.bids}/auction/${id}`, config);
                setBidHistory(res.data);
                updateHighestBidder(res.data);
            } catch (error) {
                console.error("Lỗi lấy lịch sử đấu giá:", error);
            }
        };

        fetchBidHistory();

        // Thiết lập WebSocket
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
            setTimeLeft(
                auction.status === "pending" ? "Đang bắt đầu..." : "Đã kết thúc"
            );
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours > 0 ? `${hours}g ` : ""}${minutes}p ${seconds}s`);
    };

    const updateHighestBidder = (bids) => {
        if (bids.length > 0) {
            const highest = bids.reduce(
                (max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
                bids[0]
            );
            setHighestBidder(highest.user?.username || "Ẩn danh");
        } else {
            setHighestBidder("Chưa có");
        }
    };

    // ===== XỬ LÝ THANH TOÁN CUỐI CÙNG =====
    const handleFinalPayment = async (method, amount) => {
        const auctionId = auction?.auctionId;
        if (!auctionId) {
            console.error("❌ [ERROR] auctionId bị undefined!");
            setError("Lỗi: Không tìm thấy auctionId.");
            return;
        }

        try {
            console.log("🔄 [DEBUG] Gửi thanh toán cuối cùng:", { customerId, auctionId, amount, method });

            const response = await axios.post(
                `${apiConfig.transactions}/create`,
                {
                    customerId,
                    auctionId,
                    amount: parseFloat(amount),
                    paymentMethod: method,
                    returnUrl: window.location.href
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { redirectUrl } = response.data;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                alert("Không thể tạo giao dịch. Vui lòng thử lại!");
            }
        } catch (err) {
            console.error("❌ [ERROR] Thanh toán cuối cùng thất bại:", err.response?.data || err.message);
            setError("Thanh toán cuối cùng thất bại. Vui lòng thử lại.");
        }
    };

    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('status'); // Sửa thành 'status'

        if (paymentStatus === 'SUCCESS') { // Sửa thành 'SUCCESS'
            setPaymentSuccess(true);
            setShowFinalPaymentOptions(false); // Ẩn nút thanh toán
            toast.success("Thanh toán thành công!");
        }
    }, []);

    // ===== TÍNH GIÁ TRỊ =====
    const startingPrice = parseFloat(auction?.currentPrice) || 0;
    const depositAmount = startingPrice * 0.1;
    const bidStep = parseFloat(auction?.bidStep) || 0;
    const highestBidAmount = bidHistory[0]?.bidAmount || startingPrice;

    // Sắp xếp bidHistory theo giá đấu (giảm dần) -> topBids
    const sortedBids = [...bidHistory].sort((a, b) => b.bidAmount - a.bidAmount);
    const topBids = sortedBids.slice(0, 5);

    // Nếu chưa tải xong dữ liệu
    if (!auction) return <p className="loading-text">Đang tải dữ liệu...</p>;

    return (
        <>
            <div className="auction-detail">
                {/* Layout 3 cột */}
                <div className="auction-content" style={{ display: "flex" }}>
                    {/* Cột 1: Hình ảnh sản phẩm */}
                    <div className="auction-image" style={{ flex: 1 }}>
                        {auction.product?.image && (
                            <img
                                src={auction.product.image}
                                alt={auction.product.name}
                                className="product-image"
                            />
                        )}
                    </div>

                    {/* Cột 2: Thông tin sản phẩm và đấu giá */}
                    <div className="auction-info" style={{ flex: 2, marginLeft: "1rem" }}>
                        <h2 className="auction-title">
                            {auction?.product?.name || "Sản phẩm chưa xác định"}
                        </h2>
                        <p>{auction.product?.description || "Không có mô tả"}</p>
                        <div className="info-section">
                            <div>
                                <strong>Giá khởi điểm:</strong>{" "}
                                {startingPrice.toLocaleString("vi-VN")} VNĐ
                            </div>
                            <div>
                                <strong>Giá đặt cọc:</strong>{" "}
                                {depositAmount.toLocaleString("vi-VN")} VNĐ
                            </div>
                            <div>
                                <strong>Bước giá:</strong> {bidStep.toLocaleString("vi-VN")} VNĐ
                            </div>

                            <motion.div
                                className={`current-price ${priceUpdated ? "highlight" : ""}`}
                                animate={{ scale: priceUpdated ? 1.1 : 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                Giá hiện tại: {highestBidAmount.toLocaleString("vi-VN")} VNĐ
                            </motion.div>

                            <div>
                                <strong>Người Đấu giá cao nhất:</strong>{" "}
                                {highestBidder !== "Chưa có" && bidHistory[0]?.user ? (
                                    <a
                                        href={`/profile/${bidHistory[0].user.accountId}`}
                                        className="highest-bidder"
                                    >
                                        {highestBidder}
                                    </a>
                                ) : (
                                    <span className="highest-bidder">{highestBidder}</span>
                                )}
                            </div>
                            <div>
                                <strong>Thời gian còn lại:</strong>{" "}
                                <span className="time-left">{timeLeft}</span>
                            </div>
                            <div>
                                <strong>Người đăng bán:</strong>{" "}
                                {auction.product?.account ? (
                                    <Link to={`/profile/${auction.product.account.accountId}`}>
                                        {auction.product.account.username}
                                    </Link>
                                ) : (
                                    <span>Chưa có thông tin</span>
                                )}
                            </div>
                        </div>

                        {/* Trạng thái đấu giá */}
                        {auction.status === "pending" ? (
                            <p style={{ color: "orange", fontWeight: "bold", marginTop: "1rem" }}>
                                ⚠️ Phiên đấu giá chưa bắt đầu.
                            </p>
                        ) : auction.status === "ended" ? (
                            <div style={{ marginTop: "1rem" }}>
                                <p style={{ color: "red", fontWeight: "bold" }}>
                                    ⚠️ Phiên đấu giá đã kết thúc.
                                </p>
                                {winnerBid ? (
                                    <>
                                        <p>
                                            Người thắng:{" "}
                                            <a
                                                href={`/profile/${winnerBid.user?.accountId}`}
                                                className="highest-bidder"
                                            >
                                                {winnerBid.user?.username || "Ẩn danh"}
                                            </a>
                                        </p>
                                        {/* Kiểm tra nếu người dùng hiện tại là người thắng đấu giá */}
                                        {user?.customerId === winnerBid.user?.accountId && !paymentSuccess && (
                                            <div style={{ backgroundColor: "#e0ffe0", padding: "1rem", borderRadius: "5px" }}>
                                                <h3>Chúc mừng bạn đã đấu giá thành công!</h3>
                                                <p>
                                                    Số tiền thanh toán còn lại là:{" "}
                                                    {(
                                                        winnerBid.bidAmount -
                                                        depositAmount
                                                    ).toLocaleString("vi-VN")}{" "}
                                                    VNĐ
                                                </p>
                                                <p>Vui lòng thực hiện thanh toán số tiền còn lại để hoàn tất giao dịch.</p>

                                                {/* Nút để hiển thị tùy chọn thanh toán */}
                                                <button
                                                    onClick={() => setShowFinalPaymentOptions(true)}
                                                    style={{ padding: "0.5rem 1rem", backgroundColor: "#0070ba", color: "#fff" }}
                                                >
                                                    Thanh toán số tiền còn lại
                                                </button>

                                                {/* Hiển thị tùy chọn thanh toán (VNPay hoặc PayPal) */}
                                                {showFinalPaymentOptions && (
                                                    <div style={{ marginTop: "1rem" }}>
                                                        <h3>Chọn phương thức thanh toán:</h3>
                                                        <p>
                                                            <strong>Số tiền thanh toán:</strong>{" "}
                                                            {(winnerBid.bidAmount - depositAmount).toLocaleString('vi-VN')} VNĐ
                                                        </p>
                                                        <button
                                                            onClick={() => handleFinalPayment("PAYPAL", winnerBid.bidAmount - depositAmount)}
                                                            style={{ padding: "0.5rem 1rem", marginRight: "0.5rem", backgroundColor: "#0070ba", color: "#fff" }}
                                                        >
                                                            Thanh toán bằng PayPal
                                                        </button>
                                                        <button
                                                            onClick={() => handleFinalPayment("VNPAY", winnerBid.bidAmount - depositAmount)}
                                                            style={{ padding: "0.5rem 1rem", backgroundColor: "#e41e25", color: "#fff" }}
                                                        >
                                                            Thanh toán bằng VNPAY
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p>Không có người thắng.</p>
                                )}
                            </div>
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

                    {/* Cột 3: Gọi component Bảng xếp hạng */}
                    <AuctionRanking topBids={topBids} />
                </div>

                {/* Lịch sử đấu giá (nếu muốn để dưới) */}
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

            <ToastContainer position="top-right" autoClose={2000} />
        </>
    );
};

export default AuctionDetailPage;
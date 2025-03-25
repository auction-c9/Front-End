import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import "../../styles/AuctionRanking.css";

const AuctionRanking = ({ topBids }) => {
    // Lưu giá đấu cao nhất của mỗi người
    const userBidsMap = {};

    topBids.forEach((bid) => {
        const username = bid.user?.username || "Ẩn danh";
        if (!userBidsMap[username] || bid.bidAmount > userBidsMap[username].bidAmount) {
            userBidsMap[username] = { ...bid };
        }
    });

    // Chuyển object thành mảng và sắp xếp theo giá đấu giảm dần
    const uniqueBids = Object.values(userBidsMap).sort((a, b) => b.bidAmount - a.bidAmount);
    // Giới hạn top 5
    const limitedBids = uniqueBids.slice(0, 5);

    // Theo dõi top 1 để hiển thị hiệu ứng pháo hoa
    const [highlightTop, setHighlightTop] = useState(false);
    const prevTopUserRef = useRef(null);

    useEffect(() => {
        if (limitedBids.length > 0) {
            const currentTopUser = limitedBids[0].user?.username || "Ẩn danh";
            const prevTopUser = prevTopUserRef.current;
            if (currentTopUser !== prevTopUser) {
                setHighlightTop(true);
                // Tắt highlight sau 2 giây
                const timer = setTimeout(() => {
                    setHighlightTop(false);
                }, 2000);
                return () => clearTimeout(timer);
            }
            prevTopUserRef.current = currentTopUser;
        }
    }, [limitedBids]);

    return (
        <div className="shield-container">
            {/* Hiển thị hiệu ứng pháo hoa nếu highlightTop = true */}
            {highlightTop && (
                <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />
            )}
            <div className="shield-border"></div>
            <div className="shield-inner">
                <div className="leaderboard-content">
                    <h2>BẢNG XẾP HẠNG</h2>
                    <h2>LEADERBOARD</h2>
                    {limitedBids.length === 0 ? (
                        <p className="no-bids">Chưa có ai đấu giá.</p>
                    ) : (
                        <ol className="leaderboard-list">
                            {limitedBids.map((bid, index) => {
                                let rankIcon = "";
                                let iconClass = "";

                                switch (index) {
                                    case 0:
                                        rankIcon = "🥇";
                                        iconClass = "gold";
                                        break;
                                    case 1:
                                        rankIcon = "🥈";
                                        iconClass = "silver";
                                        break;
                                    case 2:
                                        rankIcon = "🥉";
                                        iconClass = "bronze";
                                        break;
                                    default:
                                        rankIcon = `#${index + 1}`;
                                        break;
                                }

                                // Thêm class highlight cho top 1 khi highlightTop = true
                                const highlightClass = index === 0 && highlightTop ? "top-highlight" : "";

                                return (
                                    <li key={bid.user?.username || "anonymous"} className={`leaderboard-item ${highlightClass}`}>
                                        <div className={`rank-icon ${iconClass}`}>
                                            {rankIcon}
                                        </div>
                                        <div className="player-name">
                                            {bid.user?.username || "Ẩn danh"}
                                        </div>
                                        <div className="bid-amount">
                                            {bid.bidAmount.toLocaleString("vi-VN")} VNĐ
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuctionRanking;

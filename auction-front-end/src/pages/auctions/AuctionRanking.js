import React from "react";
import "../../styles/AuctionRanking.css";

const AuctionRanking = ({ topBids }) => {
    // Giới hạn top 5
    const limitedBids = topBids.slice(0, 5);

    return (
        <div className="shield-container">
            {/* Lớp ngoài (viền vàng) */}
            <div className="shield-border"></div>

            {/* Lớp trong (nền đỏ) */}
            <div className="shield-inner">
                <div className="leaderboard-content">
                    {/* Tiêu đề */}
                    <h2>LEADERBOARD</h2>
                    {/* Icon kim cương - tuỳ chỉnh URL hoặc dùng SVG */}
                    <div className="diamond-icon"></div>

                    {/* Bảng xếp hạng */}
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

                                return (
                                    <li key={bid.bidId} className="leaderboard-item">
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

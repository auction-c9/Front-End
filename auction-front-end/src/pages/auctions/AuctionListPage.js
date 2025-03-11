// src/components/auctions/AuctionListPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { Link } from 'react-router-dom';

const AuctionListPage = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        axios.get(`${apiConfig.auctions}`) // API lấy tất cả các phiên đấu giá
            .then(response => setAuctions(response.data))
            .catch(error => console.error('Lỗi khi tải phiên đấu giá:', error));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Danh sách phiên đấu giá</h2>
            {auctions.length === 0 ? (
                <p>Không có phiên đấu giá nào.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {auctions.map(auction => (
                        <div key={auction.auctionId} className="border p-4 rounded shadow">
                            <h3 className="font-semibold text-lg">{auction.product.name}</h3>
                            <p>Giá hiện tại: {auction.currentPrice} VND</p>
                            <p>Thời gian kết thúc: {new Date(auction.auctionEndTime).toLocaleString()}</p>
                            <p>Trạng thái: {auction.status}</p>
                            <Link to={`/auction/${auction.auctionId}`} className="text-blue-500 mt-2 block">Xem chi tiết
                                & Đấu giá</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AuctionListPage;

// src/components/auctions/PlaceBid.js
import React, { useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

const PlaceBid = ({ auctionId, customerId }) => {
    const [amount, setAmount] = useState('');

    const handleBidSubmit = async (e) => {
        e.preventDefault();

        const bidDTO = {
            amount: parseFloat(amount),
            auctionId: auctionId,
            customerId: customerId
        };

        try {
            const response = await axios.post(`${apiConfig.bids}`, bidDTO);
            alert(response.data.message); // Thông báo khi đấu giá thành công
        } catch (error) {
            alert(error.response?.data?.message || 'Đấu giá thất bại');
        }
    };

    return (
        <form onSubmit={handleBidSubmit} className="mt-4">
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Nhập số tiền muốn đấu giá"
                className="border p-2 rounded w-full"
                required
                min="1"
            />
            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                Đặt giá
            </button>
        </form>
    );
};

export default PlaceBid;

import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import {api} from "../../config/apiConfig";

const RegisteredAuctionsHistory = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await api.get('/auctions/registered-history', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setAuctions(response.data);
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };
        fetchAuctions();
    }, []);

    const handleCancel = async (auctionId) => {
        try {
            await api.delete(`/auctions/cancel/${auctionId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setAuctions(auctions.filter(a => a.auctionId !== auctionId));
        } catch (error) {
            console.error('Error canceling auction:', error);
        }
    };

    const mapStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'ended':
                return 'Đã kết thúc';
            case 'active':
                return 'Đang diễn ra';
            case 'pending':
                return 'Chờ đấu giá';
            default:
                return status;
        }
    };

    return (
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th>Thông tin sản phẩm</th>
                <th>Ngày đăng ký</th>
                <th>Tình trạng</th>
                <th>Hủy đăng ký</th>
            </tr>
            </thead>
            <tbody>
            {auctions.map((auction, index) => (
                <tr key={auction.auctionId}>
                    <td>{index + 1}</td>
                    <td>{auction.productName}</td>
                    <td>{auction.productDescription}</td>
                    <td>{auction.createdAt}</td>
                    <td>{mapStatus(auction.status)}</td>
                    <td>
                        <Button
                            variant="danger"
                            onClick={() => handleCancel(auction.auctionId)}
                            disabled={auction.status.toLowerCase() !== 'pending'}
                        >
                            Hủy
                        </Button>
                    </td>
                </tr>
            ))}
            </tbody>
        </Table>
    );
};

export default RegisteredAuctionsHistory;
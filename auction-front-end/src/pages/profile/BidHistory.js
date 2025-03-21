import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Container } from 'react-bootstrap';
import { api } from "../../config/apiConfig";
import UserSidebar from "./UserSidebar"; // Import sidebar
import "../../styles/user.css"; // Import CSS

const BidHistory = () => {
    const [bidHistory, setBidHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBidHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('bids/user', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBidHistory(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBidHistory();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-4">Error: {error}</Alert>;
    }

    return (
        <div className="user-layout">
            <div className="user-container">
                {/* Thêm sidebar */}
                <UserSidebar />

                {/* Phần nội dung chính */}
                <div className="user-content">
                    <h1 className="mb-4">Lịch sử đấu giá</h1>
                    <Table striped bordered hover responsive>
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Số đơn hàng</th>
                            <th>Tên người đấu giá</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá đăng ký</th>
                            <th>Ngày đăng ký</th>
                            <th>Trạng thái</th>
                            <th>Kết quả</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bidHistory.map((bid, index) => (
                            <tr key={bid.bidId}>
                                <td>{index + 1}</td>
                                <td>{bid.auctionId}</td>
                                <td>{bid.user?.username || "Không xác định"}</td>
                                <td>{bid.productName || "Không có thông tin"}</td>
                                <td>{bid.bidAmount}</td>
                                <td>{new Date(bid.registrationDate).toLocaleDateString()}</td>
                                <td>{bid.auctionStatus === "active" ? "Đang đấu giá" : "Đã kết thúc"}</td>
                                <td>{bid.isWinner ? 'Thắng' : 'Không thành công'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default BidHistory;
import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Container, Button, Modal, Form } from 'react-bootstrap';
import { api } from "../../config/apiConfig";
import UserSidebar from "./UserSidebar"; // Import sidebar
import "../../styles/user.css"; // Import CSS

const BidHistory = () => {
    const [bidHistory, setBidHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    // Hàm định dạng ngày: Chuyển sang định dạng ngày/tháng/năm
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Thêm hàm mở modal
    const handleOpenReviewModal = (bidId) => {
        setSelectedBidId(bidId);
        setShowReviewModal(true);
    };

    // Thêm hàm đóng modal
    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedBidId(null);
        setRating(5);
        setComment('');
    };

    // Thêm hàm gửi đánh giá
    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.post('/reviews', {
                bidId: selectedBidId,
                rating,
                comment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Cập nhật UI sau khi gửi thành công
            setBidHistory(prev => prev.map(bid =>
                bid.bidId === selectedBidId ? {...bid, hasReviewed: true} : bid
            ));
            handleCloseReviewModal();
        } catch (err) {
            if (err.response?.status === 409) {
                alert('Bạn đã đánh giá phiên đấu giá này!');
                // Fetch lại dữ liệu để cập nhật trạng thái
                const response = await api.get('bids/user');
                setBidHistory(response.data);
            } else {
                console.error('Lỗi khi gửi đánh giá:', err);
            }
        }
    };

    const formatDateTime = (dateTimeString) => {

        const [datePart, timePart] = dateTimeString.split("T");
        const [month, day, year] = datePart.split("-");
        return `ngày ${day}/${month}/${year} vào lúc ${timePart}`;
    };

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
                            <th>Tên sản phẩm</th>
                            <th>Giá đăng ký</th>
                            <th>Ngày đăng ký</th>
                            <th>Trạng thái</th>
                            <th>Kết quả</th>
                            <th>Đánh giá</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bidHistory.map((bid, index) => (
                            <tr key={bid.bidId}>
                                <td>{index + 1}</td>
                                <td>{bid.auctionId}</td>
                                <td>{bid.productName || "Không có thông tin"}</td>
                                <td>{bid.bidAmount.toLocaleString("vi-VN")} VNĐ</td>
                                <td>
                                    {new Date(bid.registrationDate).toLocaleString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}{" "}
                                    {new Date(bid.registrationDate).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })}
                                </td>
                                <td>{bid.auctionStatus === "active" ? "Đang đấu giá" : "Đã kết thúc"}</td>
                                <td>{bid.isWinner ? 'Thắng' : 'Không thành công'}</td>
                                <td>
                                    {bid.auctionStatus === 'ended' && bid.isWinner && (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleOpenReviewModal(bid.bidId)}
                                            disabled={bid.hasReviewed}
                                        >
                                            {bid.hasReviewed ? 'Đã đánh giá' : 'Đánh giá'}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

                {/* Thêm modal đánh giá */}
                <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Điểm đánh giá</Form.Label>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Button
                                            key={star}
                                            variant={star <= rating ? 'warning' : 'secondary'}
                                            onClick={() => setRating(star)}
                                            className="me-2"
                                        >
                                            {star}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Bình luận</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseReviewModal}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleSubmitReview}>
                            Gửi đánh giá
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default BidHistory;
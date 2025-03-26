import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Container, Button, Modal, Form } from 'react-bootstrap';
import { api } from "../../config/apiConfig";
import UserSidebar from "./UserSidebar"; // Import sidebar
import "../../styles/user.css";
import CustomPagination from "./CustomPagination";
import ReviewModal from "./ReviewModal";
import { useReview } from '../../context/ReviewContext';


const BidHistory = () => {
    const [bidHistory, setBidHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const { setNeedsRefresh } = useReview();

    useEffect(() => {
        const fetchBidHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('bids/user', {
                    params: {
                        page: currentPage,
                        size: 5
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBidHistory(response.data.content);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchBidHistory();
    }, [currentPage]);

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

    // Mở modal đánh giá
    const handleOpenReviewModal = (bidId) => {
        setSelectedBidId(bidId);
        setShowReviewModal(true);
    };

    // Đóng modal đánh giá
    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setSelectedBidId(null);
        setRating(5);
        setComment('');
    };

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
                bid.bidId === selectedBidId ? { ...bid, hasReviewed: true } : bid
            ));
            handleCloseReviewModal();
            setNeedsRefresh(true);
        } catch (err) {
            if (err.response?.status === 409) {
                alert('Bạn đã đánh giá phiên đấu giá này!');
                const response = await api.get('bids/user', {
                    params: {
                        page: currentPage,
                        size: 5
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBidHistory(response.data.content);
            } else {
                console.error('Lỗi khi gửi đánh giá:', err);
            }
        }
    };

    return (
        <div className="user-layout">
            <div className="user-container">
                <UserSidebar />

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
                        {Array.isArray(bidHistory) && bidHistory.map((bid, index) => (
                            <tr key={bid.bidId}>
                                <td>{currentPage * 5 + index + 1}</td>
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
                                <td className="text-center">
                                    {bid.isWinner ? (
                                        <span style={{ color: 'green', fontWeight: 'bold', fontSize: '1.2rem' }}>✔️</span>
                                    ) : (
                                        <span style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem' }}>❌</span>
                                    )}
                                </td>
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

                    {/* Thanh phân trang được bọc trong div căn giữa */}
                    <div className="d-flex justify-content-center mt-4">
                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>

                </div>
            </div>
            <ReviewModal
                show={showReviewModal}
                onClose={handleCloseReviewModal}
                onSubmit={handleSubmitReview}
                bidId={selectedBidId}
            />
        </div>
    );
};

export default BidHistory;

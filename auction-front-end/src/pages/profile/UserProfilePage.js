import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Image, Spinner, Alert, ListGroup, Button } from 'react-bootstrap';
import { api } from '../../config/apiConfig';
import "../../styles/profile.css";
import { useReview } from '../../context/ReviewContext';

const UserProfilePage = () => {
    const { accountID } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const { needsRefresh, setNeedsRefresh } = useReview();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = hours < 12 ? 'sáng' : 'chiều';
        hours = hours % 12 || 12;
        return `${day}/${month}/${year} vào lúc ${hours}:${minutes} ${period}`;
    };

    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/auctions/profile/${accountID}`);
                const profileData = response.data;

                if (!response.data.averageRating) {
                    console.warn("Average rating is missing in response");
                }

                const reviewsResponse = await api.get(`/reviews/seller/${accountID}`);
                setReviews(reviewsResponse.data);
                setProfile({
                    ...profileData,
                    averageRating: profileData.averageRating || 0
                });
            } catch (err) {
                setError(err.response?.data?.message || 'Lỗi khi tải trang cá nhân');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [accountID, refreshFlag]);

    useEffect(() => {
        if (needsRefresh) {
            setRefreshFlag(prev => !prev);
            setNeedsRefresh(false);
        }
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/seller/${accountID}`);
                setReviews(response.data);
            } catch (err) {
                console.error('Error loading reviews:', err);
            }
        };
        fetchReviews();
    }, [accountID, refreshFlag, needsRefresh]);

    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                const response = await api.get(`/follows/check/${accountID}`);
                setIsFollowing(response.data.isFollowing);
            } catch (err) {
                console.error('Error checking follow status:', err);
            }
        };
        checkFollowStatus();
    }, [accountID]);

    const handleFollow = async () => {
        try {
            if (isFollowing) {
                await api.delete(`/follows/${accountID}`);
            } else {
                await api.post(`/follows/${accountID}`);
            }
            setIsFollowing(!isFollowing);
        } catch (err) {
            console.error('Error updating follow status:', err);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Card className="mb-4">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={3} className="text-center">
                            <Image
                                src={profile.avatarUrl || '/placeholder-avatar.png'}
                                roundedCircle
                                fluid
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                        </Col>
                        <Col md={9}>
                            <h2>{profile.fullName}</h2>
                            <p className="text-muted">@{profile.username}</p>
                            {profile.username && (
                                <Button
                                    variant={isFollowing ? "secondary" : "primary"}
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <h3 className="mb-3">Lịch sử đăng bài</h3>

            {profile.auctions && profile.auctions.length === 0 ? (
                <Alert variant="info">No auctions found</Alert>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th style={{ backgroundColor: '#EEA019', color: 'white' }}>Sản phẩm</th>
                        <th style={{ backgroundColor: '#EEA019', color: 'white' }}>Thời gian bắt đầu</th>
                        <th style={{ backgroundColor: '#EEA019', color: 'white' }}>Thời gian kết thúc</th>
                        <th style={{ backgroundColor: '#EEA019', color: 'white' }}>Giá khởi điểm</th>
                        <th style={{ backgroundColor: '#EEA019', color: 'white' }}>Giá hiện tại</th>
                        <th style={{ backgroundColor: '#EEA019', color: 'white' }}>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {profile.auctions.map((auction, index) => (
                        <tr key={index}>
                            <td>{auction.productName}</td>
                            <td>{formatDate(auction.auctionStartTime)}</td>
                            <td>{formatDate(auction.auctionEndTime)}</td>
                            <td>{formatCurrency(auction.basePrice)} VND</td>
                            <td>{formatCurrency(auction.highestBid)} VND</td>
                            <td>
                                    <span className={`badge ${
                                        auction.status === 'active' ? 'bg-success' :
                                            auction.status === 'ended' ? 'bg-secondary' :
                                                auction.status === 'canceled' ? 'bg-danger' :
                                                    'bg-warning'
                                    }`}>
                                        {auction.status === 'pending' && 'Chờ đấu giá'}
                                        {auction.status === 'active' && 'Đang diễn ra'}
                                        {auction.status === 'ended' && 'Đã kết thúc'}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}

            <h3 className="mb-3">Đánh giá của người dùng</h3>
            {profile.averageRating !== null && (
                <div className="mb-3">
                    <strong>Điểm trung bình:</strong> {profile.averageRating}/5
                </div>
            )}

            {reviews.length === 0 ? (
                <Alert variant="info">Chưa có đánh giá</Alert>
            ) : (
                <ListGroup>
                    {reviews.map((review) => (
                        <ListGroup.Item key={review.id}>
                            <strong>{review.buyerName}</strong> - {review.rating} sao
                            <p>{review.comment}</p>
                            <small>{review.productName} - {new Date(review.createdAt).toLocaleDateString()}</small>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default UserProfilePage;
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Row, Col, Card, Table, Image, Spinner, Alert, ListGroup, Button} from 'react-bootstrap';
import {api} from '../../config/apiConfig';
import "../../styles/profile.css";

const UserProfilePage = () => {
    const {accountID} = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`/auctions/profile/${accountID}`);
                setProfile(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error loading profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [accountID]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/seller/${accountID}`);
                setReviews(response.data);
            } catch (err) {
                console.error('Error loading reviews:', err);
            }
        };
        fetchReviews();
    }, [accountID]);

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
                                style={{width: '150px', height: '150px', objectFit: 'cover'}}
                            />
                        </Col>
                        <Col md={9}>
                            <h2>{profile.fullName}</h2>
                            <p className="text-muted">@{profile.username}</p>
                            <Button
                                variant={isFollowing ? "secondary" : "primary"}
                                onClick={handleFollow}
                            >
                                {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                            </Button>
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
                        <th>Sản phẩm</th>
                        <th>Thời gian bắt đầu</th>
                        <th>Thời gian kết thúc</th>
                        <th>Giá khởi điểm</th>
                        <th>Giá hiện tại </th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>
                    <tbody>
                    {profile.auctions.map((auction, index) => (
                        <tr key={index}>
                            <td>{auction.productName}</td>
                            <td>{new Date(auction.auctionStartTime).toLocaleString()}</td>
                            <td>{new Date(auction.auctionEndTime).toLocaleString()}</td>
                            <td>{auction.basePrice} VND</td>
                            <td>{auction.highestBid} VND</td>
                            <td>
                    <span
                        className={`badge ${
                            auction.status === 'active' ? 'bg-success' :
                                auction.status === 'ended' ? 'bg-secondary' :
                                    auction.status === 'canceled' ? 'bg-dang0er' :
                                        'bg-warning'
                        }`}
                    >
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
// src/components/auctions/AuctionListPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { Link } from 'react-router-dom';

// React Bootstrap
import { Container, Row, Col, Card } from 'react-bootstrap';

const AuctionListPage = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        axios.get(`${apiConfig.auctions}`)
            .then(response => setAuctions(response.data))
            .catch(error => console.error('Lỗi khi tải phiên đấu giá:', error));
    }, []);

    // Hàm tính thời gian còn lại
    const getTimeLeft = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        if (diff <= 0) return '0s left';

        const totalSeconds = Math.floor(diff / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds}s left`;
    };

    return (
        <Container>
            <h2 className="my-4">Danh sách phiên đấu giá</h2>
            {auctions.length === 0 ? (
                <p>Không có phiên đấu giá nào.</p>
            ) : (
                <Row>
                    {auctions.map(auction => {
                        const timeLeft = getTimeLeft(auction.auctionEndTime);

                        return (
                            <Col xs={12} sm={6} md={4} lg={3} className="mb-6" key={auction.auctionId}>
                                <Link to={`/auction/${auction.auctionId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Card className="h-100">
                                        <Card.Img
                                            variant="top"
                                            src={auction.product?.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                                            alt={auction.product?.name}
                                            style={{ objectFit: 'cover', height: '200px' }}
                                        />
                                        <Card.Body>
                                            <Card.Title className="mb-2" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                                {auction.product?.name}
                                            </Card.Title>
                                            <Card.Text className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                {auction.product?.location || 'Chưa rõ địa điểm'}
                                            </Card.Text>
                                            <Card.Text className="text-success" style={{ fontSize: '0.85rem' }}>
                                                {auction.product?.condition || 'New'}
                                            </Card.Text>
                                            <Card.Text className="text-muted" style={{ textDecoration: 'line-through', fontSize: '0.85rem' }}>
                                                MSRP {auction.product?.msrp ? `€${auction.product.msrp}` : 'N/A'}
                                            </Card.Text>
                                            <Card.Text style={{ fontSize: '1rem', fontWeight: 'bold', color: '#007bff' }}>
                                                {auction.currentPrice} VND
                                            </Card.Text>
                                            <Card.Text style={{ fontSize: '0.85rem', color: 'orange' }}>
                                                {timeLeft}
                                            </Card.Text>
                                            <Card.Text style={{ fontSize: '0.85rem', color: '#333' }}>
                                                Trạng thái: {auction.status}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default AuctionListPage;

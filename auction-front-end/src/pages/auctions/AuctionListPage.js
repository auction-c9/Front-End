// src/components/auctions/AuctionListPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { Link } from 'react-router-dom';

// React Bootstrap
import { Container, Row, Col, Card } from 'react-bootstrap';

const AuctionListPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [timeLeftMap, setTimeLeftMap] = useState({}); // Lưu thông tin {time, highlight} theo auctionId

    // Hàm tính thời gian còn lại với hiệu ứng highlight khi dưới 15 phút
    const calculateTimeLeft = (endTime) => {
        const now = new Date();
        const end = new Date(endTime);
        const diff = end - now;
        if (diff <= 0) return { time: 'Đã kết thúc', highlight: false };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        // Highlight nếu còn dưới 15 phút
        const highlight = diff < 15 * 60 * 1000;
        return { time: `${hours > 0 ? `${hours}g ` : ''}${minutes}p ${seconds}s`, highlight };
    };

    // Gọi API lấy danh sách phiên đấu giá
    useEffect(() => {
        axios.get(`${apiConfig.auctions}`)
            .then(response => {
                setAuctions(response.data);

                // Khởi tạo timeLeftMap ban đầu với object {time, highlight}
                const initialTimeLeft = {};
                response.data.forEach(auction => {
                    initialTimeLeft[auction.auctionId] = calculateTimeLeft(auction.auctionEndTime);
                });
                setTimeLeftMap(initialTimeLeft);
            })
            .catch(error => console.error('Lỗi khi tải phiên đấu giá:', error));
    }, []);

    // Cập nhật thời gian đếm ngược mỗi giây
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeftMap(prevMap => {
                const updatedMap = { ...prevMap };
                auctions.forEach(auction => {
                    updatedMap[auction.auctionId] = calculateTimeLeft(auction.auctionEndTime);
                });
                return updatedMap;
            });
        }, 1000);

        return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
    }, [auctions]);

    return (
        <Container>
            <h2 className="my-4">Danh sách phiên đấu giá</h2>
            {auctions.length === 0 ? (
                <p>Không có phiên đấu giá nào.</p>
            ) : (
                <Row>
                    {auctions.map(auction => (
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
                                            {auction.currentPrice.toLocaleString('vi-VN')} VNĐ
                                        </Card.Text>
                                        <Card.Text
                                            style={{
                                                fontSize: '0.85rem',
                                                color: timeLeftMap[auction.auctionId]?.highlight ? 'red' : 'orange',
                                                fontWeight: timeLeftMap[auction.auctionId]?.highlight ? 'bold' : 'normal'
                                            }}
                                        >
                                            {timeLeftMap[auction.auctionId]?.time || 'Đang tải...'}
                                        </Card.Text>
                                        <Card.Text style={{ fontSize: '0.85rem', color: '#333' }}>
                                            Trạng thái: {auction.status}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default AuctionListPage;

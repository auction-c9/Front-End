import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Hàm sắp xếp mảng các phiên đấu giá
const sortAuctions = (auctions) => {
    const now = new Date();
    return auctions.sort((a, b) => {
        // Nếu cả hai đều có cùng trạng thái
        if (a.status === b.status) {
            if (a.status === "pending") {
                // Tính độ chênh lệch giữa auctionStartTime và thời gian hiện tại
                const diffA = Math.abs(new Date(a.auctionStartTime) - now);
                const diffB = Math.abs(new Date(b.auctionStartTime) - now);
                return diffA - diffB;
            } else if (a.status === "active") {
                // Tính độ chênh lệch giữa auctionEndTime và thời gian hiện tại
                const diffA = Math.abs(new Date(a.auctionEndTime) - now);
                const diffB = Math.abs(new Date(b.auctionEndTime) - now);
                return diffA - diffB;
            } else {
                // Nếu trạng thái không phải pending hay active, sắp xếp theo auctionId
                return a.auctionId - b.auctionId;
            }
        }
        // Nếu trạng thái khác nhau, định nghĩa thứ tự ưu tiên:
        // pending trước, sau đó active, và cuối cùng là ended
        const statusOrder = { pending: 0, active: 1, ended: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });
};

const AuctionListPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [timeLeftMap, setTimeLeftMap] = useState({});
    const location = useLocation();

    // Hàm tính thời gian còn lại cho mỗi phiên đấu giá
    const calculateTimeLeft = (auction) => {
        if (!auction) return { time: 'Đang tải...', highlight: false };

        const now = new Date();
        let end;
        let label = '';

        if (auction.status === "pending") {
            end = new Date(auction.auctionStartTime);
            label = "Bắt đầu sau: ";
        } else if (auction.status === "active") {
            end = new Date(auction.auctionEndTime);
            label = "Kết thúc sau: ";
        } else {
            return { time: "Đã kết thúc", highlight: false };
        }

        const diff = end - now;
        if (diff <= 0)
            return { time: auction.status === "pending" ? "Đang bắt đầu..." : "Đã kết thúc", highlight: false };

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        // Đánh dấu highlight nếu thời gian còn lại dưới 15 phút
        const highlight = diff < 15 * 60 * 1000;

        return { time: `${label}${hours > 0 ? `${hours}g ` : ''}${minutes}p ${seconds}s`, highlight };
    };

    // Hàm tính giá hiện tại của phiên đấu giá dựa trên bid cao nhất
    const getCurrentPrice = (auction) => {
        if (auction.bids && auction.bids.length > 0) {
            const highestBid = Math.max(...auction.bids.map(bid => bid.bidAmount));
            return highestBid;
        }
        return auction.currentPrice;
    };

    // Gọi API và lọc kết quả dựa trên các tham số tìm kiếm
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get('query');
        const categoriesParam = params.get('categories');
        const priceParam = params.get('price');
        const statusParam = params.get('status');
        const apiUrl = `${apiConfig.auctions}?${params.toString()}`;

        axios.get(apiUrl)
            .then(response => {
                let auctionsData = response.data;

                if (queryParam) {
                    auctionsData = auctionsData.filter(auction =>
                        auction.product?.name.toLowerCase().includes(queryParam.toLowerCase())
                    );
                }

                if (categoriesParam) {
                    const selectedCategoryIds = categoriesParam.split(',').map(Number);
                    auctionsData = auctionsData.filter(auction =>
                        selectedCategoryIds.includes(auction.product?.category.categoryId)
                    );
                }

                if (priceParam) {
                    if (priceParam === "1") {
                        auctionsData = auctionsData.filter(auction => auction.currentPrice < 1000000);
                    } else if (priceParam === "2") {
                        auctionsData = auctionsData.filter(auction => auction.currentPrice >= 1000000 && auction.currentPrice < 3000000);
                    } else if (priceParam === "3") {
                        auctionsData = auctionsData.filter(auction => auction.currentPrice >= 3000000 && auction.currentPrice < 5000000);
                    } else if (priceParam === "4") {
                        auctionsData = auctionsData.filter(auction => auction.currentPrice >= 5000000);
                    }
                }

                if (statusParam) {
                    const statusMapping = {
                        "upcoming": "pending",
                        "ongoing": "active",
                        "ending": "ended"
                    };
                    auctionsData = auctionsData.filter(auction =>
                        auction.status === statusMapping[statusParam]
                    );
                }

                // Sắp xếp các phiên đấu giá theo logic ưu tiên
                auctionsData = sortAuctions(auctionsData);
                setAuctions(auctionsData);

                const initialTimeLeft = {};
                auctionsData.forEach(auction => {
                    initialTimeLeft[auction.auctionId] = calculateTimeLeft(auction);
                });
                setTimeLeftMap(initialTimeLeft);
            })
            .catch(error => console.error('Lỗi khi tải phiên đấu giá:', error));
    }, [location.search]);

    // Cập nhật thời gian còn lại cho mỗi phiên đấu giá mỗi giây
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeftMap(prevMap => {
                const updatedMap = { ...prevMap };
                auctions.forEach(auction => {
                    updatedMap[auction.auctionId] = calculateTimeLeft(auction);
                });
                return updatedMap;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [auctions]);

    return (
        <Container>
            <h2 className="my-4">Danh sách phiên đấu giá</h2>
            {auctions.length === 0 ? (
                <p>Không có sản phẩm nào.</p>
            ) : (
                <Row>
                    {auctions.map(auction => (
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-4" key={auction.auctionId}>
                            <Link to={`/auction/${auction.auctionId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Card className="h-100">
                                    <Card.Img
                                        variant="top"
                                        src={
                                            auction.product?.images && auction.product.images.length > 0
                                                ? auction.product.images[0].imageUrl
                                                : 'https://via.placeholder.com/400x300?text=No%20Image'
                                        }
                                        alt={auction.product?.name}
                                        style={{ objectFit: 'cover', height: '200px' }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="mb-2" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                            {auction.product?.name}
                                        </Card.Title>
                                        <Card.Text style={{ fontSize: '1rem', fontWeight: 'bold', color: '#007bff' }}>
                                            {getCurrentPrice(auction).toLocaleString('vi-VN')} VNĐ
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
                                        <Link
                                            to={`/auction/${auction.auctionId}`}
                                            className="btn btn-sm mt-2"
                                            style={{
                                                backgroundColor: '#965E00',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                        >
                                            Xem chi tiết
                                        </Link>
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

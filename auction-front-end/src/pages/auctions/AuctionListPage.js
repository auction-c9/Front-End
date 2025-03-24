import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { Link, useLocation } from 'react-router-dom';

// React Bootstrap
import { Container, Row, Col, Card } from 'react-bootstrap';

const AuctionListPage = () => {
    const [auctions, setAuctions] = useState([]);
    const [timeLeftMap, setTimeLeftMap] = useState({});
    const location = useLocation();

    // Hàm tính thời gian còn lại
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
        const highlight = diff < 15 * 60 * 1000;

        return { time: `${label}${hours > 0 ? `${hours}g ` : ''}${minutes}p ${seconds}s`, highlight };
    };

    // Gọi API và lọc kết quả dựa trên tham số tìm kiếm
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get('query'); // Từ khóa tìm kiếm (nếu có)
        const categoriesParam = params.get('categories'); // Các categoryId được chọn
        const priceParam = params.get('price'); // Mức giá được chọn
        const statusParam = params.get('status'); // Trạng thái được chọn (upcoming, ongoing, ending)
        const apiUrl = `${apiConfig.auctions}?${params.toString()}`;

        axios.get(apiUrl)
            .then(response => {
                console.log("JSON response:", response.data); // In ra dữ liệu JSON
                let auctionsData = response.data;

                // Lọc theo từ khóa (nếu có)
                if (queryParam) {
                    auctionsData = auctionsData.filter(auction =>
                        auction.product?.name.toLowerCase().includes(queryParam.toLowerCase())
                    );
                }

                // Lọc theo category nếu có tham số categories trong URL
                if (categoriesParam) {
                    const selectedCategoryIds = categoriesParam.split(',').map(Number);
                    auctionsData = auctionsData.filter(auction =>
                        selectedCategoryIds.includes(auction.product?.category.categoryId)
                    );
                }

                // Lọc theo mức giá nếu có tham số price trong URL
                if (priceParam) {
                    if (priceParam === "1") {
                        // Dưới 1 triệu
                        auctionsData = auctionsData.filter(auction => auction.currentPrice < 1000000);
                    } else if (priceParam === "2") {
                        // Từ 1 đến dưới 3 triệu
                        auctionsData = auctionsData.filter(auction => auction.currentPrice >= 1000000 && auction.currentPrice < 3000000);
                    } else if (priceParam === "3") {
                        // Từ 3 đến dưới 5 triệu
                        auctionsData = auctionsData.filter(auction => auction.currentPrice >= 3000000 && auction.currentPrice < 5000000);
                    } else if (priceParam === "4") {
                        // Trên 5 triệu
                        auctionsData = auctionsData.filter(auction => auction.currentPrice >= 5000000);
                    }
                }

                // Lọc theo trạng thái nếu có tham số status trong URL
                if (statusParam) {
                    // Mapping giữa giá trị từ SearchBar và giá trị thực tế trong Auction
                    const statusMapping = {
                        "upcoming": "pending",
                        "ongoing": "active",
                        "ending": "ended"
                    };
                    auctionsData = auctionsData.filter(auction =>
                        auction.status === statusMapping[statusParam]
                    );
                }

                setAuctions(auctionsData);

                // Tạo danh sách thời gian ban đầu cho từng phiên đấu giá
                const initialTimeLeft = {};
                auctionsData.forEach(auction => {
                    initialTimeLeft[auction.auctionId] = calculateTimeLeft(auction);
                });
                setTimeLeftMap(initialTimeLeft);
            })
            .catch(error => console.error('Lỗi khi tải phiên đấu giá:', error));
    }, [location.search]);

    // Cập nhật thời gian đếm ngược mỗi giây
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
                        <Col xs={12} sm={6} md={4} lg={3} className="mb-6" key={auction.auctionId}>
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

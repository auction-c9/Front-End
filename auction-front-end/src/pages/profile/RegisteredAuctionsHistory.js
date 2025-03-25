import React, { useEffect, useState } from 'react';
import {Table, Button, Pagination, Spinner, Alert} from 'react-bootstrap';
import {api} from "../../config/apiConfig";
import UserSidebar from "./UserSidebar";
import CustomPagination from "../profile/CustomPagination";
import "../../styles/user.css";

const RegisteredAuctionsHistory = () => {
    const [auctions, setAuctions] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    // Redirect to login nếu không có token
                    window.location.href = "/login";
                    return;
                }
                const response = await api.get(`/auctions/registered-history?page=${currentPage}&size=5`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAuctions(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching auctions:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAuctions();
    }, [currentPage]);

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

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
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
    const formatDateTime = (dateTimeString) => {
        // Tách phần ngày và thời gian
        const [datePart, timePart] = dateTimeString.split("T");
        // Tách ngày, tháng, năm
        const [year, month, day] = datePart.split("-");
        return `ngày ${day}/${month}/${year} vào lúc ${timePart}`;
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    };

    return (
        <div className="user-layout">
            <div className="user-container">
                <UserSidebar />
                <div className="user-content">
                    <h2>Lịch sử đăng ký đấu giá</h2>
                    {isLoading && (
                        <div className="text-center my-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}

                    {!isLoading && auctions.length === 0 && (
                        <Alert variant="info" className="mt-3">
                            Không có dữ liệu đấu giá
                        </Alert>
                    )}
                    {!isLoading && auctions.length > 0 && (
                    <>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên sản phẩm</th>
                            <th>Thông tin sản phẩm</th>
                            <th>Ngày Bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Tình trạng</th>
                            <th>Giá khởi điểm</th>
                            <th>Hủy đăng ký</th>
                        </tr>
                        </thead>
                        <tbody>
                        {auctions.map((auction, index) => (
                            <tr key={auction.auctionId}>
                                <td>{index + 1}</td>
                                <td>{auction.productName}</td>
                                <td>{auction.productDescription}</td>
                                <td>{formatDateTime(auction.auctionStartTime).replace("T", " vào lúc ")}</td>
                                <td>{formatDateTime(auction.auctionEndTime)}</td>
                                <td>{mapStatus(auction.status)}</td>
                                <td>{formatPrice(auction.basePrice)}</td>
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

                        <CustomPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisteredAuctionsHistory;
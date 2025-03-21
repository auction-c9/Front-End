import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { FaUsers, FaBoxOpen, FaMoneyBillWave } from "react-icons/fa";
import adminService from "../../services/adminService";

const AdminStatistics = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalProducts: 0,
        totalTransactions: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await adminService.getAllStatistic();
            console.log("Data: ", data);
            setStats(data);
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">📊 Admin Dashboard</h2>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Loading statistics...</p>
                </div>
            ) : (
                <Row>
                    {/* Customers */}
                    <Col md={4}>
                        <Card className="text-white bg-primary mb-3">
                            <Card.Body>
                                <Card.Title><FaUsers /> Thành viên</Card.Title>
                                <Card.Text className="display-4">{stats.totalCustomers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Products */}
                    <Col md={4}>
                        <Card className="text-white bg-success mb-3">
                            <Card.Body>
                                <Card.Title><FaBoxOpen /> Sản phẩm</Card.Title>
                                <Card.Text className="display-4">{stats.totalProducts}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Transactions */}
                    <Col md={4}>
                        <Card className="text-white bg-danger mb-3">
                            <Card.Body>
                                <Card.Title><FaMoneyBillWave /> Giao dịch</Card.Title>
                                <Card.Text className="display-4">{stats.totalTransactions}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default AdminStatistics;

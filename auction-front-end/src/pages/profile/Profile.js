import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as AuthService from '../../services/AuthService';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

export default function Profile() {
    const { user, loading } = useAuth(); // Lấy user từ context
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await AuthService.getProfile(); // Gọi API lấy profile
                setProfile(data);
            } catch (err) {
                setError('Không thể tải thông tin cá nhân. Vui lòng thử lại.');
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <Spinner animation="border" />; // Hiển thị loading khi chưa sẵn sàng
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="mt-5">
            <Card className="shadow">
                <Card.Body>
                    <h3>Thông tin tài khoản</h3>
                    {profile ? (
                        <div>
                            <p><strong>Username:</strong> {profile.username}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Role:</strong> {profile.role}</p>
                            {/* Có thể bổ sung thêm các trường khác nếu backend trả về */}
                        </div>
                    ) : (
                        <p>Đang tải thông tin...</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Card } from 'react-bootstrap';

export default function ForgotPasswordStep1() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                const errorData = await response.json(); // <-- Đọc thông báo lỗi từ server
                throw new Error(errorData.message || 'Có lỗi xảy ra');
            }

            navigate('/forgot-password/step2', { state: { username } });
        } catch (err) {
            console.error("Chi tiết lỗi:", err); // <-- Log đầy đủ lỗi
            setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="forgot-password-card">
            <Card.Body>
                <h3 className="text-center mb-4">Quên mật khẩu</h3>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nhập username của bạn</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="w-100"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Gửi mã xác nhận'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
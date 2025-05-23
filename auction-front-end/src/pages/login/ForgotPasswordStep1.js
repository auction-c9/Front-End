import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Card, Container } from 'react-bootstrap';

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
                const errorData = await response.json(); // Đọc thông báo lỗi từ server
                throw new Error(errorData.message || 'Có lỗi xảy ra');
            }

            navigate('/forgot-password/step2', { state: { username } });
        } catch (err) {
            console.error("Chi tiết lỗi:", err); // Log đầy đủ lỗi
            setError(err.message || 'Có lỗi xảy ra khi gửi yêu cầu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center vh-100"
        >
            <Card className="p-4 shadow-lg" style={{ width: '30vw', minWidth: '320px' }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Quên mật khẩu</h3>
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
                        <Form.Group className="mb-3" style={{ width: '25vw', minWidth: '250px' }}>
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
                            style={{ width: '12.5vw', minWidth: '125px' }}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Gửi mã xác nhận'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

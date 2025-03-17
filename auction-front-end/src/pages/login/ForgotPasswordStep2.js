import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Card } from 'react-bootstrap';

export default function ForgotPasswordStep2() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/verify-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: state?.username,
                    code
                }),
            });

            if (!response.ok) throw new Error(await response.text());

            navigate('/forgot-password/step3', {
                state: {
                    username: state?.username,
                    code
                }
            });
        } catch (err) {
            setError(err.message || 'Mã xác nhận không hợp lệ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="forgot-password-card">
            <Card.Body>
                <h3 className="text-center mb-4">Xác nhận mã</h3>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mã xác nhận đã gửi đến email của bạn</Form.Label>
                        <Form.Control
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="w-100"
                    >
                        {isLoading ? 'Đang xác nhận...' : 'Xác nhận mã'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
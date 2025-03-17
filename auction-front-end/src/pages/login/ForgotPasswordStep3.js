import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form, Alert, Card } from 'react-bootstrap';

export default function ForgotPasswordStep3() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: state?.username,
                    code: state?.code,
                    newPassword,
                    confirmPassword
                }),
            });

            if (!response.ok) throw new Error(await response.text());

            navigate('/login', {
                state: { successMessage: 'Đặt lại mật khẩu thành công!' }
            });
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi đặt lại mật khẩu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="forgot-password-card">
            <Card.Body>
                <h3 className="text-center mb-4">Đặt lại mật khẩu</h3>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu mới</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        className="w-100"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}
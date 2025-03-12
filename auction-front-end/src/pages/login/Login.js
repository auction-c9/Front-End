import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import './../../styles/login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Lấy hàm login từ context

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials); // Gọi login context (có lưu token + refresh token)
            navigate('/profile'); // Điều hướng về trang profile sau login
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu');
        }
    };

    return (
        <Container className="login-container">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body>
                            <h3 className="text-center mb-4">Đăng nhập</h3>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="username" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Tên đăng nhập"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group controlId="password" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Mật khẩu"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                                <Button type="submit" className="w-100">Đăng nhập</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './../../styles/login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth(); // Đã bỏ setUser và setToken không sử dụng
    const location = useLocation();

    useEffect(() => {
        document.body.classList.add("hide-layout");
        return () => document.body.classList.remove("hide-layout");
    }, []);

    useEffect(() => {
        if (location.state?.successMessage) {
            setError(location.state.successMessage);
            navigate(location.pathname, { replace: true });
        }
    }, [navigate, location.pathname, location.state?.successMessage]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            navigate('/');
        } catch (err) {
            setError('Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu');
        }
    };

    return (
        <GoogleOAuthProvider clientId="227675714691-n86lpo59sf1t9id3el9p82hcf9aokihu.apps.googleusercontent.com">
            <div className="login-page">
                <div className="background-image">
                    <img
                        src="/static/breker_auctionteam_hero.jpg"
                        alt="Background"
                    />
                </div>

                <Container className="login-container">
                    <Row className="justify-content-center">
                        <Col md={6} lg={4} className="login-form-col">
                            <Card className="login-card shadow">
                                <Card.Body>
                                    <div className="text-center">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                                            alt="User Icon"
                                            className="login-avatar"
                                        />
                                    </div>

                                    <Card.Title as="h3" className="login-title text-center">
                                        Đăng nhập tài khoản
                                    </Card.Title>

                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                    <Form onSubmit={handleSubmit} className="mt-2">
                                        <Form.Group controlId="username" className="username-group">
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                placeholder="Nhập tên đăng nhập"
                                                value={credentials.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="password" className="password-group">
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Nhập mật khẩu"
                                                value={credentials.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>

                                        <div className="remember-me-container">
                                            <Form.Check
                                                type="checkbox"
                                                label="Ghi nhớ tôi"
                                                className="remember-me-checkbox"
                                            />
                                        </div>

                                        <div className="login-button-container">
                                            <Button
                                                className="login-btn"
                                                type="submit"
                                            >
                                                Đăng nhập
                                            </Button>
                                        </div>

                                        <div className="forgot-register-container">
                                            <a href="/forgot-password" className="forgot-password">
                                                Quên mật khẩu?
                                            </a>
                                            <a href="/register" className="register-link">
                                                Đăng ký ngay
                                            </a>
                                        </div>

                                        <GoogleLogin
                                            onSuccess={async (credentialResponse) => {
                                                try {
                                                    await loginWithGoogle(credentialResponse.credential);
                                                    navigate('/');
                                                } catch (error) {
                                                    setError('Đăng nhập bằng Google thất bại');
                                                }
                                            }}
                                            onError={() => {
                                                setError('Đăng nhập Google không thành công');
                                            }}
                                        />
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </GoogleOAuthProvider>
    );
}
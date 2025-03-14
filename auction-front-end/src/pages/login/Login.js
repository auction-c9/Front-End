import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button, Alert, Card, Row, Col} from 'react-bootstrap';
import {useAuth} from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './../../styles/login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({username: '', password: ''});
    const [error, setError] = useState('');
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const navigate = useNavigate();
    const {login, setUser, setToken} = useAuth();
    const {loginWithGoogle} = useAuth();

    const handleChange = (e) => {
        setCredentials({...credentials, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            console.log('login success');
            navigate('/');
        } catch (err) {
            console.error("Lỗi đăng nhập:", err.message);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra tài khoản và mật khẩu');
        }
    };

    // Xử lý đăng nhập Google
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsGoogleLoading(true);
        try {
            // Gửi token Google đến backend
            const response = await fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token: credentialResponse.credential}),
            });

            if (!response.ok) throw new Error('Đăng nhập Google thất bại');

            // Nhận JWT từ backend
            const {jwt, customerId} = await response.json();

            // Lưu thông tin vào localStorage
            localStorage.setItem('token', jwt);
            if (customerId) localStorage.setItem('customerId', customerId);

            // Cập nhật trạng thái đăng nhập
            const decoded = jwtDecode(jwt);
            setUser({
                username: decoded.sub,
                customerId: customerId
            });
            setToken(jwt);

            navigate('/');
        } catch (error) {
            console.error('Lỗi đăng nhập Google:', error);
            setError('Không thể đăng nhập bằng Google');
        } finally {
            setIsGoogleLoading(false);
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
                                    {/* Icon người */}
                                    <div className="text-center">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
                                            alt="User Icon"
                                            className="login-avatar"
                                        />
                                    </div>

                                    {/* Tiêu đề - cách icon 10px */}
                                    <Card.Title as="h3" className="login-title text-center">
                                        Đăng nhập tài khoản
                                    </Card.Title>

                                    {/* Thông báo lỗi (nếu có) */}
                                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

                                    <Form onSubmit={handleSubmit} className="mt-2">
                                        {/* Ô nhập tên đăng nhập (không có label) */}
                                        <Form.Group controlId="username" className="username-group">
                                            <Form.Control type="text"
                                                          name="username"
                                                          placeholder="Nhập tên đăng nhập"
                                                          value={credentials.username}
                                                          onChange={handleChange}
                                                          required
                                            />
                                        </Form.Group>

                                        {/* Ô nhập mật khẩu (không có label) */}
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

                                        {/* Checkbox Ghi nhớ tôi */}
                                        <div className="remember-me-container">
                                            <Form.Check
                                                type="checkbox"
                                                label="Ghi nhớ tôi"
                                                className="remember-me-checkbox"
                                            />
                                        </div>

                                        {/* Nút Đăng nhập (căn giữa) */}
                                        <div className="login-button-container">
                                            <Button
                                                className="login-btn"
                                                type="submit"
                                            >
                                                Đăng nhập
                                            </Button>
                                        </div>

                                        {/* Quên mật khẩu (trái) + Đăng ký ngay (phải) */}
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
                                                    console.error('Lỗi đăng nhập Google:', error);
                                                    setError('Đăng nhập bằng Google thất bại');
                                                }
                                            }}
                                            onError={() => {
                                                setError('Đăng nhập Google không thành công');
                                            }}
                                        />
                                        {isGoogleLoading && (
                                            <div className="loading-overlay">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        )}
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
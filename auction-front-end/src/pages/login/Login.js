import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button, Alert, Card, Row, Col} from 'react-bootstrap';
import {FcGoogle} from "react-icons/fc";
import {useAuth} from '../../context/AuthContext';
import './../../styles/login.css';

export default function Login() {
    const [credentials, setCredentials] = useState({username: '', password: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {login} = useAuth();

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

    const handleGoogleLogin = () => {
        console.log("Google login clicked!");
        // TODO: Thêm logic đăng nhập Google (OAuth, Firebase, v.v.)
    };

    return (
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

                                    {/* Nút Google (dưới cùng) */}
                                    <div className="google-button-container">
                                        <Button
                                            variant="light"
                                            className="google-login-btn"
                                            onClick={handleGoogleLogin}
                                        >
                                            <FcGoogle className="google-logo"/>
                                            Đăng nhập với Google
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
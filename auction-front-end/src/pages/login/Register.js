import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import {api} from "../../config/apiConfig";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        identityCard: '',
        address: '',
        password: '',
        confirmPassword: '',
        captcha: '',
        captchaQuestion: '',
        avatarFile: null
    });

    const [captcha, setCaptcha] = useState({ question: '', answer: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        fetchCaptcha();
    }, []);

    const fetchCaptcha = async () => {
        try {
            // Sửa thành api.get thay vì axios.get
            const response = await api.get('/auth/register-question');
            setCaptcha({
                question: response.data.question,
                answer: response.data.answer
            });
            setFormData(prev => ({
                ...prev,
                captchaQuestion: response.data.question
            }));
        } catch (error) {
            console.error('Lỗi tải captcha:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            avatarFile: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'avatarFile' && formData[key]) {
                formDataToSend.append(key, formData[key]);
            } else if (formData[key] !== null && formData[key] !== undefined) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await api.post('/auth/register',  formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Hiển thị thông báo thành công bằng Toast
            toast.success('Đăng ký thành công! Đang chuyển hướng...', {
                autoClose: 2000,
                onClose: () => navigate('/login')
            });
        } catch (error) {
            console.error('Lỗi đăng ký:', error.response?.data || error.message);
            toast.error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin');
        }
    };

    return (
        <Container className="mt-5">
            {/* Thêm ToastContainer để hiển thị thông báo */}
            <ToastContainer
                position="top-right"
                newestOnTop
                limit={3}
            />
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Đăng ký tài khoản</Card.Title>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <Form.Group controlId="avatarFile">
                                            <Form.Label>Ảnh đại diện</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* Hàng 1 - Họ tên và SĐT */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="name">
                                            <Form.Label>Họ và tên</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="phone">
                                            <Form.Label>Số điện thoại</Form.Label>
                                            <Form.Control
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                pattern="\d{10,15}"
                                                required
                                            />
                                            <Form.Text className="text-muted">
                                                Ví dụ: 0912345678
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Hàng 2 - Tên đăng nhập và Email */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="username">
                                            <Form.Label>Tên đăng nhập</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Hàng 3 - CMND và Địa chỉ */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="identityCard">
                                            <Form.Label>CMND/CCCD</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="identityCard"
                                                value={formData.identityCard}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="address">
                                            <Form.Label>Địa chỉ</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Hàng 4 - Mật khẩu và Xác nhận mật khẩu */}
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="password">
                                            <Form.Label>Mật khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="confirmPassword">
                                            <Form.Label>Xác nhận mật khẩu</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Hàng 5 - Captcha */}
                                <Row className="mb-3">
                                    <Col md={8}>
                                        <Form.Group controlId="captcha">
                                            <Form.Label>Mã xác minh</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="captcha"
                                                value={formData.captcha}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} className="d-flex align-items-end">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={fetchCaptcha}
                                            className="w-100"
                                        >
                                            Làm mới mã
                                        </Button>
                                    </Col>
                                </Row>
                                <div className="mb-3">
                                    <Form.Text>
                                        Câu hỏi xác minh: {captcha.question}
                                    </Form.Text>
                                </div>

                                {/* Điều khoản và Đăng ký */}
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Tôi đồng ý với các điều khoản sử dụng"
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit">
                                        Đăng ký
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
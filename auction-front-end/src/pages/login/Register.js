import { useEffect, useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { api } from "../../config/apiConfig";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [captcha, setCaptcha] = useState({ question: '', answer: '' });
    const navigate = useNavigate();

    // Validation Schema
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Họ và tên là bắt buộc')
            .min(6, 'Tối thiểu 6 ký tự'),
        username: Yup.string()
            .required('Tên đăng nhập là bắt buộc')
            .min(6, 'Tối thiểu 6 ký tự')
            .matches(/^[a-zA-Z0-9]+$/, 'Không chứa ký tự đặc biệt'),
        email: Yup.string()
            .email('Email không hợp lệ')
            .required('Email là bắt buộc'),
        phone: Yup.string()
            .matches(/^\d{10,15}$/, 'Số điện thoại không hợp lệ')
            .required('Số điện thoại là bắt buộc'),
        dob: Yup.date()
            .required('Ngày sinh là bắt buộc')
            .max(new Date(), 'Ngày sinh không hợp lệ'),
        bankAccount: Yup.string()
            .required('Số tài khoản là bắt buộc')
            .matches(/^\d{10,20}$/, 'Số tài khoản phải từ 10-20 chữ số'),
        bankName: Yup.string()
            .required('Tên ngân hàng là bắt buộc'),
        identityCard: Yup.string()
            .matches(/^\d{9,20}$/, 'CMND/CCCD không hợp lệ')
            .required('CMND/CCCD là bắt buộc'),
        address: Yup.string()
            .required('Địa chỉ là bắt buộc')
            .min(10, 'Tối thiểu 10 ký tự'),
        password: Yup.string()
            .min(6, 'Tối thiểu 6 ký tự')
            .required('Mật khẩu là bắt buộc'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
            .required('Xác nhận mật khẩu là bắt buộc'),
        captcha: Yup.string()
            .required('Mã xác minh là bắt buộc'),
        avatarFile: Yup.mixed()
            .required('Ảnh đại diện là bắt buộc')
            .test(
                'fileType',
                'Chỉ chấp nhận ảnh (JPEG, PNG)',
                value => value && ['image/jpeg', 'image/png'].includes(value.type)
            )
    });

    useEffect(() => {
        fetchCaptcha();
    }, []);

    const fetchCaptcha = async () => {
        try {
            const response = await api.get('/auth/register-question');
            setCaptcha({
                question: response.data.question,
                answer: response.data.answer
            });
        } catch (error) {
            toast.error('Lỗi tải câu hỏi bảo mật');
        }
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const formData = new FormData();

            // Append all form values
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'avatarFile' && value) {
                    formData.append(key, value, value.name);
                } else if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            // Add captcha question from state
            formData.append('captchaQuestion', captcha.question);

            await api.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Đăng ký thành công! Đang chuyển hướng...', {
                autoClose: 2000,
                onClose: () => {
                    resetForm();
                    navigate('/login');
                }
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="mt-5">
            <ToastContainer position="top-right" newestOnTop limit={3} />
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow">
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Đăng ký tài khoản</Card.Title>

                            <Formik
                                initialValues={{
                                    name: '',
                                    username: '',
                                    email: '',
                                    phone: '',
                                    identityCard: '',
                                    address: '',
                                    password: '',
                                    confirmPassword: '',
                                    captcha: '',
                                    avatarFile: null,
                                    dob: '',
                                    bankAccount: '',
                                    bankName: ''
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                validateOnChange={true}
                                validateOnBlur={true}
                                validateOnMount={true}
                            >
                                {({ handleSubmit, isSubmitting, setFieldValue }) => (
                                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                        {/* Avatar Upload */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ảnh đại diện</Form.Label>
                                            <Field name="avatarFile">
                                                {({ field, form }) => (
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            setFieldValue('avatarFile', file);
                                                        }}
                                                        isInvalid={form.errors.avatarFile && form.touched.avatarFile}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage
                                                name="avatarFile"
                                                component="div"
                                                className="text-danger small mt-1"
                                            />
                                        </Form.Group>

                                        {/* Personal Info */}
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Họ và tên</Form.Label>
                                                    <Field
                                                        name="name"
                                                        as={Form.Control}
                                                        type="text"
                                                        placeholder="Nguyễn Văn A"
                                                    />
                                                    <ErrorMessage
                                                        name="name"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Số điện thoại</Form.Label>
                                                    <Field
                                                        name="phone"
                                                        as={Form.Control}
                                                        type="tel"
                                                        placeholder="0912345678"
                                                    />
                                                    <ErrorMessage
                                                        name="phone"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Account Info */}
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Tên đăng nhập</Form.Label>
                                                    <Field
                                                        name="username"
                                                        as={Form.Control}
                                                        type="text"
                                                        placeholder="tendangnhap123"
                                                    />
                                                    <ErrorMessage
                                                        name="username"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Email</Form.Label>
                                                    <Field
                                                        name="email"
                                                        as={Form.Control}
                                                        type="email"
                                                        placeholder="example@email.com"
                                                    />
                                                    <ErrorMessage
                                                        name="email"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Date of Birth & Identity Card */}
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>CMND/CCCD</Form.Label>
                                                    <Field
                                                        name="identityCard"
                                                        as={Form.Control}
                                                        type="text"
                                                        placeholder="123456789"
                                                    />
                                                    <ErrorMessage
                                                        name="identityCard"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Ngày sinh</Form.Label>
                                                    <Field
                                                        name="dob"
                                                        as={Form.Control}
                                                        type="date"
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                    <ErrorMessage
                                                        name="dob"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Bank Info */}
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Số tài khoản</Form.Label>
                                                    <Field
                                                        name="bankAccount"
                                                        as={Form.Control}
                                                        type="text"
                                                        placeholder="1234567890"
                                                    />
                                                    <ErrorMessage
                                                        name="bankAccount"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Tên ngân hàng</Form.Label>
                                                    <Field as="select" name="bankName" className="form-control">
                                                        <option value="">Chọn ngân hàng</option>
                                                        <option value="Vietcombank">Vietcombank</option>
                                                        <option value="Techcombank">Techcombank</option>
                                                        <option value="ACB">ACB</option>
                                                        <option value="BIDV">BIDV</option>
                                                        <option value="Agribank">Agribank</option>
                                                        <option value="Sacombank">Sacombank</option>
                                                        <option value="VPBank">VPBank</option>
                                                        <option value="MB Bank">MB Bank</option>
                                                        <option value="Shinhan Bank">Shinhan Bank</option>
                                                        <option value="OCB">OCB</option>
                                                    </Field>
                                                    <ErrorMessage
                                                        name="bankName"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Address */}
                                        <Row className="mb-3">
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label>Địa chỉ</Form.Label>
                                                    <Field
                                                        name="address"
                                                        as={Form.Control}
                                                        type="text"
                                                        placeholder="Số nhà, đường, thành phố"
                                                    />
                                                    <ErrorMessage
                                                        name="address"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Password Section */}
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Mật khẩu</Form.Label>
                                                    <Field
                                                        name="password"
                                                        as={Form.Control}
                                                        type="password"
                                                    />
                                                    <ErrorMessage
                                                        name="password"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                                                    <Field
                                                        name="confirmPassword"
                                                        as={Form.Control}
                                                        type="password"
                                                    />
                                                    <ErrorMessage
                                                        name="confirmPassword"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        {/* Captcha Section */}
                                        <Row className="mb-3">
                                            <Col md={8}>
                                                <Form.Group>
                                                    <Form.Label>Mã xác minh</Form.Label>
                                                    <Field
                                                        name="captcha"
                                                        as={Form.Control}
                                                        type="text"
                                                        placeholder="Nhập câu trả lời"
                                                    />
                                                    <ErrorMessage
                                                        name="captcha"
                                                        component="div"
                                                        className="text-danger small mt-1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4} className="d-flex align-items-end">
                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={fetchCaptcha}
                                                    className="w-100"
                                                    type="button"
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

                                        {/* Terms Checkbox */}
                                        <Form.Group className="mb-4">
                                            <Field
                                                name="terms"
                                                type="checkbox"
                                                className="me-2"
                                                required
                                            />
                                            <Form.Label>
                                                Tôi đồng ý với các điều khoản sử dụng
                                            </Form.Label>
                                        </Form.Group>

                                        {/* Submit Button */}
                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;

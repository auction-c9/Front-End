// ProfilePage.jsx
import React, {useEffect, useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {Button, Alert, Card, Spinner, Image} from 'react-bootstrap';
import {api} from '../../config/apiConfig';
import {useAuth} from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './../../styles/ProfilePage.css';
import {toast} from 'react-toastify';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../styles/user.css";
import UserSidebar from "./UserSidebar";

const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Họ tên không được để trống'),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    phone: Yup.string()
        .matches(/^\d{10,15}$/, 'Số điện thoại không hợp lệ')
        .nullable(),
    dob: Yup.date().nullable().max(new Date(), 'Ngày sinh không hợp lệ'),
    identityCard: Yup.string().nullable(),
    address: Yup.string().nullable(),
    currentPassword: Yup.string()
        .when('newPassword', (newPassword, schema) => { // Sử dụng hàm callback
            return newPassword ? schema.required('Vui lòng nhập mật khẩu hiện tại') : schema;
        }),
    newPassword: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .nullable(),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
        .when('newPassword', (newPassword, schema) => { // Sử dụng hàm callback
            return newPassword ? schema.required('Vui lòng xác nhận mật khẩu') : schema;
        }),
});

const ProfilePage = () => {
    const {user} = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordField = (setter) => () => {
        setter(prev => !prev);
    };

    const handleCancelPasswordChange = (resetForm, values) => {
        setShowPasswordFields(false);
        resetForm({
            values: {
                ...values, currentPassword: '', newPassword: '', confirmPassword: ''
            }
        });
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                setProfileData(response.data);
            } catch (err) {
                setError('Không thể tải thông tin cá nhân');
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProfile();
    }, [user]);

    const handleSubmit = async (values, {setSubmitting}) => {
        try {
            const formData = new FormData();

            // Thêm các trường dữ liệu
            Object.entries(values).forEach(([key, value]) => {
                if (key !== 'avatarFile' && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            // Thêm file ảnh nếu có
            if (values.avatarFile) {
                formData.append('avatarFile', values.avatarFile);
            }

            const response = await api.put('/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfileData(response.data);
            if (values.newPassword) {
                toast.success('🎉 Cập nhật mật khẩu thành công!');
            } else {
                toast.success('✅ Cập nhật thông tin thành công!');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || '❌ Cập nhật thất bại');
            setError(err.response?.data?.error || 'Cập nhật thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFieldValue('avatarFile', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    if (loading) return <Spinner animation="border"/>;

    return (
        <div className="user-layout">
            <div className="user-container">
                <UserSidebar/>
                <div className="user-content">
                    <Card className="profile-card">
                        <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="colored"/>
                        <Card.Body>
                            <h2 className="mb-4">Quản lý hồ sơ cá nhân</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Formik
                                initialValues={{
                                    name: profileData?.name || '',
                                    email: profileData?.email || '',
                                    phone: profileData?.phone || '',
                                    dob: profileData?.dob ? new Date(profileData.dob) : null,
                                    identityCard: profileData?.identityCard || '',
                                    address: profileData?.address || '',
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: '',
                                    avatarFile: null,
                                }}
                                validationSchema={ProfileSchema}
                                onSubmit={handleSubmit}
                            >
                                {({isSubmitting, setFieldValue, values, resetForm}) => (
                                    <Form>
                                        {/* Avatar Section */}
                                        <div className="mb-4 text-center">
                                            <Image
                                                src={avatarPreview || profileData?.avatarUrl || '/default-avatar.png'}
                                                roundedCircle
                                                className="profile-avatar"
                                            />
                                            <div className="mt-2">
                                                <input
                                                    type="file"
                                                    id="avatarFile"
                                                    name="avatarFile"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageChange(e, setFieldValue)}
                                                    className="d-none"
                                                />
                                                <label htmlFor="avatarFile" className="btn btn-outline-primary">
                                                    Đổi ảnh đại diện
                                                </label>
                                            </div>
                                        </div>

                                        {/* Personal Info Fields */}
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label htmlFor="name">Họ và tên</label>
                                                <Field name="name" className="form-control"/>
                                                <ErrorMessage name="name" component="div" className="text-danger"/>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" type="email" className="form-control" disabled/>
                                                <ErrorMessage name="email" component="div" className="text-danger"/>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="phone">Số điện thoại</label>
                                                <Field name="phone" className="form-control"/>
                                                <ErrorMessage name="phone" component="div" className="text-danger"/>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="dob">Ngày sinh</label>
                                                <Field name="dob">
                                                    {({field, form}) => (<DatePicker
                                                            selected={field.value}
                                                            onChange={(date) => form.setFieldValue('dob', date)}
                                                            dateFormat="dd/MM/yyyy"
                                                            className="form-control"
                                                            showYearDropdown
                                                        />)}
                                                </Field>
                                                <ErrorMessage name="dob" component="div" className="text-danger"/>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="identityCard">CMND/CCCD</label>
                                                <Field name="identityCard" className="form-control"/>
                                                <ErrorMessage name="identityCard" component="div"
                                                              className="text-danger"/>
                                            </div>

                                            <div className="col-12">
                                                <label htmlFor="address">Địa chỉ</label>
                                                <Field name="address" as="textarea" className="form-control" rows={3}/>
                                                <ErrorMessage name="address" component="div" className="text-danger"/>
                                            </div>

                                            {/* Password Change Section */}
                                            {showPasswordFields && (<div className="row mt-4">
                                                    <div className="col-12 d-flex justify-content-between">
                                                        <div className="row g-3">
                                                            {/* Current Password */}
                                                            <div className="col-md-4 password-input-group">
                                                                <label>Mật khẩu hiện tại</label>
                                                                <div className="d-flex align-items-center">
                                                                    <Field
                                                                        name="currentPassword"
                                                                        type={showCurrentPassword ? "text" : "password"}
                                                                        className="form-control"
                                                                    />
                                                                    <span
                                                                        className="password-toggle-icon ms-2"
                                                                        onClick={togglePasswordField(setShowCurrentPassword)}
                                                                    >
                                                                    {showCurrentPassword ? '🙈' : '👁️'}
                                                                    </span>
                                                                </div>
                                                                <ErrorMessage name="currentPassword" component="div"
                                                                              className="text-danger"/>
                                                            </div>

                                                            {/* New Password */}
                                                            <div className="col-md-4 password-input-group">
                                                                <label>Mật khẩu mới</label>
                                                                <div className="d-flex align-items-center">
                                                                    <Field
                                                                        name="newPassword"
                                                                        type={showNewPassword ? "text" : "password"}
                                                                        className="form-control"
                                                                    />
                                                                    <span
                                                                        className="password-toggle-icon ms-2"
                                                                        onClick={togglePasswordField(setShowNewPassword)}
                                                                    >
                                                                      {showNewPassword ? '🙈' : '👁️'}
                                                                    </span>
                                                                </div>
                                                                <ErrorMessage name="newPassword" component="div"
                                                                              className="text-danger"/>
                                                            </div>

                                                            {/* Confirm Password */}
                                                            <div className="col-md-4 password-input-group">
                                                                <label>Xác nhận mật khẩu</label>
                                                                <div className="d-flex align-items-center">
                                                                    <Field
                                                                        name="confirmPassword"
                                                                        type={showConfirmPassword ? "text" : "password"}
                                                                        className="form-control"
                                                                    />
                                                                    <span
                                                                        className="password-toggle-icon ms-2"
                                                                        onClick={togglePasswordField(setShowConfirmPassword)}
                                                                    >
                              {showConfirmPassword ? '🙈' : '👁️'}
                            </span>
                                                                </div>
                                                                <ErrorMessage name="confirmPassword" component="div"
                                                                              className="text-danger"/>
                                                            </div>

                                                            {/* Cancel Button */}
                                                            <div className="col-12 mt-3">
                                                                <Button
                                                                    variant="outline-danger"
                                                                    onClick={() => handleCancelPasswordChange(resetForm, values)}
                                                                >
                                                                    Hủy đổi mật khẩu
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>)}
                                        </div>

                                        <div className="action-buttons mt-4">
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    type="submit"
                                                    variant="primary"
                                                    disabled={isSubmitting}
                                                    className="save-button"
                                                >
                                                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                                </Button>

                                                {!showPasswordFields && (
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => setShowPasswordFields(true)}
                                                        className="change-password-button"
                                                    >
                                                        Đổi mật khẩu
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password Change Section */}
                                        {showPasswordFields && (
                                            <div className="row mt-4">
                                                <div className="col-12">
                                                    <h5>Đổi mật khẩu</h5>
                                                    <div className="row g-3">
                                                        {/* ... Giữ nguyên các field password ... */}
                                                        <div className="col-12 mt-3">
                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() => handleCancelPasswordChange(resetForm, values)}
                                                            >
                                                                Hủy đổi mật khẩu
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Form>)}
                            </Formik>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>);
};

export default ProfilePage;
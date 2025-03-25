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
import { Modal } from 'react-bootstrap';
import ChangePasswordForm from "./ChangePasswordForm";

const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Họ tên không được để trống'),
    email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
    phone: Yup.string()
        .matches(/^\d{10,15}$/, 'Số điện thoại không hợp lệ')
        .nullable(),
    dob: Yup.date()
        .nullable()
        .max(new Date(new Date().setFullYear(new Date().getFullYear() - 18)), 'Bạn phải từ 18 tuổi trở lên'),
    bankAccount: Yup.string()
        .matches(/^\d{10,20}$/, 'Số tài khoản phải có từ 10 đến 20 chữ số')
        .nullable(),
    bankName: Yup.string().nullable(),
    identityCard: Yup.string().nullable(),
    address: Yup.string().nullable(),
});

const ProfilePage = () => {
    const {user} = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "/login";
            return;
        }
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
            const dobISO = values.dob ? new Date(values.dob).toISOString().split('T')[0] : null;
            const fields = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                dob: dobISO,
                bankAccount: values.bankAccount,
                bankName: values.bankName,
                identityCard: values.identityCard,
                address: values.address
            };

            Object.entries(fields).forEach(([key, value]) => {
                if (key !== 'avatarFile' && value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            if (values.avatarFile) {
                formData.append('avatarFile', values.avatarFile);
            }

            const response = await api.put('/auth/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProfileData(response.data);
            toast.success('✅ Cập nhật thông tin thành công!');
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.error || '❌ Cập nhật thất bại');
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

    const handlePasswordSubmit = async (values) => {
        try {
            await api.put('/auth/change-password', values);
            toast.success('🎉 Đổi mật khẩu thành công!');
            setShowPasswordModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || '❌ Đổi mật khẩu thất bại');
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
                                    bankAccount: profileData?.bankAccount || '',
                                    bankName: profileData?.bankName || '',
                                    identityCard: profileData?.identityCard || '',
                                    address: profileData?.address || '',
                                    avatarFile: null,
                                }}
                                validationSchema={ProfileSchema}
                                onSubmit={handleSubmit}
                            >
                                {({isSubmitting, setFieldValue, values}) => (
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
                                                        className="form-control w-100"
                                                        showYearDropdown
                                                        wrapperClassName="w-100"
                                                    />)}
                                                </Field>
                                                <ErrorMessage name="dob" component="div" className="text-danger"/>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="bankAccount">Số tài khoản</label>
                                                <Field
                                                    name="bankAccount"
                                                    className="form-control"
                                                    placeholder="Nhập số tài khoản"
                                                />
                                                <ErrorMessage name="bankAccount" component="div"
                                                              className="text-danger"/>
                                            </div>

                                            <div className="col-md-6">
                                                <label htmlFor="bankName">Tên ngân hàng</label>
                                                <Field
                                                    name="bankName"
                                                    className="form-control"
                                                    placeholder="Nhập tên ngân hàng"
                                                />
                                                <ErrorMessage name="bankName" component="div" className="text-danger"/>
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

                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => setShowPasswordModal(true)}
                                                >
                                                    Đổi mật khẩu
                                                </Button>
                                            </div>
                                        </div>
                                    </Form>)}
                            </Formik>
                        </Card.Body>
                    </Card>

                    <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Đổi mật khẩu</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <ChangePasswordForm
                                onSubmit={handlePasswordSubmit}
                                onCancel={() => setShowPasswordModal(false)}
                            />
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
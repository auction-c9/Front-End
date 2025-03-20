// ChangePasswordForm.jsx
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-bootstrap';

const ChangePasswordForm = ({ onSubmit, onCancel }) => {
    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
        newPassword: Yup.string()
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .required('Vui lòng nhập mật khẩu mới'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp')
            .required('Vui lòng xác nhận mật khẩu')
    });

    return (
        <Formik
            initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            name="currentPassword"
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.currentPassword}
                        />
                        <ErrorMessage name="currentPassword">
                            {(msg) => <div className="text-danger small mt-1">{msg}</div>}
                        </ErrorMessage>
                    </div>

                    <div className="mb-3">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.newPassword}
                        />
                        <ErrorMessage name="newPassword">
                            {(msg) => <div className="text-danger small mt-1">{msg}</div>}
                        </ErrorMessage>
                    </div>

                    <div className="mb-3">
                        <label>Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                        />
                        <ErrorMessage name="confirmPassword">
                            {(msg) => <div className="text-danger small mt-1">{msg}</div>}
                        </ErrorMessage>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <Button variant="secondary" onClick={onCancel}>Hủy</Button>
                        <Button variant="primary" type="submit">Đổi mật khẩu</Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ChangePasswordForm;
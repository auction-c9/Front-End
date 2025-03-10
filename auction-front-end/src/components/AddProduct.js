// src/components/AddProduct.js
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import productService from '../services/productService';
import { useNavigate } from 'react-router-dom';

const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    price: Yup.number()
        .typeError('Giá phải là số')
        .positive('Giá phải lớn hơn 0')
        .required('Giá là bắt buộc'),
    // Nếu có file upload, bạn có thể thêm validate cho trường đó
});

const AddProduct = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px' }}>
            <h2>Thêm sản phẩm mới</h2>
            <Formik
                initialValues={{
                    name: '',
                    description: '',
                    price: '',
                    // Nếu có file upload, ví dụ: image: null
                }}
                validationSchema={ProductSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        // Gọi API tạo sản phẩm
                        const createdProduct = await productService.createProduct(values);
                        console.log('Sản phẩm đã được tạo:', createdProduct);
                        resetForm();
                        // Chuyển hướng hoặc thông báo thành công
                        navigate('/');
                    } catch (error) {
                        console.error('Lỗi khi tạo sản phẩm:', error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form>
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="name">Tên sản phẩm:</label>
                            <Field type="text" name="name" id="name" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="description">Mô tả:</label>
                            <Field as="textarea" name="description" id="description" />
                            <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="price">Giá:</label>
                            <Field type="text" name="price" id="price" />
                            <ErrorMessage name="price" component="div" style={{ color: 'red' }} />
                        </div>

                        {/* Nếu muốn upload file, ví dụ image */}
                        {/*
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="image">Ảnh sản phẩm:</label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={(event) => {
                  setFieldValue('image', event.currentTarget.files[0]);
                }}
              />
            </div>
            */}

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AddProduct;

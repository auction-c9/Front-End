import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import 'react-toastify/dist/ReactToastify.css';

const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    categoryId: Yup.number().required('Danh mục là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    basePrice: Yup.number().positive('Giá khởi điểm phải lớn hơn 0').required('Giá khởi điểm là bắt buộc'),
    bidStep: Yup.number().positive('Bước giá phải lớn hơn 0').required('Bước giá là bắt buộc'),
    auctionStartTime: Yup.date().required('Thời gian bắt đầu là bắt buộc'),
    auctionEndTime: Yup.date().required('Thời gian kết thúc là bắt buộc'),
    imageFile: Yup.mixed().required('Ảnh đại diện là bắt buộc'),
    imageFiles: Yup.array().min(1, 'Ít nhất một ảnh chi tiết là bắt buộc')
});

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageDetailPreviews, setImageDetailPreviews] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageFileChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        setFieldValue('imageFile', file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleImageFilesChange = (event, setFieldValue) => {
        const files = Array.from(event.currentTarget.files);
        setFieldValue('imageFiles', files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImageDetailPreviews(previews);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Thêm sản phẩm mới</h2>
            <Formik
                initialValues={{
                    name: '',
                    categoryId: '',
                    description: '',
                    basePrice: '',
                    bidStep: '',
                    auctionStartTime: '',
                    auctionEndTime: '',
                    imageFile: null,
                    imageFiles: []
                }}
                validationSchema={ProductSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        const formData = new FormData();
                        formData.append('name', values.name);
                        formData.append('categoryId', values.categoryId);
                        formData.append('description', values.description);
                        formData.append('basePrice', values.basePrice);
                        formData.append('bidStep', values.bidStep);
                        formData.append('auctionStartTime', values.auctionStartTime);
                        formData.append('auctionEndTime', values.auctionEndTime);
                        formData.append('imageFile', values.imageFile);
                        values.imageFiles.forEach((file) => formData.append('imageFiles', file));

                        await productService.createProduct(formData);
                        toast.success('🎉 Thêm sản phẩm thành công!');
                        resetForm();
                        setImagePreview(null);
                        setImageDetailPreviews([]);
                        setTimeout(() => navigate('/'), 2000);
                    } catch (error) {
                        console.error('Lỗi khi thêm sản phẩm:', error);
                        toast.error('❌ Lỗi khi thêm sản phẩm!');
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Tên sản phẩm:</label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Danh mục:</label>
                            <Field as="select" name="categoryId">
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="categoryId" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Mô tả:</label>
                            <Field as="textarea" name="description" />
                            <ErrorMessage name="description" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Giá khởi điểm:</label>
                            <Field type="number" name="basePrice" />
                            <ErrorMessage name="basePrice" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Bước giá:</label>
                            <Field type="number" name="bidStep" />
                            <ErrorMessage name="bidStep" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Thời gian bắt đầu đấu giá:</label>
                            <Field type="datetime-local" name="auctionStartTime" />
                            <ErrorMessage name="auctionStartTime" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Thời gian kết thúc đấu giá:</label>
                            <Field type="datetime-local" name="auctionEndTime" />
                            <ErrorMessage name="auctionEndTime" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Ảnh đại diện sản phẩm:</label>
                            <input
                                type="file"
                                name="imageFile"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setFieldValue)}
                            />
                            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', marginTop: '10px' }} />}
                            <ErrorMessage name="imageFile" component="div" style={{ color: 'red' }} />
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label>Ảnh chi tiết sản phẩm (nhiều ảnh):</label>
                            <input
                                type="file"
                                name="imageFiles"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageFilesChange(e, setFieldValue)}
                            />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {imageDetailPreviews.map((src, index) => (
                                    <img key={index} src={src} alt={`Detail ${index}`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                ))}
                            </div>
                            <ErrorMessage name="imageFiles" component="div" style={{ color: 'red' }} />
                        </div>

                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                        </button>
                    </Form>
                )}
            </Formik>

            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default AddProduct;

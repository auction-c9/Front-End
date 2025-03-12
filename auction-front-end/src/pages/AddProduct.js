// src/components/AddProduct.js
import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import 'react-toastify/dist/ReactToastify.css';

const ProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    categoryId: Yup.number()
        .transform((value, originalValue) =>
            originalValue === "" ? undefined : Number(originalValue)
        )
        .min(1, 'Vui lòng chọn danh mục')
        .required('Danh mục là bắt buộc'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    basePrice: Yup.number()
        .positive('Giá khởi điểm phải lớn hơn 0')
        .required('Giá khởi điểm là bắt buộc'),
    bidStep: Yup.number()
        .positive('Bước giá phải lớn hơn 0')
        .required('Bước giá là bắt buộc'),
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
                console.log('Categories fetched:', data); // Debug: kiểm tra dữ liệu danh mục
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
        <Container className="py-4">
            <h2 className="mb-4">Thêm sản phẩm mới</h2>
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
                        formData.append('categoryId', Number(values.categoryId));
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
                {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                        <Form.Group className="mb-3" controlId="formProductName">
                            <Form.Label>Tên sản phẩm:</Form.Label>
                            <Field name="name" as={Form.Control} type="text" placeholder="Nhập tên sản phẩm" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCategory">
                            <Form.Label>Danh mục:</Form.Label>
                            <Field
                                as={Form.Select}
                                name="categoryId"
                                onChange={(e) => {
                                    console.log('Selected category:', e.target.value);
                                    setFieldValue('categoryId', e.target.value);
                                }}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.categoryId} value={String(category.categoryId)}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Không có danh mục nào</option>
                                )}
                            </Field>
                            <ErrorMessage name="categoryId" component="div" className="text-danger" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Mô tả:</Form.Label>
                            <Field as="textarea" name="description" className="form-control" placeholder="Nhập mô tả sản phẩm" />
                            <ErrorMessage name="description" component="div" className="text-danger" />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasePrice">
                                    <Form.Label>Giá khởi điểm:</Form.Label>
                                    <Field name="basePrice" as={Form.Control} type="number" placeholder="Nhập giá khởi điểm" />
                                    <ErrorMessage name="basePrice" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBidStep">
                                    <Form.Label>Bước giá:</Form.Label>
                                    <Field name="bidStep" as={Form.Control} type="number" placeholder="Nhập bước giá" />
                                    <ErrorMessage name="bidStep" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formAuctionStartTime">
                                    <Form.Label>Thời gian bắt đầu đấu giá:</Form.Label>
                                    <Field name="auctionStartTime" as={Form.Control} type="datetime-local" />
                                    <ErrorMessage name="auctionStartTime" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formAuctionEndTime">
                                    <Form.Label>Thời gian kết thúc đấu giá:</Form.Label>
                                    <Field name="auctionEndTime" as={Form.Control} type="datetime-local" />
                                    <ErrorMessage name="auctionEndTime" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="formImageFile">
                            <Form.Label>Ảnh đại diện sản phẩm:</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setFieldValue)}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <Image src={imagePreview} alt="Preview" thumbnail style={{ maxWidth: '200px' }} />
                                </div>
                            )}
                            <ErrorMessage name="imageFile" component="div" className="text-danger" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formImageFiles">
                            <Form.Label>Ảnh chi tiết sản phẩm (nhiều ảnh):</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageFilesChange(e, setFieldValue)}
                            />
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {imageDetailPreviews.map((src, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={`Detail ${index}`}
                                        thumbnail
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                ))}
                            </div>
                            <ErrorMessage name="imageFiles" component="div" className="text-danger" />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang xử lý...' : 'Thêm sản phẩm'}
                        </Button>
                    </Form>
                )}
            </Formik>

            <ToastContainer position="top-right" autoClose={2000} />
        </Container>
    );
};

export default AddProduct;

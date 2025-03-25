import React, { useEffect, useState } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Image
} from 'react-bootstrap';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import 'react-toastify/dist/ReactToastify.css';
import { parse, isValid, format } from 'date-fns';


// Hàm parse chuỗi 'dd/MM/yyyy HH:mm' -> Date
const parseDateTime = (value) => {
    // Tùy bạn muốn format: 'dd/MM/yyyy HH:mm' hay chỉ 'dd/MM/yyyy'
    // Ở đây demo HH:mm
    const parsed = parse(value, 'dd/MM/yyyy HH:mm', new Date());
    return isValid(parsed) ? parsed : null;
};

// Custom rule Yup để kiểm tra chuỗi date/time hợp lệ
const dateTimeField = Yup.string()
    .required('Trường này là bắt buộc')
    .test('is-valid-datetime', 'Định dạng ngày giờ không hợp lệ (dd/MM/yyyy HH:mm)', (value) => {
        if (!value) return false;
        const parsed = parseDateTime(value);
        return !!parsed; // true nếu parse được, false nếu ko
    });

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

    // Sử dụng kiểu string + custom validation
    auctionStartTime: dateTimeField,
    auctionEndTime: dateTimeField,

    imageFiles: Yup.array().min(1, 'Ít nhất một ảnh sản phẩm là bắt buộc')
});

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                console.log('Categories fetched:', data);
                setCategories(data);
            } catch (error) {
                console.error('Lỗi khi tải danh mục:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleImageFilesChange = (event, setFieldValue) => {
        const files = Array.from(event.currentTarget.files);
        setFieldValue('imageFiles', files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
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
                    // Lưu chuỗi date/time
                    auctionStartTime: '',
                    auctionEndTime: '',
                    imageFiles: []
                }}
                validationSchema={ProductSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                        // Parse chuỗi theo định dạng 'dd/MM/yyyy HH:mm'
                        const startDateObj = parseDateTime(values.auctionStartTime);
                        const endDateObj = parseDateTime(values.auctionEndTime);

                        // Định dạng lại theo mẫu ISO không chứa offset
                        const startFormatted = format(startDateObj, "yyyy-MM-dd'T'HH:mm:ss");
                        const endFormatted = format(endDateObj, "yyyy-MM-dd'T'HH:mm:ss");

                        const formData = new FormData();
                        formData.append('name', values.name);
                        formData.append('categoryId', Number(values.categoryId));
                        formData.append('description', values.description);
                        formData.append('basePrice', values.basePrice);
                        formData.append('bidStep', values.bidStep);
                        // Gửi chuỗi đã định dạng
                        formData.append('auctionStartTime', startFormatted);
                        formData.append('auctionEndTime', endFormatted);

                        values.imageFiles.forEach((file) => formData.append('imageFiles', file));

                        await productService.createProduct(formData);
                        toast.success('🎉 Thêm sản phẩm thành công!');
                        resetForm();
                        setImagePreviews([]);
                        setTimeout(() => navigate('/'), 2000);
                    } catch (error) {
                        console.error('Lỗi khi thêm sản phẩm:', error);
                        toast.error('❌ Lỗi khi thêm sản phẩm!');
                    } finally {
                        setSubmitting(false);
                    }
                }}

            >
                {({ isSubmitting, setFieldValue, handleSubmit, values }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Tên sản phẩm:</Form.Label>
                            <Field
                                name="name"
                                as={Form.Control}
                                type="text"
                                placeholder="Nhập tên sản phẩm"
                            />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Mô tả:</Form.Label>
                            <Field
                                as="textarea"
                                name="description"
                                className="form-control"
                                placeholder="Nhập mô tả sản phẩm"
                                maxLength={300}
                            />
                            <ErrorMessage name="description" component="div" className="text-danger" />
                            <div className="text-muted">{values.description.length}/300 ký tự</div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCategory">
                            <Form.Label>Danh mục:</Form.Label>
                            <Field
                                as={Form.Select}
                                name="categoryId"
                                onChange={(e) => setFieldValue('categoryId', e.target.value)}
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

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBasePrice">
                                    <Form.Label>Giá khởi điểm:</Form.Label>
                                    <Field
                                        name="basePrice"
                                        as={Form.Control}
                                        type="number"
                                        placeholder="Nhập giá khởi điểm"
                                    />
                                    <ErrorMessage name="basePrice" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBidStep">
                                    <Form.Label>Bước giá:</Form.Label>
                                    <Field
                                        name="bidStep"
                                        as={Form.Control}
                                        type="number"
                                        placeholder="Nhập bước giá"
                                    />
                                    <ErrorMessage name="bidStep" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formAuctionStartTime">
                                    <Form.Label>Thời gian bắt đầu đấu giá (dd/MM/yyyy HH:mm):</Form.Label>
                                    {/* Input text thay vì datetime-local */}
                                    <Field
                                        name="auctionStartTime"
                                        as={Form.Control}
                                        type="text"
                                        placeholder="Ví dụ: 31/12/2025 13:45"
                                    />
                                    <ErrorMessage name="auctionStartTime" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formAuctionEndTime">
                                    <Form.Label>Thời gian kết thúc đấu giá (dd/MM/yyyy HH:mm):</Form.Label>
                                    <Field
                                        name="auctionEndTime"
                                        as={Form.Control}
                                        type="text"
                                        placeholder="Ví dụ: 01/01/2026 08:00"
                                    />
                                    <ErrorMessage name="auctionEndTime" component="div" className="text-danger" />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="formImageFiles">
                            <Form.Label>Ảnh sản phẩm:</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.currentTarget.files);
                                    setFieldValue('imageFiles', files);
                                    const previews = files.map((file) => URL.createObjectURL(file));
                                    setImagePreviews(previews);
                                }}
                            />
                            <div className="d-flex flex-wrap gap-2 mt-2">
                                {imagePreviews.map((src, index) => (
                                    <Image
                                        key={index}
                                        src={src}
                                        alt={`Ảnh ${index}`}
                                        thumbnail
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                ))}
                            </div>
                            <ErrorMessage name="imageFiles" component="div" className="text-danger" />
                        </Form.Group>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#965E00', borderColor: '#965E00' }}
                        >
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

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import '../../styles/review.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewModal = ({ show, bidId, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        onSubmit({ bidId, rating, comment });
    };

    toast.success('Đánh giá thành công!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Đánh giá sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                            key={star}
                            variant="link"
                            onClick={() => setRating(star)}
                            className="star-button"
                        >
                            {star <= rating ? (
                                <StarFill className="star-icon filled" style={{ display: 'block' }} />
                            ) : (
                                <Star className="star-icon" style={{ display: 'block' }} />
                            )}
                        </Button>
                    ))}
                </div>
                <div className="mt-3">
          <textarea
              className="form-control"
              placeholder="Nhập bình luận..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
          />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Hủy
                </Button>
                <Button className="btn-submit-review" onClick={handleSubmit}>
                    Gửi đánh giá
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReviewModal;
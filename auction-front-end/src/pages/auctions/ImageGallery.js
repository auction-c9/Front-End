import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css"; // Đảm bảo đã import bootstrap
import "../../styles/AuctionDetailPage.css"; // Chứa CSS tùy biến

function ImageGallery({ images, productName }) {
    // State slideIndex để điều khiển Carousel
    const [slideIndex, setSlideIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <img
                className="d-block w-100"
                src="https://placehold.co/400x300?text=No%20Image"
                alt={productName || "No Image"}
                style={{
                    maxHeight: "400px",
                    objectFit: "contain",
                }}
            />
        );
    }

    const handleSelect = (selectedIndex) => {
        setSlideIndex(selectedIndex);
    };

    // Khi click thumbnail, chuyển slide
    const goToSlide = (index) => {
        setSlideIndex(index);
    };

    return (
        <div className="auction-images" style={{display: "flex", flexDirection: "column"}}>
            {/* Carousel */}
            <div className="carousel-container">
                <Carousel activeIndex={slideIndex} onSelect={handleSelect} interval={null}>
                    {images.map((img, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={img.imageUrl}
                                alt={`${productName} ${index + 1}`}
                                style={{
                                    maxHeight: "400px",
                                    objectFit: "contain",
                                    backgroundColor: "#fff",
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            {/* Thumbnail ở dưới: sắp xếp theo hàng ngang */}
            <div
                className="thumbnail-list"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "nowrap",        // Không cho phép xuống hàng
                    overflowX: "auto",         // Thanh cuộn ngang
                    whiteSpace: "nowrap",      // Tránh xuống dòng
                    gap: "0.5rem",
                    marginTop: "0.5rem"
                }}
            >
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="thumbnail-item"
                        onClick={() => goToSlide(index)}
                        style={{
                            cursor: "pointer",
                            border: slideIndex === index ? "2px solid #007bff" : "2px solid transparent",
                            flex: "0 0 auto" // Đảm bảo mỗi thumbnail không co giãn
                        }}
                    >
                        <img
                            src={img.imageUrl}
                            alt={`${productName} thumbnail ${index + 1}`}
                            style={{width: "100px", height: "70px", objectFit: "cover"}}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
}

export default ImageGallery;

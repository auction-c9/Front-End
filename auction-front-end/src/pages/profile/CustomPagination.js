import React from 'react';
import { Pagination } from 'react-bootstrap';

const CustomPagination = ({
                              currentPage,
                              totalPages,
                              onPageChange,
                              maxVisiblePages = 5
                          }) => {
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            onPageChange(pageNumber);
        }
    };

    let items = [];
    // Tính toán trang bắt đầu và trang kết thúc để hiển thị
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Điều chỉnh lại startPage, endPage nếu tổng số trang lớn hơn maxVisiblePages
    if (totalPages > maxVisiblePages) {
        if (endPage === totalPages - 1) {
            startPage = totalPages - maxVisiblePages;
        } else if (startPage === 0) {
            endPage = maxVisiblePages - 1;
        }
    }

    // Tạo danh sách các nút trang
    for (let number = startPage; number <= endPage; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
            >
                {number + 1}
            </Pagination.Item>
        );
    }

    return (
        <Pagination className="justify-content-center mt-4">
            {/* Nút "Đầu" chỉ hiển thị khi currentPage > 0 */}
            {currentPage > 0 && (
                <Pagination.Item onClick={() => handlePageChange(0)}>
                    Đầu
                </Pagination.Item>
            )}

            <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
            />

            {items}

            <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
            />

            {/* Nút "Cuối" chỉ hiển thị khi currentPage < totalPages - 1 */}
            {currentPage < totalPages - 1 && (
                <Pagination.Item onClick={() => handlePageChange(totalPages - 1)}>
                    Cuối
                </Pagination.Item>
            )}
        </Pagination>
    );
};

export default CustomPagination;

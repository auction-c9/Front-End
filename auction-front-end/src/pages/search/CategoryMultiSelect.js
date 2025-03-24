import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryMultiSelect = ({ categories, selectedCategories, setSelectedCategories }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = (isOpen, event, metadata) => {
        setOpen(isOpen);
    };

    const handleCategoryChange = (catId) => {
        let newSelectedCategories;
        if (selectedCategories.includes(catId)) {
            newSelectedCategories = selectedCategories.filter(id => id !== catId);
        } else {
            newSelectedCategories = [...selectedCategories, catId];
        }
        // Log dữ liệu danh mục được chọn
        console.log('Updated selectedCategories:', newSelectedCategories);
        newSelectedCategories.forEach(id => console.log(`Type of ${id}:`, typeof id));
        setSelectedCategories(newSelectedCategories);
    };


    // Hiển thị tên danh mục đã chọn (nếu có)
    const renderTitle = () => {
        if (selectedCategories.length === 0) return 'Chọn danh mục';
        const selectedNames = categories
            .filter(cat => selectedCategories.includes(cat.categoryId))
            .map(cat => cat.name)
            .join(', ');
        return selectedNames;
    };

    return (
        <Dropdown show={open} onToggle={toggleOpen} autoClose="outside">
            {/* Sử dụng inline style để giới hạn hiển thị văn bản */}
            <Dropdown.Toggle
                as="button"
                className="form-select text-start"
                style={{
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
                title={renderTitle()}  // hiển thị tooltip khi hover
            >
                {renderTitle()}
            </Dropdown.Toggle>

            <Dropdown.Menu style={{ width: '100%' }}>
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <Dropdown.Item as="div" key={cat.categoryId}>
                            <Form.Check
                                type="checkbox"
                                label={cat.name}
                                checked={selectedCategories.includes(cat.categoryId)}
                                onChange={() => handleCategoryChange(cat.categoryId)}
                            />
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item as="div" disabled>Đang tải danh mục...</Dropdown.Item>
                )}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default CategoryMultiSelect;

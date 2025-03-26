import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/apiConfig';
import CategoryMultiSelect from './CategoryMultiSelect';

const SearchBar = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        api.get('/categories')
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.error('Error fetching categories:', err);
            });
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (query.trim() !== '') params.append('query', query.trim());
        if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
        if (selectedPrice) params.append('price', selectedPrice);
        if (selectedStatus) params.append('status', selectedStatus);
        console.log('Search parameters:', { query, selectedCategories, price: selectedPrice, status: selectedStatus });
        navigate(`/auctions?${params.toString()}`);
    };

    return (
        <div className="search-bar container my-4" >
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                {/* Ô tìm kiếm */}
                <input
                    type="text"
                    className="form-control flex-grow-1"
                    placeholder="Tìm kiếm"
                    style={{ minWidth: '200px', maxWidth: '250px', fontSize: '14px' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Danh mục */}
                <div className="flex-grow-1" style={{ minWidth: '200px', maxWidth: '250px' }}>
                    <CategoryMultiSelect
                        categories={categories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                    />
                </div>

                {/* Mức giá */}
                <select
                    className="form-select flex-grow-1"
                    style={{ minWidth: '150px', maxWidth: '200px' }}
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                >
                    <option value="">Mức giá</option>
                    <option value="1">Dưới 1 triệu</option>
                    <option value="2">1 - 3 triệu</option>
                    <option value="3">3 - 5 triệu</option>
                    <option value="4">Trên 5 triệu</option>
                </select>

                {/* Trạng thái */}
                <select
                    className="form-select flex-grow-1"
                    style={{ minWidth: '150px', maxWidth: '200px' }}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="">Trạng thái</option>
                    <option value="upcoming">Sắp Diễn ra</option>
                    <option value="ongoing">Đang Diễn ra</option>
                    <option value="ending">Sắp kết thúc</option>
                </select>

                {/* Nút tìm kiếm */}
                <button
                    className="btn"
                    style={{ backgroundColor: '#CC8400', color: '#fff', minWidth: '120px' }}
                    onClick={handleSearch}
                >
                    Tìm Kiếm
                </button>
            </div>
        </div>
    );
};

export default SearchBar;

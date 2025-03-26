import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../config/apiConfig';
import CategoryMultiSelect from './CategoryMultiSelect'; // file ở trên

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

        if (query.trim() !== '') {
            params.append('query', query.trim());
        }
        if (selectedCategories.length > 0) {
            params.append('categories', selectedCategories.join(','));
        }
        if (selectedPrice) {
            params.append('price', selectedPrice);
        }
        if (selectedStatus) {
            params.append('status', selectedStatus);
        }
        console.log('Search parameters:', {
            query: query.trim(),
            categories: selectedCategories,
            price: selectedPrice,
            status: selectedStatus,
        });
        navigate(`/auctions?${params.toString()}`);
    };

    return (
        <div className="search-bar container my-4">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="btn"
                    style={{ backgroundColor: '#CC8400', color: '#fff' }}
                    onClick={handleSearch}
                >
                    Tìm Kiếm
                </button>
            </div>

            <div className="row">
                {/* Danh mục */}
                <div className="col-md-4 mb-2">
                    <CategoryMultiSelect
                        categories={categories}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                    />
                </div>

                {/* Mức giá */}
                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={selectedPrice}
                        onChange={(e) => setSelectedPrice(e.target.value)}
                    >
                        <option value="">Mức giá</option>
                        <option value="1">Dưới 1 triệu</option>
                        <option value="2">1 - 3 triệu</option>
                        <option value="3">3 - 5 triệu</option>
                        <option value="4">Trên 5 triệu</option>
                    </select>
                </div>

                {/* Trạng thái */}
                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">Trạng thái</option>
                        <option value="upcoming">Sắp Diễn ra</option>
                        <option value="ongoing">Đang Diễn ra</option>
                        <option value="ending">Sắp kết thúc</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
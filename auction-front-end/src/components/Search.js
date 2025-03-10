// src/components/Search.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductList from './ProductList';

const Search = () => {
    return (
        <div>
            <Header />
            <div
                className="content-wrapper"
                style={{ display: 'flex', gap: '20px', padding: '20px' }}
            >
                <Sidebar />
                <main
                    style={{
                        flex: 1,
                        border: '1px solid #ddd',
                        padding: '10px',
                        background: '#fff',
                    }}
                >
                    <ProductList />
                </main>
            </div>
        </div>
    );
};

export default Search;

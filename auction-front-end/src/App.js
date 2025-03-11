// src/App.js
import React from 'react';
import './styles/main.css'; // <--- Import CSS
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import AddProduct from './pages/AddProduct';
import AuctionListPage from './pages/auctions/AuctionListPage';
import AuctionDetailPage from './pages/auctions/AuctionDetailPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/auctoins" element={<AuctionListPage />} />
                <Route path="/auction/:id" element={<AuctionDetailPage />} />
                {/* Các route khác nếu cần */}
            </Routes>
        </Router>
    );
};

export default App;

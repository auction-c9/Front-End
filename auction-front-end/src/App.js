// src/App.js
import React from 'react';
import './styles/main.css'; // <--- Import CSS
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuctionList from "./pages/AuctionList";
import AddProduct from './pages/AddProduct';

import AuctionDetailPage from './pages/auctions/AuctionDetailPage';
import Login from "./pages/login/Login";
import { AuthProvider } from './context/AuthContext';
import TestProduct from "./pages/Test";

const App = () => {
    return (
        <Router>
            <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auctions" element={<AuctionList />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/auction/:id" element={<AuctionDetailPage />} />
                <Route path="/login" element={<Login />} />

                {/* Các route khác nếu cần */}
            </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;

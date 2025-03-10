// src/App.js
import React from 'react';
import './styles/main.css'; // <--- Import CSS
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Search from './components/Search';
import AddProduct from './components/AddProduct';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/add-product" element={<AddProduct />} />
                {/* Các route khác nếu cần */}
            </Routes>
        </Router>
    );
};

export default App;

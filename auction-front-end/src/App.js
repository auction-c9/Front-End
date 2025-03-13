import React from 'react';
import './styles/main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AuctionList from "./pages/AuctionList";
import AddProduct from './pages/AddProduct';
import AuctionDetailPage from './pages/auctions/AuctionDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/login/Login";
import { AuthProvider } from './context/AuthContext';
import Profile from "./pages/profile/Profile";
import Logout from "./pages/auth/Logout";
import Register from "./pages/login/Register";



const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auctions" element={<AuctionList />} />
                    <Route path="/product/add" element={<AddProduct />} />
                    <Route path="/auction/:id" element={<AuctionDetailPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/profile" element={<Profile />} />

                    {/*<Route path="/register-question" element={ } />*/}
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;

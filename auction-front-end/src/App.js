import React, {useEffect, useState} from 'react';
import './styles/main.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import AuctionList from "./pages/AuctionList";
import AddProduct from './pages/AddProduct';
import AuctionDetailPage from './pages/auctions/AuctionDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LiveAuctions from "./pages/LiveAuctions";
import UpcomingAuctions from "./pages/UpcomingAuctions";
import EndedAuctions from "./pages/EndedAuctions";

import Login from "./pages/login/Login";
import {AuthProvider} from './context/AuthContext';
import Logout from "./pages/auth/Logout";
import Register from "./pages/login/Register";
import ForgotPasswordStep3 from "./pages/login/ForgotPasswordStep3";
import ForgotPasswordStep2 from "./pages/login/ForgotPasswordStep2";
import ForgotPasswordStep1 from "./pages/login/ForgotPasswordStep1";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisteredAuctionsHistory from "./pages/auctions/RegisteredAuctionsHistory";
import AdminRoutes from "./pages/admin/AdminRoutes";
import Header from "./pages/Header";
import Footer from "./pages/Footer";

const App = () => {
    useEffect(() => {
        localStorage.removeItem('refreshToken');
    }, []);

    return (
        <Router>
            <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/auctions" element={<AuctionList/>}/>
                    <Route path="/product/add" element={<AddProduct/>}/>
                    <Route path="/auction/:id" element={<AuctionDetailPage/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/logout" element={<Logout/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/forgot-password" element={<ForgotPasswordStep1/>}/>
                    <Route path="/forgot-password/step2" element={<ForgotPasswordStep2/>}/>
                    <Route path="/forgot-password/step3" element={<ForgotPasswordStep3/>}/>
                    <Route path="/auctions/live" element={<LiveAuctions />} />
                    <Route path="/auctions/upcoming" element={<UpcomingAuctions />} />
                    <Route path="/auctions/ended" element={<EndedAuctions />} />
                </Routes>
                <Footer/>
            </AuthProvider>
        </Router>
    );
};

export default App;

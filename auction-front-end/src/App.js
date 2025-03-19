import React, {useEffect, useState} from 'react';
import './styles/main.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import AuctionList from "./pages/AuctionList";
import AddProduct from './pages/AddProduct';
import AuctionDetailPage from './pages/auctions/AuctionDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./pages/login/Login";
import {AuthProvider, useAuth} from './context/AuthContext';
import Profile from "./pages/profile/Profile";
import Logout from "./pages/auth/Logout";
import Register from "./pages/login/Register";
import ForgotPasswordStep3 from "./pages/login/ForgotPasswordStep3";
import ForgotPasswordStep2 from "./pages/login/ForgotPasswordStep2";
import ForgotPasswordStep1 from "./pages/login/ForgotPasswordStep1";
import ChatBox from "./pages/chat/ChatBox";
import ProfilePage from "./pages/profile/ProfilePage";
import RegisteredAuctionsHistory from "./pages/auctions/RegisteredAuctionsHistory";
import AdminCustomerList from "./pages/admin/AdminCustomerList";
import AdminDashboard from "./pages/admin/AdminDashboard";

const AdminRoutes = () => {
    const { user } = useAuth();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        if (user) {
            setIsAuthChecked(true);
        }
    }, [user]);

    if (!isAuthChecked) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== "ROLE_ADMIN") {
        return <Navigate to="/" />;
    }

    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/customers" element={<AdminCustomerList />} />
        </Routes>
    );
};

const App = () => {
    useEffect(() => {
        localStorage.removeItem('refreshToken');
    }, []);

    return (
        <Router>
            <AuthProvider>
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
                    <Route path="/auction-register" element={<RegisteredAuctionsHistory/>}/>
                    <Route path="/admin/*" element={<AdminRoutes />} />
                </Routes>
                <ChatBox/>
            </AuthProvider>
        </Router>
    );
};

export default App;

import React, {useEffect} from 'react';
import './styles/main.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import AuctionList from "./pages/AuctionList";
import AddProduct from './pages/AddProduct';
import AuctionDetailPage from './pages/auctions/AuctionDetailPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import LiveAuctions from "./pages/LiveAuctions";
import UpcomingAuctions from "./pages/UpcomingAuctions";
import EndedAuctions from "./pages/EndedAuctions";
import Header from "./pages/Header";
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
import Footer from "./pages/Footer";
import PrivacyPolicy from "./pages/auth/PrivacyPolicy";
import About from "./pages/auth/About";
import TermOfService from "./pages/auth/TermOfService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
    useEffect(() => {
        localStorage.removeItem('refreshToken');
    }, []);

    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <AuthProvider>
                <div className="app-container">
                    <Header/>
                    <div className="content-container">
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
                            <Route path="/auctions/live" element={<LiveAuctions/>}/>
                            <Route path="/auctions/upcoming" element={<UpcomingAuctions/>}/>
                            <Route path="/auctions/ended" element={<EndedAuctions/>}/>
                            <Route path="/admin/*" element={<AdminRoutes/>}/>
                            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                            <Route path="/about" element={<About/>}/>
                            <Route path="/terms" element={<TermOfService/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </AuthProvider>
        </Router>
    );
};

export default App;

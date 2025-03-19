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
import Header from "./pages/Header";
import Login from "./pages/login/Login";
import {AuthProvider} from './context/AuthContext';
import Logout from "./pages/auth/Logout";
import Register from "./pages/login/Register";
import ForgotPasswordStep3 from "./pages/login/ForgotPasswordStep3";
import ForgotPasswordStep2 from "./pages/login/ForgotPasswordStep2";
import ForgotPasswordStep1 from "./pages/login/ForgotPasswordStep1";
import ProfilePage from "./pages/profile/ProfilePage";
import {useAuth} from './context/AuthContext';
import AdminCustomerList from "./pages/admin/AdminCustomerList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Footer from "./pages/Footer";

const AdminRoutes = () => {
    const {user} = useAuth();
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
        return <Navigate to="/login"/>;
    }

    if (user.role !== "ROLE_ADMIN") {
        return <Navigate to="/"/>;
    }

    return (
        <Routes>
            <Route path="/" element={<AdminDashboard/>}/>
            <Route path="/customers" element={<AdminCustomerList/>}/>
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
                    <Route path="/auctions/live" element={<LiveAuctions/>}/>
                    <Route path="/auctions/upcoming" element={<UpcomingAuctions/>}/>
                    <Route path="/auctions/ended" element={<EndedAuctions/>}/>
                    <Route path="/admin/*" element={<AdminRoutes/>}/>
                </Routes>

            </AuthProvider>
            <Footer />
        </Router>
    );
};

export default App;

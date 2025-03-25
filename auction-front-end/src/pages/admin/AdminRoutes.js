import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminCustomerList from './AdminCustomerList';
import { useAuth } from '../../context/AuthContext';
import AdminProductList from "./AdminProductList";
import AdminTransactionList from "./AdminTransactionList";

const AdminRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/customers" element={<AdminCustomerList />} />
            <Route path="/products" element={<AdminProductList />} />
            <Route path="/transactions" element={<AdminTransactionList />} />
        </Routes>
    );
};

export default AdminRoutes;

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminCustomerList from './AdminCustomerList';
import { useAuth } from '../../context/AuthContext';

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

export default AdminRoutes;

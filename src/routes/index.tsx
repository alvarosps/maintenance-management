import React from 'react';
import { Routes, Route } from 'react-router-dom';
const Dashboard = React.lazy(() => import('../pages/Dashboard/Dashboard'));
const UsersManagement = React.lazy(() => import('../pages/UsersManagement/UsersManagement'));
const UnitManagement = React.lazy(() => import('../pages/UnitManagement/UnitManagement'));
const CompanyManagement = React.lazy(() => import('../pages/CompanyManagement/CompanyManagement'));
const WorkOrders = React.lazy(() => import('../pages/Workorders/Workorders'));

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workorders" element={<WorkOrders />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/units" element={<UnitManagement />} />
            <Route path="/companies" element={<CompanyManagement />} />
        </Routes>
    );
};

export default Router;

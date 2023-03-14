import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import UsersManagement from '../pages/UsersManagement/UsersManagement';
import UnitManagement from '../pages/UnitManagement/UnitManagement';
import CompanyManagement from '../pages/CompanyManagement/CompanyManagement';

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/units" element={<UnitManagement />} />
            <Route path="/companies" element={<CompanyManagement />} />
        </Routes>
    );
};

export default Router;

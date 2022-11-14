import React from 'react';
import { Routes, Route } from "react-router-dom";

import LandingPage from './components/landing_page/LandingPage';
import PageNotFound from './components/page_not_found/PageNotFound';

import AdminLogin from './components/admin/login/LoginAdmin';
import AdminDashboard from './components/admin/dashboard/AdminDasboard';
import AdminUsersList from './components/admin/users/AdminUsersList';
import AdminProductList from './components/admin/products/AdminProductList';
import AdminStockInList from './components/admin/stock_in/AdminStockInList';
import AdminStockOutList from './components/admin/stock_out/AdminStockOutList';

import UserLogin from './components/user/login/LoginUser';

class App extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        
        return (
            <div className="App">
                <Routes>
                    <Route path="*" element={<PageNotFound />} />
                    <Route path="" element={<LandingPage />} />
                    <Route path="web" element={<LandingPage />} />
                    <Route path="/web/login/admin" element={<AdminLogin />} />
                    <Route path="/web/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/web/admin/users" element={<AdminUsersList />} />
                    <Route path="/web/admin/products" element={<AdminProductList />} />
                    <Route path="/web/admin/stock-in" element={<AdminStockInList />} />
                    <Route path="/web/admin/stock-out" element={<AdminStockOutList />} />
                    <Route path="/web/login/cashier" element={<UserLogin />} />
                </Routes>
            </div>
        );
    }
}

export default App;

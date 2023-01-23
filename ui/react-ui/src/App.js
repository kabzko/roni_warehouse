import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import LandingPage from './components/landing_page/LandingPage';
import PageNotFound from './components/page_not_found/PageNotFound';
import Login from './components/login/Login';

import AdminDashboard from './components/admin/dashboard/AdminDasboard';
import AdminUsersList from './components/admin/users/AdminUsersList';
import AdminProductList from './components/admin/products/AdminProductList';
import AdminStockInList from './components/admin/stock_in/AdminStockInList';
import AdminStockOutList from './components/admin/stock_out/AdminStockOutList';
import AdminlistingList from './components/admin/listing/AdminListingList';
import AdminInvoiceList from './components/admin/invoice/AdminInvoiceList';
import AdminSalesChart from "./components/admin/sales/AdminSalesChart";
import AdminLeaderboardsList from './components/admin/leaderboards/AdminLeaderboardsList';
import AdminSupplierList from './components/admin/supplier/AdminSupplierList';
import AdminOthers from './components/admin/others/AdminOthers';

import UserDashboard from './components/user/dashboard/UserDashboard';

import "react-toastify/dist/ReactToastify.css";

class App extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        
        return (
            <div className="App">
                <ToastContainer 
                    position={"top-right"} 
                    autoClose={3000} 
                    pauseOnHover={false} 
                    theme={"colored"}
                />
                <Routes>
                    <Route path="*" element={<PageNotFound />} />
                    <Route path="" element={<LandingPage />} />
                    <Route path="web" element={<LandingPage />} />
                    <Route path="/web/login" element={<Login />} />

                    <Route path="/web/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/web/admin/users" element={<AdminUsersList />} />
                    <Route path="/web/admin/products" element={<AdminProductList />} />
                    <Route path="/web/admin/stock-in" element={<AdminStockInList />} />
                    <Route path="/web/admin/stock-out" element={<AdminStockOutList />} />
                    <Route path="/web/admin/listing" element={<AdminlistingList />} />
                    <Route path="/web/admin/invoice" element={<AdminInvoiceList />} />
                    <Route path="/web/admin/sales" element={<AdminSalesChart />} />
                    <Route path="/web/admin/leaderboards" element={<AdminLeaderboardsList />} />
                    <Route path="/web/admin/others" element={<AdminOthers />} />
                    <Route path="/web/admin/suppliers" element={<AdminSupplierList />} />
                    <Route path="/web/user/dashboard" element={<UserDashboard />} />
                </Routes>
            </div>
        );
    }
}

export default App;

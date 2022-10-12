import React from 'react';
import { Routes, Route } from "react-router-dom";

import LandingPage from './components/landing_page/LandingPage';
import AdminLogin from './components/login/LoginAdmin';
import AdminDashboard from './components/admin/dashboard/AdminDasboard';
import AdminUsersList from './components/admin/users/AdminUsersList';

class App extends React.Component {

    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="App">
                <Routes>
                    <Route path="" element={<LandingPage />} />
                    <Route path="web" element={<LandingPage />} />
                    <Route path="/web/login/admin" element={<AdminLogin />} />
                    <Route path="/web/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/web/admin/users" element={<AdminUsersList />} />
                </Routes>
            </div>
        );
    }
}

export default App;

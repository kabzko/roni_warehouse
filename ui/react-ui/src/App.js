import React from 'react';
import { Routes, Route } from "react-router-dom";

import LandingPage from './components/landing_page/LandingPage';
import Login from './components/login/Login';
import AdminDashboard from './components/dashboard/AdminDasboard';

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
                    <Route path="/web/login" element={<Login />} />
                    <Route path="/web/dashboard/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        );
    }
}

export default App;

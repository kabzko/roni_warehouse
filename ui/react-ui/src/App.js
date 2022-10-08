import React from 'react';
import { Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import Login from './components/Login';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            "greetings": "Hello World"
        }
    }

    render() {
        return (
            <div className="App">
                <Routes>
                    <Route path="web" element={<LandingPage />} />
                    <Route path="web/login" element={<Login />} />
                </Routes>
            </div>
        );
    }
}

export default App;

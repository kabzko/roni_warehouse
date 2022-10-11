import React from 'react';

import SideNav from '../common/SideNav';
import Header from '../common/Header';

class AdminDashboard extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Dashboard</h1>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminDashboard;
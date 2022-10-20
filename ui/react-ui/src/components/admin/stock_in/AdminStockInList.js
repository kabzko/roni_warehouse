import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';

class AdminStockInList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stockIn: [],
            search: "",
        };
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="stock-in"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Stock In</h1>
                                <button type="button" className="btn btn-dark">Create</button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminStockInList;
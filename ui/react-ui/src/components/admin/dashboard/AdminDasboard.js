import React from 'react';

import SideNav from '../common/SideNav';
import Header from '../common/Header';

import axios from '../../../utils/axios';
import Toast from "../../../utils/toast";

class AdminDashboard extends React.Component {
    constructor(props) {
        if (sessionStorage.getItem("user_type") !== "admin") {
            window.location.href = "/";
        }

        super(props);
        this.state = {
            products: [],
            search: "",
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
        this.getProducts();
    }

    getProducts() {
        let api_url = "/api/products/available-stocks/";
        let { search } = this.state;

        if (search !== "") {
            api_url += `?search=${search}`;
        }

        axios.get(api_url).then(res => {
            this.setState({"products": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    searchProducts(event) {
        event.preventDefault();
        this.getProducts();
    }

    handleSearchChange(event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.searchProducts(event);
            }
        } else {
            this.setState({"search": event.target.value});
        }
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="dashboard"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Dashboard</h1>
                            </div>
                            <div className='col-md-8 border shadow-sm p-3' style={{maxHeight: "500px", overflow: "auto"}}>
                                <div className='row'>
                                    <div className="col-sm-6">
                                        <h5>Available Stocks</h5>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div className="input-group mb-3 float-lg-end">
                                            <input type="text" className="form-control" placeholder="Search product..."
                                                onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                            <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.searchProducts} value={this.state.search}>Search</span>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Barcode</th>
                                                    <th scope="col">Unit of Measure</th>
                                                    <th scope="col">Available Stocks</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {this.state.products.length > 0
                                                ?  this.state.products.map(product => {
                                                        return(
                                                            <tr key={product.id + product.unit_of_measure}>
                                                                <td>{product.name}</td>
                                                                <td>{product.barcode}</td>
                                                                <td>{product.unit_of_measure}</td>
                                                                <td>{product.available_stocks}</td>
                                                            </tr>
                                                        )
                                                    })
                                                : <tr><td colSpan="1000" className="text-center">No products yet!</td></tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminDashboard;
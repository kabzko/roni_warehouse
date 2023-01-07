import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateViewInvoiceDialog from "././UpdateViewInvoiceDialog";

import axios from '../../../utils/axios';
import Toast from "../../../utils/toast";

class AdminInvoiceList extends React.Component {
    constructor(props) {
        if (!(sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "pointOfSale")) {
            window.location.href = "/";
        }
        
        super(props);
        this.state = {
            products: [],
            invoices: [],
            users: [],
            search: "",
        };

        this.callBackSaveListing = this.callBackSaveListing.bind(this);
        this.filterWithSearch = this.filterWithSearch.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);

        this.getUsers();
        this.getProducts();
        this.getInvoices();
    }

    callBackSaveListing() {
        this.getInvoices();
    }

    getUserName(userId) {
        let user;

        for (let i in this.state.users) {
            if (this.state.users[i].id === userId) {
                user = `${this.state.users[i].last_name}, ${this.state.users[i].first_name}`;
                break;
            }
        }

        return user;
    }

    getInvoices() {
        let api_url = "/api/invoice/";
        let { search } = this.state;

        if (search !== "") {
            api_url += `?search=${search}`;
        }

        axios.get(api_url).then(res => {
            res.data.map(data => {

                if (data.sales.created_at) {
                    data.sales.created_at = new Date(data.sales.created_at).toLocaleString()
                }

                if (data.sales.updated_at) {
                    data.sales.updated_at = new Date(data.sales.updated_at).toLocaleString()
                }
                
                return data;
            })
            this.setState({"invoices": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    getProducts() {
        axios.get("/api/products/").then(res => {
            this.setState({"products": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    getUsers() {
        let api_url = "/api/users/";

        axios.get(api_url).then(res => {
            this.setState({"users": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    priceFormat(value) {
        const val = (value/1).toFixed(2).replace(",", ".")
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    filterWithSearch(event) {
        event.preventDefault();
        this.getInvoices();
    }

    handleSearchChange(event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.filterWithSearch(event);
            }
        } else {
            this.setState({"search": event.target.value});
        }
    }

    showUpdateViewInvoiceModal(invoice) {
        invoice["callBackSave"] = this.callBackSaveListing;
        invoice["users"] = this.state.users;
        invoice["products"] = this.state.products;
        UpdateViewInvoiceDialog.show({...invoice});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="invoice"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Invoices</h1>
                            </div>
                            <div className="input-group mb-3 w-50 float-lg-end">
                                <input type="text" className="form-control" placeholder="Search reference no..."
                                    onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.filterWithSearch} value={this.state.search}>Search</span>
                            </div>
                            <div className="clearfix"></div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Reference No.</th>
                                            <th scope="col">Cashier</th>
                                            <th scope="col">Payment Type</th>
                                            <th scope="col">Total Amount</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Last changes</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.invoices.length > 0
                                        ?  this.state.invoices.map(element => {
                                                return(
                                                    <tr key={element.sales.id}>
                                                        <td>{element.sales.reference_no}</td>
                                                        <td>{this.getUserName(element.sales.cashier_by)}</td>
                                                        <td>{element.sales.payment_type}</td>
                                                        <td>{this.priceFormat(element.sales.total_amount)}</td>
                                                        <td>{element.sales.created_at}</td>
                                                        <td>{element.sales.updated_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-success me-1" onClick={this.showUpdateViewInvoiceModal.bind(this, element)}>View</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        : <tr><td colSpan="1000" className="text-center">No transaction yet!</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminInvoiceList;
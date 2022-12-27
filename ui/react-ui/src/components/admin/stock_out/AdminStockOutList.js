import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateStockOutDialog from "./updateCreateStockOutDialog";

import axios from '../../../utils/axios';
import ConfirmDialog from "../../../utils/dialog";
import Toast from "../../../utils/toast";

class AdminStockOutList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            stockOut: [],
            stockIn: [],
            productFilter: "",
        };

        this.callBackSaveStockOut = this.callBackSaveStockOut.bind(this);
        this.filterWithProduct = this.filterWithProduct.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        
        this.getStockOut();
        this.getProducts();
        this.getStockIn();
    }

    callBackSaveStockOut() {
        this.getStockOut();
    }

    deleteStockOut(stockOut, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of Stock Out",
            text: "Are you sure you want to delete this?",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/stock-out/${stockOut.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getStockOut();
                }).catch(error => {
                    Toast.error(error.response.data.message)
                })
            }
        })
    }

    getProductName(productId) {
        let product;

        for (let i in this.state.products) {
            if (this.state.products[i].id === productId) {
                product = this.state.products[i].name;
                break;
            }
        }

        return product;
    }

    getStockIn() {
        let api_url = "/api/stock-in/list/";

        axios.get(api_url).then(res => {
            res.data.map(data => {
                if (data.created_at) {
                    data.created_at = new Date(data.created_at).toLocaleString()
                }

                if (data.updated_at) {
                    data.updated_at = new Date(data.updated_at).toLocaleString()
                }
                
                return data;
            })

            this.setState({"stockIn": res.data});
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

    getStockOut() {
        let api_url = "/api/stock-out/";
        let { productFilter } = this.state;

        if (productFilter !== "") {
            api_url += `?product=${productFilter}`;
        }

        axios.get(api_url).then(res => {
            res.data.map(data => {
                if (data.created_at) {
                    data.created_at = new Date(data.created_at).toLocaleString()
                }

                if (data.updated_at) {
                    data.updated_at = new Date(data.updated_at).toLocaleString()
                }
                
                return data;
            })

            this.setState({"stockOut": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    filterWithProduct(event) {
        event.preventDefault();
        this.getStockOut();
    }

    handleSearchChange(event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.filterWithProduct(event);
            }
        } else {
            this.setState({"productFilter": event.target.value});
        }
    }

    showCreateUpdateStockOutModal(stockOut) {
        stockOut = stockOut ? stockOut : {};
        stockOut["callBackSave"] = this.callBackSaveStockOut;
        stockOut["products"] = this.state.products;
        stockOut["stockInOptions"] = this.state.stockIn;

        UpdateCreateStockOutDialog.show({...stockOut});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="stock-out"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Stock Out</h1>
                                <button type="button" className="btn btn-dark" onClick={this.showCreateUpdateStockOutModal.bind(this)}>Create</button>
                            </div>
                            <div className="input-group mb-3 w-50 float-lg-end">
                                <input type="text" className="form-control" placeholder="Search product..."
                                    onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.filterWithProduct} value={this.state.search}>Search</span>
                            </div>
                            <div className="clearfix"></div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Product</th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Delivered to</th>
                                            <th scope="col">Truck driver</th>
                                            <th scope="col">Received by</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.stockOut.length > 0
                                        ?  this.state.stockOut.map(stockOut => {
                                                return(
                                                    <tr key={stockOut.id}>
                                                        <td>{this.getProductName(stockOut.product)}</td>
                                                        <td>{stockOut.date}</td>
                                                        <td>{stockOut.quantity}</td>
                                                        <td>{stockOut.delivered_to}</td>
                                                        <td>{stockOut.truck_driver}</td>
                                                        <td>{stockOut.received_by}</td>
                                                        <td>{stockOut.created_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateStockOutModal.bind(this, stockOut)}>Edit</button>
                                                            <button className="btn btn-sm btn-danger" onClick={this.deleteStockOut.bind(this, stockOut)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        : <tr><td colSpan="1000" className="text-center">No transactions yet!</td></tr>
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

export default AdminStockOutList;
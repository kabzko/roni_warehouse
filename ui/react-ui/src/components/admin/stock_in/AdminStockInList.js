import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateStockInDialog from "./UpdateCreateStockInDialog";

import axios from '../../../utils/axios';
import ConfirmDialog from "../../../utils/dialog";
import Toast from "../../../utils/toast";

class AdminStockInList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            stockIn: [],
            productFilter: "",
        };

        this.callBackSaveStockIn = this.callBackSaveStockIn.bind(this);
        this.filterWithProduct = this.filterWithProduct.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.getStockIn();
        this.getProducts();
    }

    callBackSaveStockIn() {
        this.getStockIn();
    }

    deleteStockIn(stockIn, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of Stock In",
            text: "Are you sure you want to delete this?",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/stock-in/${stockIn.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getStockIn();
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

    getProducts() {
        axios.get("/api/products/").then(res => {
            this.setState({"products": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    getStockIn() {
        let api_url = "/api/stock-in/";
        let { productFilter } = this.state;

        if (productFilter !== "") {
            api_url += `?product=${productFilter}`;
        }

        axios.get(api_url).then(res => {
            res.data.map(data => {
                if (data.created_at) {
                    data.created_at = new Date(data.created_at).toLocaleDateString()
                }

                if (data.updated_at) {
                    data.updated_at = new Date(data.updated_at).toLocaleDateString()
                }
                
                return data;
            })

            this.setState({"stockIn": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    filterWithProduct(event) {
        event.preventDefault();
        this.getStockIn();
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

    showCreateUpdateStockInModal(stockIn) {
        stockIn = stockIn ? stockIn : {};
        stockIn["callBackSave"] = this.callBackSaveStockIn;
        stockIn["products"] = this.state.products;

        UpdateCreateStockInDialog.show({...stockIn});
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
                                <button type="button" className="btn btn-dark" onClick={this.showCreateUpdateStockInModal.bind(this)}>Create</button>
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
                                            <th scope="col">Supplier name</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Unit of measure</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Number of pieces</th>
                                            <th scope="col">Received by</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.stockIn.length > 0
                                        ?  this.state.stockIn.map(stockin => {
                                                return(
                                                    <tr key={stockin.id}>
                                                        <td>{this.getProductName(stockin.product)}</td>
                                                        <td>{stockin.date}</td>
                                                        <td>{stockin.supplier_name}</td>
                                                        <td>{stockin.price}</td>
                                                        <td>{stockin.unit_of_measure}</td>
                                                        <td>{stockin.quantity}</td>
                                                        <td>{stockin.number_of_pieces}</td>
                                                        <td>{stockin.received_by}</td>
                                                        <td>{stockin.created_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateStockInModal.bind(this, stockin)}>Edit</button>
                                                            <button className="btn btn-sm btn-danger" onClick={this.deleteStockIn.bind(this, stockin)}>Delete</button>
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

export default AdminStockInList;
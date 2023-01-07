import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateListingDialog from "././UpdateCreateListingDialog";

import axios from '../../../utils/axios';
import ConfirmDialog from "../../../utils/dialog";
import Toast from "../../../utils/toast";

class AdminListingList extends React.Component {
    constructor(props) {
        if (!(sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "pointOfSale")) {
            window.location.href = "/";
        }
        
        super(props);
        this.state = {
            products: [],
            listing: [],
            stockOut: [],
            stockIn: [],
            users: [],
            productFilter: "",
        };

        this.callBackSaveListing = this.callBackSaveListing.bind(this);
        this.filterWithProduct = this.filterWithProduct.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        
        this.getUsers();
        this.getListing();
        this.getProducts();
        this.getstockOut();
        this.getStockIn();
    }

    callBackSaveListing() {
        this.getListing();
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

    getUserName(userId) {
        let user;

        for (let i in this.state.users) {
            if (this.state.users[i].id === userId) {
                user = `${this.state.users[i].last_name}, ${this.state.users[i].first_name}`;
                break;
            } else {
                user = "Superadmin";
            }
        }

        return user;
    }

    deleteListing(listing, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of Stock Out",
            text: "Are you sure you want to delete this?",
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/listing/${listing.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getListing();
                }).catch(error => {
                    Toast.error(error.response.data.message)
                })
            }
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

    getstockOut() {
        let api_url = "/api/stock-out/";

        axios.get(api_url).then(res => {
            res.data.map(data => {
                return data;
            })

            this.setState({"stockOut": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    getStockIn() {
        let api_url = "/api/stock-in/";

        axios.get(api_url).then(res => {
            res.data.map(data => {
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

    getListing() {
        let api_url = "/api/listing/";
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

            this.setState({"listing": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    filterWithProduct(event) {
        event.preventDefault();
        this.getListing();
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

    showCreateUpdateListingModal(listing) {
        listing = listing ? listing : {};
        listing["callBackSave"] = this.callBackSaveListing;
        listing["products"] = this.state.products;
        listing["stockOutOptions"] = this.state.stockOut;
        listing["stockInOptions"] = this.state.stockIn;

        UpdateCreateListingDialog.show({...listing});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="listing"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Listing</h1>
                                <button type="button" className="btn btn-dark" onClick={this.showCreateUpdateListingModal.bind(this)}>Create</button>
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
                                            <th scope="col">Price</th>
                                            <th scope="col">Created by</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Last changes</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.listing.length > 0
                                        ?  this.state.listing.map(element => {
                                                return(
                                                    <tr key={element.id}>
                                                        <td>{this.getProductName(element.product)}</td>
                                                        <td>{element.price}</td>
                                                        <td>{this.getUserName(element.created_by)}</td>
                                                        <td>{element.created_at}</td>
                                                        <td>{element.updated_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateListingModal.bind(this, element)}>Edit</button>
                                                            <button className="btn btn-sm btn-danger" onClick={this.deleteListing.bind(this, element)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        : <tr><td colSpan="1000" className="text-center">No listing yet!</td></tr>
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

export default AdminListingList;
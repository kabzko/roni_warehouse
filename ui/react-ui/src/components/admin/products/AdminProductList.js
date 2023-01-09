import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateProductDialog from "./UpdateCreateProductDialog";

import axios from '../../../utils/axios';
import ConfirmDialog from "../../../utils/dialog";
import Toast from "../../../utils/toast";

class AdminProductList extends React.Component {
    constructor(props) {
        if (!(localStorage.getItem("user_type") === "admin" || localStorage.getItem("user_type") === "inventory")) {
            window.location.href = "/";
        }
        
        super(props);
        this.state = {
            products: [],
            search: "",
        }

        this.callBackSaveProduct = this.callBackSaveProduct.bind(this);
        this.searchProducts = this.searchProducts.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.getProducts();
    }

    callBackSaveProduct() {
        this.getProducts();
    }

    deleteProduct(product, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of product",
            text: `Are you sure you want to delete ${product.name}?`,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/products/${product.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getProducts();
                }).catch(error => {
                    Toast.error(error.response.data.message)
                })
            }
        })
    }

    getProducts() {
        let api_url = "/api/products/";
        let { search } = this.state;

        if (search !== "") {
            api_url += `?search=${search}`;
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

    showCreateUpdateProductModal(product) {
        product = product ? product : {};
        product["callBackSave"] = this.callBackSaveProduct;
        UpdateCreateProductDialog.show({...product});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="products"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Products list</h1>
                                <button type="button" className="btn btn-dark" onClick={this.showCreateUpdateProductModal.bind(this)}>Add product</button>
                            </div>
                            <div className="input-group mb-3 w-50 float-lg-end">
                                <input type="text" className="form-control" placeholder="Search product..."
                                    onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.searchProducts} value={this.state.search}>Search</span>
                            </div>
                            <div className="clearfix"></div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Barcode</th>
                                            <th scope="col">Net Weight</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.products.length > 0
                                        ?  this.state.products.map(product => {
                                                return(
                                                    <tr key={product.id}>
                                                        <td>{product.name}</td>
                                                        <td>{product.description}</td>
                                                        <td>{product.barcode}</td>
                                                        <td>{product.net_weight}</td>
                                                        <td>{product.created_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateProductModal.bind(this, product)}>Edit</button>
                                                            <button className="btn btn-sm btn-danger" onClick={this.deleteProduct.bind(this, product)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        : <tr><td colSpan="1000" className="text-center">No products yet!</td></tr>
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

export default AdminProductList;
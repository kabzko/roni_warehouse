import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateSupplierDialog from "./UpdateCreateSupplierDialog";

import axios from '../../../utils/axios';
import ConfirmDialog from "../../../utils/dialog";
import Toast from "../../../utils/toast";

class AdminSupplierList extends React.Component {
    constructor(props) {
        if (!localStorage.getItem("user_type") === "admin") {
            window.location.href = "/";
        }
        
        super(props);
        this.state = {
            suppliers: [],
            search: "",
        }

        this.callBackSaveSupplier = this.callBackSaveSupplier.bind(this);
        this.searchSupplier = this.searchSupplier.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.getSuppliers();
    }

    callBackSaveSupplier() {
        this.getSuppliers();
    }

    deleteSupplier(supplier, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of supplier",
            text: `Are you sure you want to delete ${supplier.name}?`,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/suppliers/${supplier.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getSuppliers();
                }).catch(error => {
                    Toast.error(error.response.data.message)
                })
            }
        })
    }

    getSuppliers() {
        let api_url = "/api/suppliers/";
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

            this.setState({"suppliers": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    searchSupplier(event) {
        event.preventDefault();
        this.getSuppliers();
    }

    handleSearchChange(event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.searchSupplier(event);
            }
        } else {
            this.setState({"search": event.target.value});
        }
    }

    showCreateUpdateSupplierModal(supplier) {
        supplier = supplier ? supplier : {};
        supplier["callBackSave"] = this.callBackSaveSupplier;
        UpdateCreateSupplierDialog.show({...supplier});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="suppliers"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Supplier list</h1>
                                <button type="button" className="btn btn-dark" onClick={this.showCreateUpdateSupplierModal.bind(this)}>Add supplier</button>
                            </div>
                            <div className="input-group mb-3 w-50 float-lg-end">
                                <input type="text" className="form-control" placeholder="Search supplier..."
                                    onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.searchSupplier} value={this.state.search}>Search</span>
                            </div>
                            <div className="clearfix"></div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">Address</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Last changes</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.suppliers.length > 0
                                        ?  this.state.suppliers.map(supplier => {
                                                return(
                                                    <tr key={supplier.id}>
                                                        <td>{supplier.name}</td>
                                                        <td>{supplier.address}</td>
                                                        <td>{supplier.created_at}</td>
                                                        <td>{supplier.updated_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateSupplierModal.bind(this, supplier)}>Edit</button>
                                                            <button className="btn btn-sm btn-danger" onClick={this.deleteSupplier.bind(this, supplier)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        : <tr><td colSpan="1000" className="text-center">No suppliers yet!</td></tr>
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

export default AdminSupplierList;
import React from 'react';

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateTruckDriverDialog from './UpdateCreateTruckDriverDialog';

import axios from '../../../utils/axios';
import Toast from "../../../utils/toast";
import ConfirmDialog from "../../../utils/dialog";

class AdminOthers extends React.Component {
    constructor(props) {
        if (!(localStorage.getItem("user_type"))) {
            window.location.href = "/";
        }

        super(props);
        this.state = {
            truck_drivers: [],
            search: "",
        };

        this.callBackSaveDriver = this.callBackSaveDriver.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.searchDrivers = this.searchDrivers.bind(this);
        this.getDrivers();
    }

    callBackSaveDriver() {
        this.getDrivers();
    }

    getDrivers() {
        let api_url = "/api/truck-drivers/";
        let { search } = this.state;

        if (search !== "") {
            api_url += `?search=${search}`;
        }

        axios.get(api_url).then(res => {
            this.setState({"truck_drivers": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    deleteDriver(driver, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of driver",
            text: `Are you sure you want to delete ${driver.name}?`,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/truck-drivers/${driver.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getDrivers();
                }).catch(error => {
                    Toast.error(error.response.data.message)
                })
            }
        })
    }

    searchDrivers(event) {
        event.preventDefault();
        this.getDrivers();
    }

    handleSearchChange(event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.searchDrivers(event);
            }
        } else {
            this.setState({"search": event.target.value});
        }
    }

    showCreateUpdateDriverModal(driver) {
        driver = driver ? driver : {};
        driver["callBackSave"] = this.callBackSaveDriver;
        UpdateCreateTruckDriverDialog.show({...driver});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="others"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Others</h1>
                            </div>
                            <div className='col-md-8 border shadow-sm p-3' style={{maxHeight: "500px", overflow: "auto"}}>
                                <div className='row'>
                                    <div className="col-sm-6">
                                        <h5>Truck Drivers</h5>
                                    </div>
                                    <div className='col-sm-6'>
                                        <div className="input-group mb-3 float-lg-end">
                                            <input type="text" className="form-control" placeholder="Search name..."
                                                onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                            <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.searchDrivers} value={this.state.search}>Search</span>
                                            <span className="input-group-text btn btn-dark" style={{cursor: "pointer"}} onClick={this.showCreateUpdateDriverModal.bind(this)}>Add new</span>
                                        </div>
                                    </div>
                                    <div className="clearfix"></div>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Contact Number</th>
                                                    <th scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="table-group-divider">
                                                {this.state.truck_drivers.length > 0
                                                ?  this.state.truck_drivers.map(driver => {
                                                        return(
                                                            <tr key={driver.id}>
                                                                <td>{driver.name}</td>
                                                                <td>{driver.contact_number}</td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateDriverModal.bind(this, driver)}>Edit</button>
                                                                    <button className="btn btn-sm btn-danger" onClick={this.deleteDriver.bind(this, driver)}>Delete</button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                : <tr><td colSpan="1000" className="text-center">No truck drivers yet!</td></tr>
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

export default AdminOthers;
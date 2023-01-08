import React from "react";

import SideNav from '../common/SideNav';
import Header from '../common/Header';
import UpdateCreateUserDialog from "./UpdateCreateUserDialog";

import axios from '../../../utils/axios';
import ConfirmDialog from "../../../utils/dialog";
import Toast from "../../../utils/toast";

class AdminUsersList extends React.Component {
    constructor(props) {
        if (localStorage.getItem("user_type") !== "admin") {
            window.location.href = "/";
        }
        
        super(props);
        this.state = {
            users: [],
            search: "",
        }

        this.callBackSaveUser = this.callBackSaveUser.bind(this);
        this.searchUsers = this.searchUsers.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.getUsers();
    }

    callBackSaveUser() {
        this.getUsers();
    }

    deleteUser(user, event) {
        event.preventDefault();

        ConfirmDialog.create({
            header: "Please confirm deletion of user",
            text: `Are you sure you want to delete ${user.first_name}?`,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
            confirmSuccess: () => {
                axios.delete(`/api/users/${user.id}/`, {}).then(res => {
                    Toast.success(res.data);
                    this.getUsers();
                }).catch(error => {
                    Toast.error(error.response.data.message)
                })
            }
        })
    }

    getUsers() {
        let api_url = "/api/users/";
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

            this.setState({"users": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    searchUsers(event) {
        event.preventDefault();
        this.getUsers();
    }

    handleSearchChange(event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.searchUsers(event);
            }
        } else {
            this.setState({"search": event.target.value});
        }
    }

    showCreateUpdateUserModal(user) {
        user = user ? user : {};
        user["callBackSave"] = this.callBackSaveUser;
        UpdateCreateUserDialog.show({...user});
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="users-list"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Users list</h1>
                                <button type="button" className="btn btn-dark" onClick={this.showCreateUpdateUserModal.bind(this, {})}>Add user</button>
                            </div>
                            <div className="input-group mb-3 w-50 float-lg-end">
                                <input type="text" className="form-control" placeholder="Search user's name..."
                                    onKeyUp={this.handleSearchChange} onChange={this.handleSearchChange}></input>
                                <span className="input-group-text" style={{cursor: "pointer"}} onClick={this.searchUsers} value={this.state.search}>Search</span>
                            </div>
                            <div className="clearfix"></div>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">First name</th>
                                            <th scope="col">Last name</th>
                                            <th scope="col">Middle name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col">Cashier ID</th>
                                            <th scope="col">User type</th>
                                            <th scope="col">Date created</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {this.state.users.length > 0
                                        ?  this.state.users.map(user => {
                                                return(
                                                    <tr key={user.id}>
                                                        <td>{user.first_name}</td>
                                                        <td>{user.last_name}</td>
                                                        <td>{user.middle_name}</td>
                                                        <td>{user.email}</td>
                                                        <td>{user.cashier_id}</td>
                                                        <td>{user.user_type}</td>
                                                        <td>{user.created_at}</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-1" onClick={this.showCreateUpdateUserModal.bind(this, user)}>Edit</button>
                                                            <button className="btn btn-sm btn-danger" onClick={this.deleteUser.bind(this, user)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        : <tr><td colSpan="1000" className="text-center">No users yet!</td></tr>
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

export default AdminUsersList;
import React from "react";
import { createRoot } from 'react-dom/client';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

class UpdateCreateUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "first_name": props.first_name ? props.first_name : "",
            "last_name": props.last_name ? props.last_name : "",
            "middle_name": props.middle_name ? props.middle_name : "",
            "email": props.email ? props.email : "",
            "cashier_id": props.cashier_id ? props.cashier_id : "",
            "user_type": props.user_type ? props.user_type : "",
            "password": props.password ? props.password : "",
        };

        if (props.id) {
            this.state["id"] = props.id;
        }

        this.modal = null;
        this.handleSaveUser = this.handleSaveUser.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("user-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "user-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateCreateUserDialog {...props} />);
    }

    componentDidMount() {
        this.modal = new window.bootstrap.Modal('#custom-dialog-modal', {
            keyboard: false
        })
        this.modal.show();
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    handleSaveUser(event) {
        event.preventDefault();
        let data = {...this.state};
        let api_url = "/api/users/";

        if (data.id) {
            api_url = `/api/users/${data.id}/`
        }

        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "first_name": "",
                    "last_name": "",
                    "middle_name": "",
                    "email": "",
                    "cashier_id": "",
                    "user_type": "",
                    "password": "",
                })
            }
        }).catch(error => {
            console.log(error);
            alert(error.response.data.message, "danger", "error-notification");
        })
    }

    handleClose(event) {
        event.preventDefault();
        this.modal.hide();
        document.getElementById("user-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {this.props.id ? "Update user" : "Create User"}
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div id="error-notification"></div>
                                <div id="success-notification"></div>
                                <div className="row mb-2">
                                    <label htmlFor="user-type" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>User type:
                                    </label>
                                    <div className="col-sm-8">
                                        <select className="form-select" aria-label="Default select example"
                                            value={this.state.user_type} onChange={this.inputChange.bind(this, "user_type")}>
                                            <option defaultValue="">Select user type</option>
                                            <option value="admin">Admin</option>
                                            <option value="cashier">Cashier</option>
                                        </select>
                                    </div>
                                </div>
                                {
                                    this.state.user_type ? 
                                        this.state.user_type === "admin" ?
                                        <div className="row mb-2">
                                            <label htmlFor="email" className="col-form-label col-sm-4 text-end">
                                                <span className="text-danger">*</span>Email:
                                            </label>
                                            <div className="col-sm-8">
                                                <input type="email" className="form-control" id="email" placeholder="Enter here.."
                                                    onChange={this.inputChange.bind(this, "email")} value={this.state.email}></input>
                                            </div>
                                        </div> :
                                        <div className="row mb-2">
                                            <label htmlFor="cashier_id" className="col-form-label col-sm-4 text-end">
                                                <span className="text-danger">*</span>Cashier ID:
                                            </label>
                                            <div className="col-sm-8">
                                                <input type="text" className="form-control" id="cashier_id" placeholder="Enter here.."
                                                    onChange={this.inputChange.bind(this, "cashier_id")} value={this.state.cashier_id}></input>
                                            </div>
                                        </div>
                                    : null
                                }
                                <div className="row mb-2">
                                    <label htmlFor="first-name" className="col-form-label col-sm-4 text-end">First Name:</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="first-name" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "first_name")} value={this.state.first_name}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="last-name" className="col-form-label col-sm-4 text-end">Last Name:</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="last-name" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "last_name")} value={this.state.last_name}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="middle-name" className="col-form-label col-sm-4 text-end">Middle Name:</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="middle-name" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "middle_name")} value={this.state.middle_name}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="password" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Password:
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="password" className="form-control" id="password" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "password")} value={this.state.password}></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveUser}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateCreateUserDialog;
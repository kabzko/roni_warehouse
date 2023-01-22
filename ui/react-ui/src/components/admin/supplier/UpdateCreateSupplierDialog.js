import React from "react";
import { createRoot } from 'react-dom/client';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

class UpdateCreateSupplierDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "name": props.name ? props.name : "",
            "address": props.address ? props.address : "",
        };

        if (props.id) {
            this.state["id"] = props.id;
        }

        this.modal = null;
        this.handleSaveSupplier = this.handleSaveSupplier.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("supplier-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "supplier-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateCreateSupplierDialog {...props} />);
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

    handleSaveSupplier(event) {
        event.preventDefault();

        let data = {...this.state};
        let api_url = "/api/suppliers/";

        if (data.id) {
            api_url = `/api/suppliers/${data.id}/`
        }

        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "name": "",
                    "address": "",
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
        document.getElementById("supplier-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {this.props.id ? "Update supplier" : "Create supplier"}
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div id="error-notification"></div>
                                <div id="success-notification"></div>

                                <div className="row mb-2">
                                    <label htmlFor="supplier-name" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Name:
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="supplier-name" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "name")} value={this.state.name}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="address" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Address:
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="address" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "address")} value={this.state.address}></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveSupplier}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateCreateSupplierDialog;
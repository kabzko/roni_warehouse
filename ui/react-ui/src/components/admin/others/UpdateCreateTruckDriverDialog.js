import React from "react";
import { createRoot } from 'react-dom/client';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

class UpdateCreateTruckDriverDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "name": props.name ? props.name : "",
            "contact_number": props.contact_number ? props.contact_number : "",
        };

        if (props.id) {
            this.state["id"] = props.id;
        }

        this.modal = null;
        this.handleSaveDriver = this.handleSaveDriver.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("truck-driver-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "truck-driver-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateCreateTruckDriverDialog {...props} />);
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

    handleSaveDriver(event) {
        event.preventDefault();

        let data = {...this.state};
        let api_url = "/api/truck-drivers/";

        if (data.id) {
            api_url = `/api/truck-drivers/${data.id}/`
        }

        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "name": "",
                    "contact_number": "",
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
        document.getElementById("truck-driver-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {this.props.id ? "Update truck driver" : "Create truck driver"}
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div id="error-notification"></div>
                                <div id="success-notification"></div>

                                <div className="row mb-2">
                                    <label htmlFor="driver-name" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Name:
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="driver-name" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "name")} value={this.state.name}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="contact-number" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Contact Number:
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="contact-number" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "contact_number")} value={this.state.contact_number}></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveDriver}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateCreateTruckDriverDialog;
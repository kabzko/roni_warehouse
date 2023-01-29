import React from "react";
import Select from 'react-select';
import { createRoot } from 'react-dom/client';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

const supplierOptions = [];

class UpdateCreateProductDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "name": props.name ? props.name : "",
            "supplier": props.supplier ? props.supplier : "",
            "description": props.description ? props.description : "",
            "barcode": props.barcode ? props.barcode : "",
            "net_weight": props.net_weight ? props.net_weight : "",
        };

        if (props.id) {
            this.state["id"] = props.id;
        }

        if (props.suppliers) {
            supplierOptions.splice(0, supplierOptions.length);
            props.suppliers.map(supplier => {
                let option = {
                    value: supplier.id,
                    label: supplier.name,
                }
                supplierOptions.push(option)

                if (props.supplier && supplier.id === props.supplier) {
                    this.state.supplier = option;
                }

                return supplier;
            });
        }

        this.modal = null;
        this.handleSaveProduct = this.handleSaveProduct.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("product-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "product-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateCreateProductDialog {...props} />);
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

    selectSupplierChange(selectedOption) {
        this.setState({supplier: selectedOption});
    }

    handleSaveProduct(event) {
        event.preventDefault();

        let data = {...this.state};
        let api_url = "/api/products/";

        if (data.id) {
            api_url = `/api/products/${data.id}/`
        }

        if (data.supplier) {
            data.supplier = data.supplier.value;
        }

        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "name": "",
                    "description": "",
                    "barcode": "",
                    "net_weight": "",
                    "supplier": "",
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
        document.getElementById("product-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {this.props.id ? "Update product" : "Create product"}
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div id="error-notification"></div>
                                <div id="success-notification"></div>

                                <div className="row mb-2">
                                    <label htmlFor="product-name" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Supplier:
                                    </label>
                                    <div className="col-sm-8">
                                        <Select value={this.state.supplier} onChange={this.selectSupplierChange.bind(this)} options={supplierOptions} />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="product-name" className="col-form-label col-sm-4 text-end">
                                        <span className="text-danger">*</span>Product Name:
                                    </label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="product-name" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "name")} value={this.state.name}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="description" className="col-form-label col-sm-4 text-end">Description:</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="description" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "description")} value={this.state.description}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="barcode" className="col-form-label col-sm-4 text-end">Barcode:</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="barcode" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "barcode")} value={this.state.barcode}></input>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <label htmlFor="net_weight" className="col-form-label col-sm-4 text-end">Net Weight:</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control" id="net_weight" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "net_weight")} value={this.state.net_weight}></input>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveProduct}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateCreateProductDialog;
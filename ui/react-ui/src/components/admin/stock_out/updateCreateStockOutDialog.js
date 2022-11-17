import React from "react";
import { createRoot } from 'react-dom/client';
import Select from 'react-select';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';
import Toast from "../../../utils/toast";

const productOptions = [];
const stockInOptions = [];

class UpdateCreateStockOutDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "stock_in": props.product ? props.product : "",
            "checked_by": props.checked_by ? props.checked_by : "",
            "received_by": props.received_by ? props.received_by : "",
            "truck_plate_number": props.truck_plate_number ? props.truck_plate_number : "",
            "truck_driver": props.truck_driver ? props.truck_driver : "",
            "quantity": props.quantity ? props.quantity : "",
            "date": props.date ? props.date : "",
            "delivered_to": props.delivered_to ? props.delivered_to : "",
            "available_stock": 0,
        };

        if (props.id) {
            this.state["id"] = props.id;
        }

        if (props.products) {
            productOptions.splice(0, productOptions.length);
            props.products.map(prod => {
                productOptions.push({
                    value: prod.id,
                    label: prod.name,
                })
                return prod;
            })
        }

        if (props.stockInOptions) {
            stockInOptions.splice(0, stockInOptions.length);
            props.stockInOptions.map(stock => {
                let stockIn = {};
                stockIn["value"] = stock.id;

                let product = this.getProduct(stock.product);
                stockIn["label"] = `${product.label} (Price: ${stock.price}) (${stock.quantity} ${stock.unit_of_measure})`;

                stockInOptions.push(stockIn);
                return stock;
            })
        }

        if (props.stock_in) {
            this.state["stock_in"] = this.getStockIn(props.stock_in);
            this.getAvailableStock(props.stock_in, props.quantity);
        }

        this.modal = null;
        this.handleSaveStockOut = this.handleSaveStockOut.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.selectStockInChange = this.selectStockInChange.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("stock-in-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "stock-in-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateCreateStockOutDialog {...props} />);
    }

    componentDidMount() {
        this.modal = new window.bootstrap.Modal('#custom-dialog-modal', {
            keyboard: false
        })
        this.modal.show();
    }

    getProduct(productId) {
        let product;

        for (let i in productOptions) {
            if (productOptions[i].value === productId) {
                product = productOptions[i];
                break;
            }
        }

        return product;
    }

    getStockIn(stockInId) {
        let stock_in;

        for (let i in stockInOptions) {
            if (stockInOptions[i].value === stockInId) {
                stock_in = stockInOptions[i];
                break;
            }
        }

        return stock_in;
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    selectStockInChange(selectedOption) {
        this.setState({stock_in: selectedOption});
        this.getAvailableStock(selectedOption.value);
    }

    handleSaveStockOut(event) {
        event.preventDefault();
        let data = {...this.state};
        let api_url = "/api/stock-out/";

        if (data.id) {
            api_url = `/api/stock-out/${data.id}/`
        }

        if (data.stock_in) {
            data["stock_in"] = data.stock_in.value;
        }

        if (data.quantity) {
            if (data.quantity > data.available_stock) {
                return alert("Quantity must less than the available stocks!", "danger", "error-notification");
            }
        }
        
        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "stock_in": "",
                    "checked_by": "",
                    "received_by": "",
                    "truck_plate_number": "",
                    "truck_driver": "",
                    "quantity": "",
                    "date": "",
                    "delivered_to": "",
                    "available_stock": 0,
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
        document.getElementById("stock-in-dialog-container").remove();
    }

    getAvailableStock(stockIn, addQuantity) {
        axios.get(`/api/stock/available?stock_in=${stockIn}`).then(res => {
            if (addQuantity) {
                res.data.available += addQuantity;
            }

            this.setState({"available_stock": res.data.available});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    render() {
        return (
            <div className="modal modal-lg fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {this.props.id ? "Update stock out" : "Create stock out"}
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label htmlFor="date" className="col-form-label">
                                            <span className="text-danger">*</span>Date:
                                        </label>
                                        <div>
                                            <input type="date" className="form-control" id="date" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "date")} value={this.state.date}></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-sm-12">
                                        <label htmlFor="stock-in" className="col-form-label text-end">
                                            <span className="text-danger">*</span>Stock In:
                                        </label>
                                        <div>
                                            <Select value={this.state.stock_in} onChange={this.selectStockInChange} options={stockInOptions} />
                                        </div>
                                        <small>Available stock: <b>{this.state.available_stock}</b></small>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label htmlFor="quantity" className="col-form-label text-end">
                                            <span className="text-danger">*</span>Quantity:
                                        </label>
                                        <div>
                                            <input type="number" className="form-control" id="quantity" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "quantity")} value={this.state.quantity}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="delivered-to" className="col-form-label text-end">
                                            Delivered to:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="delivered-to" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "delivered_to")} value={this.state.delivered_to}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label htmlFor="truck-plate-number" className="col-form-label text-end">
                                            Truck plate number:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="truck-plate-number" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "truck_plate_number")} value={this.state.truck_plate_number}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="truck-driver" className="col-form-label text-end">
                                            Truck driver:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="truck-driver" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "truck_driver")} value={this.state.truck_driver}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label htmlFor="received-by" className="col-form-label text-end">
                                            Received by:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="received-by" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "received_by")} value={this.state.received_by}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="checked-by" className="col-form-label text-end">
                                            Checked by:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="checked-by" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "checked_by")} value={this.state.checked_by}></input>
                                        </div>
                                    </div>
                                </div>

                                <div id="error-notification" style={{position: "sticky", bottom: 0}}></div>
                                <div id="success-notification" style={{position: "sticky", bottom: 0}}></div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveStockOut}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateCreateStockOutDialog;
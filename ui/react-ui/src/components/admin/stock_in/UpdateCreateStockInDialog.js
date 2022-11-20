import React from "react";
import { createRoot } from 'react-dom/client';
import Select from 'react-select';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

const productOptions = [];
const unitOfMeasureOptions = [{
    value: "pieces",
    label: "Pieces"
}, {
    value: "bundle",
    label: "Bundle"
}, {
    value: "box",
    label: "Box"
}];

class UpdateCreateStockInDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "product": props.product ? props.product : "",
            "supplier_name": props.supplier_name ? props.supplier_name : "",
            "unit_of_measure": props.unit_of_measure ? props.unit_of_measure : "",
            "checked_by": props.checked_by ? props.checked_by : "",
            "received_by": props.received_by ? props.received_by : "",
            "truck_plate_number": props.truck_plate_number ? props.truck_plate_number : "",
            "truck_driver": props.truck_driver ? props.truck_driver : "",
            "price": props.price ? props.price : "",
            "quantity": props.quantity ? props.quantity : "",
            "number_of_pieces": props.number_of_pieces ? props.number_of_pieces : "",
            "date": props.date ? props.date : "",
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
        
        if (props.product) {
            this.state.product = this.getProduct(props.product);
        }

        if (props.unit_of_measure) {
            this.state.unit_of_measure = this.getUnitOfMeasure(props.unit_of_measure);
        }

        this.modal = null;
        this.handleSaveStockIn = this.handleSaveStockIn.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.selectProductChange = this.selectProductChange.bind(this);
        this.selectUnitOfMeasureChange = this.selectUnitOfMeasureChange.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("stock-in-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "stock-in-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateCreateStockInDialog {...props} />);
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

    getUnitOfMeasure(unit) {
        let unitOfMeasure;

        for (let i in unitOfMeasureOptions) {
            if (unitOfMeasureOptions[i].value === unit) {
                unitOfMeasure = unitOfMeasureOptions[i];
                break;
            }
        }

        return unitOfMeasure;
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    selectProductChange(selectedOption) {
        this.setState({product: selectedOption});
    }

    selectUnitOfMeasureChange(selectedOption) {
        this.setState({unit_of_measure: selectedOption});
    }

    handleSaveStockIn(event) {
        event.preventDefault();
        let data = {...this.state};
        let api_url = "/api/stock-in/";

        if (data.id) {
            api_url = `/api/stock-in/${data.id}/`
        }

        if (data.product) {
            data["product"] = data.product.value;
        }
        
        if (data.unit_of_measure) {
            data["unit_of_measure"] = data.unit_of_measure.value;
        }
        
        if (data.unit_of_measure === "pieces") {
            data["number_of_pieces"] = data.quantity;
        }

        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "product": "",
                    "supplier_name": "",
                    "unit_of_measure": "",
                    "checked_by": "",
                    "received_by": "",
                    "truck_plate_number": "",
                    "truck_driver": "",
                    "price": "",
                    "quantity": "",
                    "number_of_pieces": "",
                    "date": "",
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

    render() {
        return (
            <div className="modal modal-lg fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                {this.props.id ? "Update stock in" : "Create stock in"}
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
                                    <div className="col-sm-6">
                                        <label htmlFor="product-name" className="col-form-label text-end">
                                            <span className="text-danger">*</span>Product:
                                        </label>
                                        <div>
                                            <Select value={this.state.product} onChange={this.selectProductChange} options={productOptions} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="supplier-name" className="col-form-label text-end">
                                            Supplier Name:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="supplier-name" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "supplier_name")} value={this.state.supplier_name}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label htmlFor="price" className="col-form-label text-end">
                                            <span className="text-danger">*</span>Price:
                                        </label>
                                        <div>
                                            <input type="number" className="form-control" id="price" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "price")} value={this.state.price}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <label htmlFor="quantity" className="col-form-label text-end">
                                            <span className="text-danger">*</span>Quantity:
                                        </label>
                                        <div>
                                            <input type="number" className="form-control" id="quantity" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "quantity")} value={this.state.quantity}></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-2">
                                    <div className="col-sm-6">
                                        <label htmlFor="unit-of-measure" className="col-form-label text-end">
                                            <span className="text-danger">*</span>Unit of Measure:
                                        </label>
                                        <div>
                                            <Select value={this.state.unit_of_measure} onChange={this.selectUnitOfMeasureChange} options={unitOfMeasureOptions} />
                                        </div>
                                    </div>
                                    {
                                        this.state.unit_of_measure.value !== "pieces" ?
                                        <div className="col-sm-6">
                                            <label htmlFor="number-of-pieces" className="col-form-label text-end">
                                                <span className="text-danger">*</span>No. of pieces per unit of measure:
                                            </label>
                                            <div>
                                                <input type="number" className="form-control" id="number-of-pieces" placeholder="Enter here.."
                                                    onChange={this.inputChange.bind(this, "number_of_pieces")} value={this.state.number_of_pieces}></input>
                                            </div>
                                        </div> :
                                        <div className="col-sm-6">
                                            <label htmlFor="number-of-pieces" className="col-form-label text-end">
                                                <span className="text-danger">*</span>No. of pieces per unit of measure:
                                            </label>
                                            <div>
                                                <input type="number" className="form-control" id="number-of-pieces" placeholder="Enter here.." value={this.state.quantity} disabled></input>
                                            </div>
                                        </div>
                                    }
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
                            <button type="button" className="btn btn-primary" onClick={this.handleSaveStockIn}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateCreateStockInDialog;
import React from "react";
import { createRoot } from 'react-dom/client';
import Select from 'react-select';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';
import Toast from "../../../utils/toast";

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
            "list": props.list ? [...props.list] : [],
            "supplier_name": props.supplier_name ? props.supplier_name : "",
            "checked_by": props.checked_by ? props.checked_by : "",
            "received_by": props.received_by ? props.received_by : "",
            "truck_plate_number": props.truck_plate_number ? props.truck_plate_number : "",
            "truck_driver": props.truck_driver ? props.truck_driver : "",
            "date": props.date ? props.date : "",
            "products": props.products ? props.products : [],
        };

        if (props.id) {
            this.state["id"] = props.id;
        }

        if (this.state.products) {
            productOptions.splice(0, productOptions.length);
            this.state.products.map(prod => {
                productOptions.push({
                    value: prod.id,
                    label: prod.name,
                })
                return prod;
            })
        }
        
        for (let i in this.state.list) {
            let product = this.state.list[i]["product"];
            let unit_of_measure = this.state.list[i]["unit_of_measure"];

            if (product && typeof(product) !== "object") {
                this.state.list[i]["product"] = this.getProduct(product);
            }

            if (unit_of_measure && typeof(unit_of_measure) !== "object") {
                this.state.list[i]["unit_of_measure"] = this.getUnitOfMeasure(unit_of_measure);
            }
        }

        if (this.state.list.length === 0) {
            this.state.list.push(this.getEmptyList());
        }

        this.modal = null;
        this.handleSaveStockIn = this.handleSaveStockIn.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    getProducts() {
        debugger;
        axios.get("/api/products/").then(res => {
            this.setState({"products": res.data}, () => {
                if (this.state.products) {
                    productOptions.splice(0, productOptions.length);
                    this.state.products.map(prod => {
                        productOptions.push({
                            value: prod.id,
                            label: prod.name,
                        })
                        return prod;
                    })
                }
            });
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
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
    
    getEmptyList() {
        return {
            product: {
                value: "",
                label: ""
            },
            unit_of_measure: {
                value: "",
                label: "",
            },
            price: 0,
            quantity: 0,
            number_of_pieces: 0,
        }
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    listInputChange(input_name, index, event) {
        let data = {...this.state};
        data["list"][index][input_name] = event.target.value;
        this.setState({
            list: data["list"],
        })
    }

    selectProductChange(index, selectedOption) {
        let data = {...this.state};
        data["list"][index]["product"] = selectedOption;
        this.setState({list: data["list"]});
    }

    selectUnitOfMeasureChange(index, selectedOption) {
        let data = {...this.state};
        data["list"][index]["unit_of_measure"] = selectedOption;
        
        if (selectedOption.value === "pieces") {
            data["list"][index]["number_of_pieces"] = 1;
        }

        this.setState({list: data["list"]});
    }

    handleSaveStockIn(event) {
        event.preventDefault();
        let data = {...this.state};
        let api_url = "/api/stock-in/";

        for (let i in data["list"]) {
            if (data["list"][i]["product"]) {
                data["list"][i]["product"] = data["list"][i]["product"]["value"];
            }

            if (data["list"][i]["unit_of_measure"]) {
                data["list"][i]["unit_of_measure"] = data["list"][i]["unit_of_measure"]["value"];
            }

            if (data["list"][i]["unit_of_measure"] === "pieces") {
                data["list"][i]["number_of_pieces"] = data["list"][i]["quantity"];
            }
        }

        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "supplier_name": "",
                    "checked_by": "",
                    "received_by": "",
                    "truck_plate_number": "",
                    "truck_driver": "",
                    "date": "",
                    "list": [this.getEmptyList()],
                })
            }
        }).catch(error => {
            console.log(error);
            alert(error.response.data.message, "danger", "error-notification");
        })
    }

    addNewList(event) {
        event.preventDefault();

        let data = {...this.state};
        data["list"].push(this.getEmptyList());

        this.setState({
            list: data["list"],
        })
    }

    removeList(index, event) {
        event.preventDefault();
        let data = {...this.state};
        data["list"].splice(index, 1);

        if (data["list"].length === 0) {
            data["list"].push(this.getEmptyList());
        }

        this.setState({
            list: data["list"],
        })
    }

    handleClose(event) {
        event.preventDefault();
        this.modal.hide();
        document.getElementById("stock-in-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal modal-xl fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
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
                                <h5>Details</h5>
                                <div className="row mb-2">
                                    <div className="col-sm-4">
                                        <label htmlFor="date" className="col-form-label">
                                            <span className="text-danger">*</span>Date:
                                        </label>
                                        <div>
                                            <input type="date" className="form-control" id="date" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "date")} value={this.state.date}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="supplier-name" className="col-form-label text-end">
                                            Supplier Name:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="supplier-name" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "supplier_name")} value={this.state.supplier_name}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="truck-plate-number" className="col-form-label text-end">
                                            Truck plate number:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="truck-plate-number" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "truck_plate_number")} value={this.state.truck_plate_number}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="truck-driver" className="col-form-label text-end">
                                            Truck driver:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="truck-driver" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "truck_driver")} value={this.state.truck_driver}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="received-by" className="col-form-label text-end">
                                            Received by:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="received-by" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "received_by")} value={this.state.received_by}></input>
                                        </div>
                                    </div>
                                    <div className="col-sm-4">
                                        <label htmlFor="checked-by" className="col-form-label text-end">
                                            Checked by:
                                        </label>
                                        <div>
                                            <input type="text" className="form-control" id="checked-by" placeholder="Enter here.."
                                                onChange={this.inputChange.bind(this, "checked_by")} value={this.state.checked_by}></input>
                                        </div>
                                    </div>
                                </div>

                                <hr></hr>
                                <div className="d-flex align-items-center">
                                    <div>
                                        <h5>Stocks</h5>
                                    </div>
                                    <div className="ms-2">
                                        <button className="btn btn-sm btn-primary" onClick={this.getProducts.bind(this)}>Reload products</button>
                                    </div>
                                </div>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{width: "300px"}}>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th style={{width: "200px"}}>Unit of Measure</th>
                                            <th>No. of Pieces per UOM</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.list.map((el, idx) => {
                                                return (
                                                    <tr key={idx}>
                                                        <td>
                                                            <Select value={el.product} onChange={this.selectProductChange.bind(this, idx)} options={productOptions} />
                                                        </td>
                                                        <td>
                                                            <input type="number" className="form-control" id="price" placeholder="Enter here.."
                                                                onChange={this.listInputChange.bind(this, "price", idx)} value={el.price}></input>
                                                        </td>
                                                        <td>
                                                            <input type="number" className="form-control" id="quantity" placeholder="Enter here.."
                                                                onChange={this.listInputChange.bind(this, "quantity", idx)} value={el.quantity}></input>
                                                        </td>
                                                        <td>
                                                            <Select value={el.unit_of_measure} onChange={this.selectUnitOfMeasureChange.bind(this, idx)} options={unitOfMeasureOptions} />
                                                        </td>
                                                        <td>
                                                            { el.unit_of_measure.value !== "pieces" ?
                                                                <input type="number" className="form-control" id="number-of-pieces" placeholder="Enter here.."
                                                                    onChange={this.listInputChange.bind(this, "number_of_pieces", idx)} value={el.number_of_pieces}></input>
                                                            :
                                                                <input type="number" className="form-control" id="number-of-pieces" placeholder="Enter here.." value={el.quantity} disabled></input>
                                                            }
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-sm btn-danger" onClick={this.removeList.bind(this, idx)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <button className="btn btn-sm btn-primary" onClick={this.addNewList.bind(this)}>Add new</button>

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
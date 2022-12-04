import React from "react";
import { createRoot } from 'react-dom/client';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

class UpdateViewInvoiceDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "sales": props.sales,
            "carts": props.carts,
            "users": props.users,
            "products": props.products,
        };
        
        this.modal = null;
        this.handleSaveListing = this.handleSaveListing.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("listing-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "listing-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UpdateViewInvoiceDialog {...props} />);
    }

    componentDidMount() {
        this.modal = new window.bootstrap.Modal('#custom-dialog-modal', {
            keyboard: false
        })
        this.modal.show();
    }

    priceFormat(value) {
        const val = (value/1).toFixed(2).replace(",", ".")
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    getUserName(userId) {
        let user;

        for (let i in this.state.users) {
            if (this.state.users[i].id === userId) {
                user = `${this.state.users[i].last_name}, ${this.state.users[i].first_name}`;
                break;
            }
        }

        return user;
    }

    getProductName(productId) {
        let product;

        for (let i in this.state.products) {
            if (this.state.products[i].id === productId) {
                product = this.state.products[i].name;
                break;
            }
        }

        return product;
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    handleSaveListing(event) {
        event.preventDefault();
        let data = {...this.state};
        let api_url = "/api/listing/";

        if (data.id) {
            api_url = `/api/listing/${data.id}/`
        }

        if (data.product) {
            data["product"] = data.product.value;
        }

        if (data.stock_out) {
            data["stock_out"] = data.stock_out.map(element => element.value);
        }

        const stockOutDatas = this.props.stockOutOptions.filter(element => data.stock_out.includes(element.id));
        const stockInDatas = this.props.stockInOptions.find(element => element.id === parseInt(stockOutDatas[0].stock_in));
        data["unit_of_measure"] = stockInDatas.unit_of_measure;

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
                    "product": "",
                    "stock_out": "",
                    "price": "",
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
        document.getElementById("listing-dialog-container").remove();
    }

    renderTransaction() {
        if (!this.state.sales) {
            return (
                null
            )
        }
        return (
            <div>
                <div className="d-flex justify-content-between">
                    <div><b>Ref No. </b>{this.state.sales.reference_no}</div>
                    <div>{new Date(this.state.sales.created_at).toLocaleString("en-US")}</div>
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.carts.map(element => {
                                return (
                                    <tr key={element.id}>
                                        <td>{this.getProductName(element.product)}</td>
                                        <td>{element.quantity}</td>
                                        <td>{this.priceFormat(element.price)}</td>
                                        <td>{this.priceFormat((element.price * element.quantity))}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className="d-flex justify-content-between">
                    <div><b>TOTAL</b></div>
                    <div>{this.priceFormat(this.state.sales.total_amount)}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>CASH</b></div>
                    <div>{this.priceFormat(this.state.sales.amount_pay)}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>CHANGE</b></div>
                    <div>{this.priceFormat(this.state.sales.amount_pay - this.state.sales.total_amount)}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>CASHIER</b></div>
                    <div>{this.getUserName(this.state.sales.cashier_by)}</div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="modal modal-lg fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Invoice
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                {this.renderTransaction()}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleClose}>Close</button>
                            <button type="button" className="btn btn-primary">Print</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateViewInvoiceDialog;
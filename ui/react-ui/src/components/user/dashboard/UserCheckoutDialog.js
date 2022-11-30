import React from "react";
import { createRoot } from 'react-dom/client';

import axios from '../../../utils/axios';
import alert from '../../../utils/alert';

class UserCheckoutDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "carts": props.carts ? props.carts : "",
            "payment_type": "cash",
            "amount_pay": "",
        };

        this.modal = null;
        this.handleCheckout = this.handleCheckout.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    static show(props) {
        let containerElement = document.getElementById("listing-dialog-container");
        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "listing-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<UserCheckoutDialog {...props} />);
    }

    componentDidMount() {
        this.modal = new window.bootstrap.Modal('#custom-dialog-modal', {
            keyboard: false
        })
        this.modal.show();

        setTimeout(() => {
            this.payInput.focus();
        }, 500);
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    handleCheckout(event) {
        event.preventDefault();
        let data = {...this.state};
        let api_url = "/api/cashier/checkout/";

        let totalAmount = 0;
        data["carts"].forEach(element => {
            totalAmount += (element.price * element.quantity);
        });

        if (totalAmount > parseInt(data.amount_pay)) {
            return alert("Your payment must be greater than balance!", "danger", "error-notification");
        }
        
        axios.post(api_url, data).then(res => {
            alert(res.data, "success", "success-notification");
            this.props.callBackSave();

            if (!data.id) {
                this.setState({
                    "carts": "",
                    "payment_type": "cash",
                    "amount_pay": "",
                })
            }

            this.handleCancel(event);
        }).catch(error => {
            console.log(error);
            alert(error.response.data.message, "danger", "error-notification");
        })
    }

    handleCancel(event) {
        event.preventDefault();
        this.modal.hide();
        document.getElementById("listing-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal modal-lg fade" id="custom-dialog-modal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">
                                Checkout
                            </h1>
                            <button type="button" className="btn-close" onClick={this.handleCancel} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>

                                <div className="row mb-2">
                                    <label htmlFor="price" className="col-form-label text-start">
                                        <span className="text-danger">*</span>Pay:
                                    </label>
                                    <div>
                                        <input ref={(input) => { this.payInput = input; }} type="number" className="form-control" id="amount_pay" placeholder="Enter here.." onChange={this.inputChange.bind(this, "amount_pay")} value={this.state.amount_pay}></input>
                                    </div>
                                </div>

                                <div id="error-notification" style={{position: "sticky", bottom: 0}}></div>
                                <div id="success-notification" style={{position: "sticky", bottom: 0}}></div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleCancel}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleCheckout}>Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserCheckoutDialog;
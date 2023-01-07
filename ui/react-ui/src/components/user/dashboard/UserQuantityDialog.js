import React from "react";
import { createRoot } from 'react-dom/client';

class UserCheckoutDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "quantity": 1,
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
            this.quantityInput.focus();
        }, 500);
    }

    inputChange(input_name, event) {
        let updated_field = {};
        updated_field[input_name] = event.target.value;
        this.setState({...updated_field});
    }

    handleCheckout(event) {
        if (event.keyCode) {
            if (event.keyCode !== 13) return;
        }
        event.preventDefault();
        this.props.callBackSave(this.props.scanCode, parseInt(this.state.quantity));
        this.handleCancel(event);
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
                                Quantity
                            </h1>
                        </div>
                        <div className="modal-body">
                            <form>

                                <div className="row mb-2">
                                    <label htmlFor="price" className="col-form-label text-start">
                                        <span className="text-danger">*</span>Enter customer payment:
                                    </label>
                                    <div>
                                        <input ref={(input) => { this.quantityInput = input; }} type="number" className="form-control" id="quantity" placeholder="Enter here.." onChange={this.inputChange.bind(this, "quantity")} value={this.state.quantity} onKeyDown={this.handleCheckout}></input>
                                    </div>
                                </div>

                                <div id="error-notification" style={{position: "sticky", bottom: 0}}></div>
                                <div id="success-notification" style={{position: "sticky", bottom: 0}}></div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" id="close-user-modal" onClick={this.handleCancel}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={this.handleCheckout}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserCheckoutDialog;
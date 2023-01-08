import React from 'react';
import { toast } from 'react-toastify';

import UserCheckoutDialog from './UserCheckoutDialog';
import UserQuantityDialog from './UserQuantityDialog';

import axios from '../../../utils/axios';

import * as onScan from 'onscan.js';

import './Dashboard.css';

class UserDashboard extends React.Component {
    constructor(props) {
        if (sessionStorage.getItem("user_type") !== "cashier") {
            window.location.href = "/";
        }

        super(props);
        this.state = {
            products: [],
            listing: [],
            carts: [],
            lastProduct: {},
            lastTransaction: {},
        };

        this.callBackSaveListing = this.callBackSaveListing.bind(this);
        this.callBackFinalizeQuantity = this.callBackFinalizeQuantity.bind(this);
        this.showUserCheckoutModal = this.showUserCheckoutModal.bind(this);
        this.showUserQuantityModal = this.showUserQuantityModal.bind(this);

        this.getUsers();
        this.getProducts();
        this.getListing();
    }

    callBackSaveListing(referenceNo) {
        this.setState({
            carts: [],
            lastProduct: {},
        });
        this.getLastTransaction(referenceNo);
    }

    callBackFinalizeQuantity(sScancode, quantity) {
        this.checkScannedBarcode(sScancode, quantity);
    }

    componentDidMount() {
        onScan.attachTo(document);
        document.addEventListener("scan", (sScancode, iQuantity) => {
            this.showUserQuantityModal(sScancode.detail.scanCode);
        });
    }

    componentWillUnmount() {
        onScan.detachFrom(document);
        document.removeEventListener("scan");
    }

    priceFormat(value) {
        const val = (value/1).toFixed(2).replace(",", ".")
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    getUserName(userId) {
        let user;

        for (let i in this.state.users) {
            if (this.state.users[i].id === userId) {
                user = `${this.state.users[i].first_name}`;
                break;
            } else {
                user = "Superadmin";
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

    logout() {
        axios.post("/api/logout/", {}).then(res => {
            window.location.reload();
        }).catch(error => {
            console.log(error);
        })
    }

    getUsers() {
        let api_url = "/api/users/";

        axios.get(api_url).then(res => {
            this.setState({"users": res.data});
        }).catch(error => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }

    getListing() {
        axios.get("/api/cashier/listing/").then(res => {
            this.setState({"listing": res.data});
        }).catch(error => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }

    getProducts() {
        axios.get("/api/products/").then(res => {
            this.setState({"products": res.data});
        }).catch(error => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }

    checkScannedBarcode(scanCode, quantity) {
        let productData = this.state.products.find(element => element.barcode === scanCode);
        if (productData) {
            let listingProduct = this.state.listing.find(element => element.product === parseInt(productData.id));
            let isExistInCart = this.state.carts.find(element => element.id === parseInt(productData.id));
            if (isExistInCart) {
                let newState = this.state.carts.map(element => element.id === productData.id ? { ...element, quantity: element.quantity += quantity } : element);
                this.setState({
                    carts: newState
                });
            } else {
                this.setState({
                    carts: [
                        ...this.state.carts,
                        {
                            id: productData.id,
                            barcode: productData.barcode,
                            name: productData.name,
                            quantity: quantity,
                            price: listingProduct.price,
                            unit_of_measure: listingProduct.unit_of_measure,
                        },
                    ]
                });
            }
            this.setState({
                lastProduct: {
                    id: productData.id,
                    barcode: productData.barcode,
                    name: productData.name,
                    quantity: quantity,
                    price: listingProduct.price,
                    unit_of_measure: listingProduct.unit_of_measure,
                }
            })
        } else {
            toast.error("Barcode not found.");
        }
    }

    showUserCheckoutModal() {
        if (!this.state.carts.length) return toast.error("Cart is empty.");

        const checkout = {};
        checkout["callBackSave"] = this.callBackSaveListing;
        checkout["carts"] = this.state.carts;

        UserCheckoutDialog.show({...checkout});
    }

    showUserQuantityModal(scanCode) {
        const quantity = {};
        quantity["callBackSave"] = this.callBackFinalizeQuantity;
        quantity["scanCode"] = scanCode;

        UserQuantityDialog.show({...quantity});
    }
    
    getLastTransaction(referenceNo) {
        axios.get(`/api/cashier/last-transaction/${referenceNo}`).then(res => {
            this.setState({"lastTransaction": res.data});
        }).catch(error => {
            console.log(error);
            toast.error(error.response.data.message);
        })
    }

    renderLookUpProducts() {
        if (!this.state.listing.length) {
            return (
                null
            )
        }
        return this.state.listing.map(elementList => {
            let listingProduct = this.state.products.find(elementProd => elementProd.id === parseInt(elementList.product));
            return (
                <div key={elementList.id} className="col-4">
                    <div className="card">
                        <div className="card-body d-flex">
                            <div>
                                <h5 className="card-title">{listingProduct.name}</h5>
                                <span className="carts-text"><b><small>{listingProduct.barcode}</small></b></span><br />
                                <span className="carts-text">{elementList.price} per {elementList.unit_of_measure}</span>
                            </div>
                            <div>
                                <button className="btn btn-primary" onClick={() => this.showUserQuantityModal(listingProduct.barcode)}>Add to carts</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    renderProductScannedModal() {
        if (!Object.keys(this.state.lastProduct).length) {
            return (
                <div className="border">
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div className="product-scanned text-end">
                            <label>
                                {this.priceFormat(0)}
                            </label>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className="border">
                
                <div className="d-flex justify-content-between">
                    <div>
                        <label>
                            {this.state.lastProduct.name}
                        </label>
                        <br />
                        <label>
                            {this.priceFormat(this.state.lastProduct.price)}
                        </label>
                        <br />
                        <label>
                            ×{this.priceFormat(this.state.lastProduct.quantity)}
                        </label>
                    </div>
                    <div className="product-scanned text-end">
                        <label>
                            {this.priceFormat(this.state.lastProduct.price * this.state.lastProduct.quantity)}
                        </label>
                    </div>
                </div>
            </div>
        )
    }

    renderTotalAmount() {
        if (!this.state.carts.length) {
            return (
                <label className="total-amount">{this.priceFormat(0)}</label>
            )
        }
        let totalAmount = 0;
        this.state.carts.forEach(element => {
            totalAmount += (element.price * element.quantity);
        });
        return (
            <label className="total-amount">{this.priceFormat(totalAmount)}</label>
        )
    }

    renderCartData() {
        if (!this.state.carts.length) {
            return (
                <tr>
                    <td colSpan="100%"><div style={{height: "20px"}}></div></td>
                </tr>
            )
        }
        return this.state.carts.map(element => {
            return (
                <tr key={element.id}>
                    <td>{element.barcode}</td>
                    <td>{element.name}</td>
                    <td>{element.quantity}</td>
                    <td>{this.priceFormat(element.price)}</td>
                </tr>
            )
        })
    }

    renderLastTransaction() {
        if (!this.state.lastTransaction) {
            return (
                null
            )
        }
        return (
            <div className="receipt d-inline-block">
                <div className="text-center">
                    RONI WAREHOUSE CORP.
                </div>
                <div className="text-center">
                    POB. 1, VILLANUEVA, MIS. OR.
                </div>
                <div className="text-center">
                    TIN: 493-862-572-000
                </div>
                <div className="text-center">
                    SN: Z9AXGWFX
                </div>
                <div className="text-center">
                    MIN: 19082817512052915
                </div>
                <div className="text-center">
                    PTU: FP082019098022692300000
                </div>
                <div className="text-center">
                    ACC: 0500003029820000261381
                </div>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>DESC</th>
                            <th>QTY</th>
                            <th>PRICE</th>
                            <th>AMOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.lastTransaction.carts.map(element => {
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
                    <div><b>SUBTOTAL:</b></div>
                    <div>{this.priceFormat(this.state.lastTransaction.sales.total_amount - (this.state.lastTransaction.sales.total_amount * 0.12))}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>Vat Amount(12%):</b></div>
                    <div>{this.priceFormat(this.state.lastTransaction.sales.total_amount * 0.12)}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>TOTAL:</b></div>
                    <div>{this.priceFormat(this.state.lastTransaction.sales.total_amount)}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>Cash:</b></div>
                    <div>{this.priceFormat(this.state.lastTransaction.sales.amount_pay)}</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>Change:</b></div>
                    <div>{this.priceFormat(this.state.lastTransaction.sales.amount_pay - this.state.lastTransaction.sales.total_amount)}</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <div><b>Customer:</b></div>
                    <div></div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>Address:</b></div>
                    <div></div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>TIN:</b></div>
                    <div></div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>B. Style:</b></div>
                    <div></div>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                    <div><b>Vat Sales:</b></div>
                    <div></div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>12% Vat:</b></div>
                    <div></div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>VAT-Exempt Sale:</b></div>
                    <div></div>
                </div>
                <div className="d-flex justify-content-between">
                    <div><b>Zero Rated:</b></div>
                    <div></div>
                </div>
                <hr />
                <div className="d-flex">
                    <div><b>No. Of Item(s): {this.state.lastTransaction.carts.length}</b></div>
                    <div></div>
                </div>
                <div className="d-flex">
                    <div><b>Receipt No.:&nbsp;</b></div>
                    <div>{this.state.lastTransaction.sales.reference_no}</div>
                </div>
                <div className="d-flex">
                    <div><b>Cashier:&nbsp;</b></div>
                    <div>{this.getUserName(this.state.lastTransaction.sales.cashier_by)}</div>
                </div>
                <div className="d-flex">
                    <div><b>Date:&nbsp;</b></div>
                    <div>{new Date(this.state.lastTransaction.sales.created_at).toLocaleString("en-US")}</div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <>
                {
                    !Object.keys(this.state.lastTransaction).length ?
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-6">
                                <div className="row">
                                    {this.renderLookUpProducts()}
                                </div>
                            </div>
                            <div className="col-6">
                                {this.renderProductScannedModal()}
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Barcode</th>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCartData()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="text-end border">
                            {this.renderTotalAmount()}
                        </div>
                        <div>
                            <button className="btn btn-danger btn-dashboard" onClick={this.logout}>Logout</button>
                            <button className="btn btn-success btn-dashboard float-end" onClick={this.showUserCheckoutModal}>Checkout</button>
                        </div>
                    </div> :
                    <div className="container-fluid text-center">
                        {this.renderLastTransaction()}
                        <div className="receipt-action position-absolute receipt-btn">
                            <div className="d-flex justify-content-between">
                                <button className="btn btn-danger btn-dashboard" onClick={this.logout}>Logout</button>
                                <button className="btn btn-success btn-dashboard" onClick={() => this.setState({lastTransaction: {}})}>New transaction</button>
                                <button className="btn btn-primary btn-dashboard">Print</button>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default UserDashboard;
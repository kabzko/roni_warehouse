import React from 'react';
import { toast } from 'react-toastify';

import UserCheckoutDialog from './UserCheckoutDialog';

import axios from '../../../utils/axios';

import * as onScan from 'onscan.js';

import './Dashboard.css';

class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            listing: [],
            carts: [],
            lastProduct: {},
        };

        this.callBackSaveListing = this.callBackSaveListing.bind(this);
        this.showUserCheckoutModal = this.showUserCheckoutModal.bind(this);

        this.getProducts();
        this.getListing();
    }

    callBackSaveListing() {
        this.setState({
            carts: [],
            lastProduct: {},
        });
    }

    componentDidMount() {
        onScan.attachTo(document);
        document.addEventListener("scan", (sScancode, iQuantity) => {
            this.checkScannedBarcode(sScancode.detail.scanCode);
        });
    }

    componentWillUnmount() {
        onScan.detachFrom(document);
        document.removeEventListener("scan");
    }

    logout() {
        axios.post("/api/logout/", {}).then(res => {
            window.location.reload();
        }).catch(error => {
            console.log(error);
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

    checkScannedBarcode(scanCode) {
        let productData = this.state.products.find(element => element.barcode === scanCode);
        if (productData) {
            let listingProduct = this.state.listing.find(element => element.product === parseInt(productData.id));
            let isExistInCart = this.state.carts.find(element => element.id === parseInt(productData.id));
            if (isExistInCart) {
                let newState = this.state.carts.map(element => element.id === productData.id ? { ...element, quantity: element.quantity += 1 } : element);
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
                            quantity: 1,
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
                    quantity: 1,
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

    priceFormat(value) {
        const val = (value/1).toFixed(2).replace(",", ".")
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                        <div className="card-body">
                            <h5 className="card-title">{listingProduct.name}</h5>
                            <p className="carts-text">{elementList.price} per {elementList.unit_of_measure}</p>
                            <button className="btn btn-primary" onClick={() => this.checkScannedBarcode(listingProduct.barcode)}>Add to carts</button>
                        </div>
                    </div>
                </div>
            )
        })
    }

    renderProductScannedModal() {
        if (!Object.keys(this.state.lastProduct).length) {
            return (
                <>
                    <div></div>
                    <div className="product-scanned text-end">
                        <label>
                            {this.priceFormat(0)}
                        </label>
                    </div>
                </>
            )
        }
        return (
            <>
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
                        {this.priceFormat(this.state.lastProduct.price)}
                    </label>
                </div>
            </>
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

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-6">
                        <div className="row">
                            {this.renderLookUpProducts()}
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex justify-content-between border">
                            {this.renderProductScannedModal()}
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Barcode</th>
                                    <th>Product</th>
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
                    <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                    <button className="btn btn-success" onClick={this.showUserCheckoutModal}>Checkout</button>
                </div>
            </div>
        )
    }
}

export default UserDashboard;
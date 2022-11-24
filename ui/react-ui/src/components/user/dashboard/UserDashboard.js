import React from 'react';
import { toast } from 'react-toastify';

import * as onScan from 'onscan.js';

import './Dashboard.css';
import axios from '../../../utils/axios';
import Toast from "../../../utils/toast";

class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            listing: [],
            cart: [],
        };

        this.getProducts();
        this.getListing();
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
            let isExistInCart = this.state.cart.find(element => element.id === parseInt(productData.id));
            if (isExistInCart) {
                let newState = this.state.cart.map(element => element.id === productData.id ? { ...element, quantity: element.quantity += 1 } : element);
                this.setState({
                    cart: newState
                });
            } else {
                this.setState({
                    cart: [
                        ...this.state.cart,
                        {
                            id: productData.id,
                            barcode: productData.barcode,
                            name: productData.name,
                            quantity: 1,
                            price: listingProduct.price
                        },
                    ]
                });
            }
        } else {
            toast.error("Barcode not found.");
        }
    }

    priceFormat(value) {
        const val = (value/1).toFixed(2).replace(",", ".")
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    renderTotalAmount() {
        if (!this.state.cart.length) {
            return (
                <label className="total-amount">{this.priceFormat(0)}</label>
            )
        }
        let totalAmount = 0;
        this.state.cart.forEach(element => {
            totalAmount += (element.price * element.quantity);
        });
        return (
            <label className="total-amount">{this.priceFormat(totalAmount)}</label>
        )
    }

    renderCartData() {
        if (!this.state.cart.length) {
            return (
                <tr>
                    <td colSpan="100%"><div style={{height: "20px"}}></div></td>
                </tr>
            )
        }
        return this.state.cart.map(element => {
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
                <div className="text-end">
                    {this.renderTotalAmount()}
                </div>
                <div>
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
                <div>
                    <button className="btn btn-danger" onClick={this.logout}>Logout</button>
                </div>
            </div>
        )
    }
}

export default UserDashboard;
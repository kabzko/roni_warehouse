import React from "react";
import { Link } from "react-router-dom";

import axios from "../../../utils/axios";
import "./SideNav.css"

class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
        };

        this.logout = this.logout.bind(this);
    }

    logout() {
        axios.post("/api/logout/", {}).then(res => {
            window.location.reload();
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div className="position-sticky pt-3 sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <Link className={(this.state.active === "dashboard") ? "nav-link active" : "nav-link"} to="/web/admin/dashboard">
                                <span className="align-text-bottom">
                                    <i className="bi bi-house"></i>
                                    Dashboard
                                </span>
                            </Link>
                        </li>
                        {
                            sessionStorage.getItem("user_type") === "admin" ? <li className="nav-item">
                                <Link className={(this.state.active === "users-list") ? "nav-link active" : "nav-link"} to="/web/admin/users">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-people-fill"></i>
                                        Users
                                    </span>
                                </Link>
                            </li> : null
                        }
                        {
                            sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "inventory" ? <li className="nav-item">
                                <Link className={(this.state.active === "products") ? "nav-link active" : "nav-link"} to="/web/admin/products">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-box-seam"></i>
                                        Products
                                    </span>
                                </Link>
                            </li> : null
                        }
                        {
                            sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "inventory" ? <li className="nav-item">
                                <Link className={(this.state.active === "stock-in") ? "nav-link active" : "nav-link"} to="/web/admin/stock-in">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-box-arrow-in-down-right"></i>
                                        Stock In
                                    </span>
                                </Link>
                            </li> : null
                        }
                        {
                            sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "inventory" ? <li className="nav-item">
                                <Link className={(this.state.active === "stock-out") ? "nav-link active" : "nav-link"} to="/web/admin/stock-out">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-box-arrow-up-right"></i>
                                        Stock Out
                                    </span>
                                </Link>
                            </li> : null
                        }
                        {
                            sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "pointOfSale" ? <li className="nav-item">
                                <Link className={(this.state.active === "listing") ? "nav-link active" : "nav-link"} to="/web/admin/listing">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-list-ul"></i>
                                        Listing
                                    </span>
                                </Link>
                            </li> : null
                        }
                        {
                            sessionStorage.getItem("user_type") === "admin" || sessionStorage.getItem("user_type") === "pointOfSale" ? <li className="nav-item">
                                <Link className={(this.state.active === "invoice") ? "nav-link active" : "nav-link"} to="/web/admin/invoice">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-receipt-cutoff"></i>
                                        Invoice
                                    </span>
                                </Link>
                            </li> : null
                        }
                        {
                            sessionStorage.getItem("user_type") === "admin" ? <li className="nav-item">
                                <Link className={(this.state.active === "sales") ? "nav-link active" : "nav-link"} to="/web/admin/sales">
                                    <span className="align-text-bottom">
                                        <i className="bi bi-graph-up-arrow"></i>
                                        Sales
                                    </span>
                                </Link>
                            </li> : null
                        }
                        <li className="nav-item" onClick={this.logout}>
                            <span className="nav-link" style={{cursor: "pointer"}}>
                                <span className="align-text-bottom">
                                    <i className="bi bi-door-open"></i>
                                    Logout
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default SideNav;
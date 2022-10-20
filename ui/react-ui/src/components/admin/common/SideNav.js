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
                        <li className="nav-item">
                            <Link className={(this.state.active === "users-list") ? "nav-link active" : "nav-link"} to="/web/admin/users">
                                <span className="align-text-bottom">
                                    <i className="bi bi-people-fill"></i>
                                    Users
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={(this.state.active === "products") ? "nav-link active" : "nav-link"} to="/web/admin/products">
                                <span className="align-text-bottom">
                                    <i className="bi bi-box-seam"></i>
                                    Products
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={(this.state.active === "stock-in") ? "nav-link active" : "nav-link"} to="/">
                                <span className="align-text-bottom">
                                    <i className="bi bi-box-arrow-in-down-right"></i>
                                    Stock In
                                </span>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={(this.state.active === "stock-out") ? "nav-link active" : "nav-link"} to="/">
                                <span className="align-text-bottom">
                                    <i className="bi bi-box-arrow-up-right"></i>
                                    Stock Out
                                </span>
                            </Link>
                        </li>
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
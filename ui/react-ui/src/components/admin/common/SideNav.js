import React from "react";
import { Link } from "react-router-dom";

import "./SideNav.css"

class SideNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
        };
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
                    </ul>
                </div>
            </nav>
        )
    }
}

export default SideNav;
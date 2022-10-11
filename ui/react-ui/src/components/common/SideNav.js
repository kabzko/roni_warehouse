import React from "react";

import "./SideNav.css"

class SideNav extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
                <div className="position-sticky pt-3 sidebar-sticky">
                    <ul className="nav flex-column">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">
                                <span className="align-text-bottom">
                                    <i className="bi bi-house"></i>
                                    Dashboard
                                </span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span className="align-text-bottom">
                                    <i className="bi bi-box"></i>
                                    Inventories
                                </span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                <span className="align-text-bottom">
                                    <i className="bi bi-bar-chart-line"></i>
                                    Stocks
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default SideNav;
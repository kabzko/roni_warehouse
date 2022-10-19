import React from "react";

import "./SideNav.css"

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                    <span className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">Admin | Roni's Warehouse</span>
                    <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </header>
            </div>
        )
    }
}

export default Header;
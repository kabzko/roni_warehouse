import React from "react";

import "./SideNav.css"
import axios from "../../utils/axios";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            <div>
                <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">User name</a>
                    <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="navbar-nav">
                        <div className="nav-item text-nowrap">
                            <button className="btn btn-link nav-link px-3" onClick={this.logout}>Sign out</button>
                        </div>
                    </div>
                </header>
            </div>
        )
    }
}

export default Header;
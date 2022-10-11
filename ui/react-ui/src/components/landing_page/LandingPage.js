import React from 'react';
import { Link } from "react-router-dom";

import "./LandingPage.css"

class LandingPage extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="d-flex h-100 text-center text-bg-dark landing-page">
                <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
                    <header className="mb-auto">
                        <div>
                            <h3 className="float-md-start mb-0">Roni's warehouse</h3>
                            <nav className="nav nav-masthead justify-content-center float-md-end">
                                <a className="nav-link fw-bold py-1 px-0 active" aria-current="page" href="/">Home</a>
                            </nav>
                        </div>
                    </header>

                    <main className="px-3">
                        <h1>Corporation whole management System</h1>
                        <p className="lead">
                            Warehouse management and a point of sale all in one system <br></br>
                            Manage your inventories online easily
                        </p>
                        <p className="lead">
                            <Link className="btn btn-lg btn-secondary fw-bold border-white bg-white" to="/web/login">
                                Click here to login
                            </Link>
                        </p>
                    </main>

                    <footer className="mt-auto text-white-50">
                        <p>IT321 Capstone Project and Research 1</p>
                    </footer>
                </div>
            </div>
        );
    }
}

export default LandingPage;
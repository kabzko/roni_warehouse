import React from 'react';

import "./Login.css"
import axios from '../../utils/axios';
import alert from '../../utils/alert';

class AdminLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "mobile_number": "",
            "password": "",
        }

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    inputChange(input_name, event) {
        if (event.keyCode) {
            if (event.keyCode === 13) {
                this.handleSubmit(event);
            }
        } else {
            let updated_field = {};
            updated_field[input_name] = event.target.value;
            this.setState({...updated_field});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let data = {...this.state};
        data["login_as"] = "admin";
        
        axios.post("/api/login/", data).then(res => {
            window.location.href ="/web/admin/dashboard";
        }).catch(error => {
            let error_msg = error.response.data.message;
            alert(error_msg, "danger", "error-notification");
        })
    }

    render() {
        return (
            <div className='text-center login-container'>
                <main className="form-signin w-100 m-auto">
                    <div>
                        <img className="mb-4" src="/static/img/logo192.png" alt="" width="70" height="70"></img>
                        <h1 className="h3 mb-3 fw-normal">Admin | log in</h1>

                        <div className="form-floating">
                            <input
                                type="text" className="form-control"
                                id="floatingInput" placeholder="0905xxxxxxx"
                                value={this.state.mobile_number}
                                onChange={this.inputChange.bind(this, "mobile_number")}
                                onKeyUp={this.inputChange.bind(this, "mobile_number")}>
                            </input>
                            <label htmlFor="floatingInput">Mobile number</label>
                        </div>

                        <div className="form-floating">
                            <input
                                type="password" className="form-control"
                                id="floatingPassword" placeholder="Password"
                                value={this.state.password}
                                onChange={this.inputChange.bind(this, "password")}
                                onKeyUp={this.inputChange.bind(this, "password")}>
                            </input>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>

                        <div id="error-notification" className="mt-2"></div>

                        <button className="w-100 btn btn-lg btn-primary" onClick={this.handleSubmit}>Log in</button>
                        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
                    </div>
                </main>
            </div>
        );
    }
}

export default AdminLogin;
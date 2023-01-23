import React from 'react';

import "./Login.css"
import axios from '../../utils/axios';
import alert from '../../utils/alert';

class AdminLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "email": "",
            "password": "",
            "login_as": "",
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
            if (input_name === "email") {
                if (this.isEmail(event.target.value)) {
                    updated_field["login_as"] = "admin";
                } else {
                    updated_field["login_as"] = "cashier";
                }
            }
            this.setState({...updated_field});
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        let data = {...this.state};
        data["login_as"] = this.state.login_as;
        
        axios.post("/api/login/", data).then((res) => {
            localStorage.setItem("user_type", res.data.user_type);
            if (res.data.user_type === "cashier") {
                window.location.href ="/web/user/dashboard";
            } else {
                window.location.href ="/web/admin/dashboard";
            }
        }).catch(error => {
            let error_msg = error.response.data.message;
            alert(error_msg, "danger", "error-notification");
        })
    }

    isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

    render() {
        return (
            <div className='text-center login-container'>
                <main className="form-signin w-100 m-auto">
                    <div>
                        <div className="form-floating">
                            <input
                                type="email" className="form-control"
                                id="floatingInput" placeholder="email"
                                value={this.state.email}
                                autoComplete="off"
                                onChange={this.inputChange.bind(this, "email")}
                                onKeyUp={this.inputChange.bind(this, "email")}>
                            </input>
                            <label htmlFor="floatingInput">Username</label>
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

                        <button className="w-100 btn btn-lg btn-primary mt-3" onClick={this.handleSubmit}>Log in</button>
                    </div>
                </main>
            </div>
        );
    }
}

export default AdminLogin;
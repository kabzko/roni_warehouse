import React from 'react';

import "./Login.css"

class Login extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className='text-center login-container'>
                <main className="form-signin w-100 m-auto">
                    <form>
                        <img className="mb-4" src="/static/img/logo192.png" alt="" width="70" height="70"></img>
                        <h1 className="h3 mb-3 fw-normal">Please log in</h1>
                
                        <div className="form-floating">
                            <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"></input>
                            <label htmlFor="floatingInput">Email address</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" className="form-control" id="floatingPassword" placeholder="Password"></input>
                            <label htmlFor="floatingPassword">Password</label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type="submit">Log in</button>
                        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
                    </form>
                </main>
            </div>
        );
    }
}

export default Login;
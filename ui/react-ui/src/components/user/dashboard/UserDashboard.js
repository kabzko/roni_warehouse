import React from 'react';

import * as onScan from 'onscan.js';

class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
        };
    }

    componentDidMount() {
        onScan.attachTo(document);
        document.addEventListener("scan", function(sScancode, iQuantity) {
            console.log(sScancode.detail.scanCode, sScancode.detail.qty); 
        });
    }

    componentWillUnmount() {
        onScan.detachFrom(document);
        document.removeEventListener("scan");
    }

    render() {
        return (
            <div>
                <div>
                    <span>10000</span>
                </div>
                <div>
                    <table>
                        <thead>

                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
                <div>

                </div>
            </div>
        )
    }
}

export default UserDashboard;
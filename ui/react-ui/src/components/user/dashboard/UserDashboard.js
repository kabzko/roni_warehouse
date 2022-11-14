import React from 'react';

class UserDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props,
        };
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
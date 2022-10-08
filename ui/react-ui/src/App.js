import React from 'react';

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            "greetings": "Hello World"
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    {this.state.greetings}
                </header>
            </div>
        );
    }
}

export default App;

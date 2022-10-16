import { createRoot } from 'react-dom/client';
import React from "react";

class Toast extends React.Component {
    constructor(props) {
        super(props);
        
        if (!props) {
            props = {
                header: "This is a toast message",
                class: "primary",
                delay: 5000,
            }
        }

        this.state = {...props};
        this.handleClose = this.handleClose.bind(this);
    }

    static success(message) {
        let props = {
            class: "primary",
            message: message,
        }
        
        this.create(props);
    }

    static warning(message) {
        let props = {
            class: "warning",
            message: message,
        }
        
        this.create(props);
    }

    static info(message) {
        let props = {
            class: "info",
            message: message,
        }
        
        this.create(props);
    }

    static error(message) {
        let props = {
            class: "danger",
            message: message,
        }
        
        this.create(props);
    }

    static create(props={}) {
        if (document.getElementById("custom-toast-container")) {
            document.getElementById("custom-toast-container").remove();
        }

        let containerElement = document.createElement('div');
        containerElement.id = "custom-toast-container";
        containerElement.className = "toast-container position-fixed top-0 end-0 p-3";

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<Toast {...props} />);
    }

    componentDidMount() {
        const toast = new window.bootstrap.Toast(document.getElementById("custom-toast"), {
            delay: this.state.delay ? this.state.delay : 5000,
        })
        toast.show();

        this.setState({"toast": toast});
    }

    handleClose(event) {
        event.preventDefault();
        this.disposeModal();
    }

    disposeModal() {
        let { toast } = this.state;
        toast.hide();
        document.getElementById("custom-toast-container").remove();
    }

    render() {
        return (
            <div className={"toast align-items-center border-0 text-bg-" + this.state.class}
                role="alert" aria-live="assertive" aria-atomic="true" id="custom-toast">
                <div className="d-flex">
                    <div className="toast-body">
                        {this.state.message}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={this.handleClose}></button>
                </div>
            </div>
        )
    }
}

export default Toast;
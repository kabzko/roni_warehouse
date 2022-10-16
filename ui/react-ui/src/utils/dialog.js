import { createRoot } from 'react-dom/client';
import React from "react";

class ConfirmDialog extends React.Component {
    constructor(props) {
        super(props);
        
        if (!props) {
            props = {
                header: "Are you sure?",
                text: "",
                confirmButtonText: "Yes",
                cancelButtonText: "Cancel",
                confirmSuccess: null
            }
        }

        this.state = {...props};
        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    static create(props={}) {
        let containerElement = document.getElementById("confirm-dialog-container");

        if (!containerElement) {
            containerElement = document.createElement('div');
            containerElement.id = "confirm-dialog-container"
        }

        document.body.appendChild(containerElement);

        const root = createRoot(containerElement);
        return root.render(<ConfirmDialog {...props} />);
    }

    componentDidMount() {
        const modal = new window.bootstrap.Modal('#custom-dialog-modal', {
            keyboard: false
        })
        modal.show();

        this.setState({"modal": modal});
    }

    handleConfirm(event) {
        event.preventDefault();
        this.state.confirmSuccess();
        this.disposeModal();
    }

    handleClose(event) {
        event.preventDefault();
        this.disposeModal();
    }

    disposeModal() {
        let { modal } = this.state;
        modal.hide();
        document.getElementById("confirm-dialog-container").remove();
    }

    render() {
        return (
            <div className="modal fade" tabIndex="-1" id="custom-dialog-modal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.state.header || "Are you sure?"}</h5>
                            <button type="button" className="btn-close" onClick={this.handleClose}></button>
                        </div>
                        <div className="modal-body">
                            <p>{this.state.text || ""}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={this.handleClose}>
                                {this.state.cancelButtonText || 'Cancel'}
                            </button>
                            <button type="button" className="btn btn-primary" onClick={this.handleConfirm}>
                                {this.state.confirmButtonText || 'Yes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConfirmDialog;
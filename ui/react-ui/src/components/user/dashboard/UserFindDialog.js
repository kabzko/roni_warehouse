import React from "react";
import { createRoot } from "react-dom/client";

class UserFindDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: props.listing,
      copyListing: props.listing,
      search: "",
    };

    this.modal = null;
    this.handleCancel = this.handleCancel.bind(this);
  }

  static show(props) {
    let containerElement = document.getElementById("listing-dialog-container");
    if (!containerElement) {
      containerElement = document.createElement("div");
      containerElement.id = "listing-dialog-container";
    }

    document.body.appendChild(containerElement);

    const root = createRoot(containerElement);
    return root.render(<UserFindDialog {...props} />);
  }

  componentDidMount() {
    this.modal = new window.bootstrap.Modal("#custom-dialog-modal", {
      keyboard: false,
    });
    this.modal.show();

    setTimeout(() => {
      this.quantityInput.focus();
    }, 500);
    document.addEventListener("keydown", this.keyCommand);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown");
  }

  keyCommand = (event) => {
    if (event.key === "Escape") {
      this.handleCancel(event);
      return;
    }
  }

  priceFormat(value) {
    const val = (value / 1).toFixed(2).replace(",", ".");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  searchChange({ target }) {
    if (!target.value) {
      this.setState({ listing: this.state.copyListing });
      this.setState({ search: target.value });
      return;
    }
    this.setState({ search: target.value }, () => {
      let searchListing = this.state.copyListing.filter(
        (element) =>
          element.name
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          element.barcode
            .toLowerCase()
            .includes(this.state.search.toLowerCase())
      );
      this.setState({ listing: searchListing });
    });
  }

  renderLookUpProducts() {
    if (!this.state.listing.length && this.state.search) {
      return (
        <tr>
          <td>We can't find your looking for...</td>
        </tr>
      );
    }
    if (!this.state.listing.length) {
      return (
        <tr>
          <td>List the stock products to display...</td>
        </tr>
      );
    }
    return this.state.listing.map((elementList) => {
      return (
        <tr key={elementList.id}>
          <td>{elementList.barcode}</td>
          <td>{elementList.name}</td>
          <td>{elementList.net_weight}</td>
          <td>{this.priceFormat(elementList.price)}</td>
        </tr>
      );
    });
  }

  handleCancel(event) {
    event.preventDefault();
    this.modal.hide();
    document.getElementById("listing-dialog-container").remove();
  }

  render() {
    return (
      <div
        className="modal modal-lg fade"
        id="custom-dialog-modal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        data-bs-backdrop="static"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Products
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={this.handleCancel}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="mb-3 search-list custom-scrollbar"
                style={{ height: this.state.windowHeight }}
              >
                <div className="input-group mb-3">
                  <input
                    ref={(input) => {
                      this.quantityInput = input;
                    }}
                    type="text"
                    name="search"
                    className="form-control"
                    placeholder="Search here..."
                    autoComplete="off"
                    value={this.state.search}
                    onChange={this.searchChange.bind(this)}
                  />
                </div>
                <table className="table table-borderedless border">
                  <thead>
                    <tr>
                      <th>BARCODE</th>
                      <th>NAME</th>
                      <th>NET WEIGHT</th>
                      <th>PRICE</th>
                    </tr>
                  </thead>
                  <tbody>{this.renderLookUpProducts()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserFindDialog;

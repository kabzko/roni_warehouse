import React from "react";
import { createRoot } from "react-dom/client";
import Select from "react-select";

import axios from "../../../utils/axios";
import alert from "../../../utils/alert";

const productOptions = [];
let stockOutOptions = [];

class UpdateCreateListingDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: props.product ? props.product : "",
      stock_out: props.stock_out ? props.stock_out : "",
      price: props.price ? props.price : "",
    };

    if (props.id) {
      this.state["id"] = props.id;
    }

    if (props.products) {
      productOptions.splice(0, productOptions.length);
      props.products.map((prod) => {
        productOptions.push({
          value: prod.id,
          label: prod.name,
        });
        return prod;
      });
    }

    if (props.product) {
      this.state.product = this.getProduct(props.product);
    }

    if (props.stockOutOptions) {
      stockOutOptions.splice(0, stockOutOptions.length);
      const filteredStockOutDatas = this.state.product
        ? props.stockOutOptions.filter(
            (element) => element.product === parseInt(this.state.product.value)
          )
        : props.stockOutOptions;
      filteredStockOutDatas.map((stock) => {
        let stockInDatas = props.stockInOptions.find(
          (element) => element.id === parseInt(stock.stock_in)
        );
        let stockOut = {};
        stockOut["value"] = stock.id;

        let product = this.getProduct(stock.product);
        stockOut[
          "label"
        ] = `${product.label} (${stock.quantity} ${stockInDatas.unit_of_measure})`;

        stockOutOptions.push(stockOut);
        return stock;
      });
    }

    if (props.stock_out) {
      this.state["stock_out"] = this.getStockOut(props.stock_out);
    }

    this.modal = null;
    this.handleSaveListing = this.handleSaveListing.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.selectStockOutChange = this.selectStockOutChange.bind(this);
    this.selectProductChange = this.selectProductChange.bind(this);
    this.selectUnitOfMeasureChange = this.selectUnitOfMeasureChange.bind(this);
  }

  static show(props) {
    let containerElement = document.getElementById("listing-dialog-container");
    if (!containerElement) {
      containerElement = document.createElement("div");
      containerElement.id = "listing-dialog-container";
    }

    document.body.appendChild(containerElement);

    const root = createRoot(containerElement);
    return root.render(<UpdateCreateListingDialog {...props} />);
  }

  componentDidMount() {
    this.modal = new window.bootstrap.Modal("#custom-dialog-modal", {
      keyboard: false,
    });
    this.modal.show();
  }

  getProduct(productId) {
    let product;

    for (let i in productOptions) {
      if (productOptions[i].value === productId) {
        product = productOptions[i];
        break;
      }
    }

    return product;
  }

  getStockOut(stockOutId) {
    let stock_out = [];

    stock_out = stockOutOptions.filter((element) =>
      stockOutId.includes(element.value)
    );

    return stock_out;
  }

  inputChange(input_name, event) {
    let updated_field = {};
    updated_field[input_name] = event.target.value;
    this.setState({ ...updated_field });
  }

  selectProductChange(selectedOption) {
    stockOutOptions.splice(0, stockOutOptions.length);
    const filteredStockOutDatas = this.props.stockOutOptions.filter(
      (element) => element.product === parseInt(selectedOption.value)
    );
    filteredStockOutDatas.map((stock) => {
      let stockInDatas = this.props.stockInOptions.find(
        (element) => element.id === parseInt(stock.stock_in)
      );
      let stockOut = {};
      stockOut["value"] = stock.id;

      let product = this.getProduct(stock.product);
      stockOut[
        "label"
      ] = `${product.label} (${stock.quantity} ${stockInDatas.unit_of_measure})`;

      stockOutOptions.push(stockOut);
      return stock;
    });
    this.setState({ stock_out: [] });
    this.setState({ product: selectedOption });
  }

  selectStockOutChange(selectedOption) {
    this.setState({ stock_out: selectedOption });
  }

  selectUnitOfMeasureChange(selectedOption) {
    this.setState({ unit_of_measure: selectedOption });
  }

  handleSaveListing(event) {
    event.preventDefault();
    let data = { ...this.state };
    let api_url = "/api/listing/";

    if (data.id) {
      api_url = `/api/listing/${data.id}/`;
    }

    if (data.product) {
      data["product"] = data.product.value;
    }

    if (data.stock_out) {
      data["stock_out"] = data.stock_out.map((element) => element.value);
    }

    const stockOutDatas = this.props.stockOutOptions.filter((element) =>
      data.stock_out.includes(element.id)
    );
    const stockInDatas = this.props.stockInOptions.find(
      (element) => element.id === parseInt(stockOutDatas[0].stock_in)
    );
    data["unit_of_measure"] = stockInDatas.unit_of_measure;

    if (data.quantity) {
      if (data.quantity > data.available_stock) {
        return alert(
          "Quantity must less than the available stocks!",
          "danger",
          "error-notification"
        );
      }
    }

    axios
      .post(api_url, data)
      .then((res) => {
        alert(res.data, "success", "success-notification");
        this.props.callBackSave();

        if (!data.id) {
          this.setState({
            product: "",
            stock_out: "",
            price: "",
            available_stock: 0,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message, "danger", "error-notification");
      });
  }

  handleClose(event) {
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
                {this.props.id ? "Update listing" : "Create listing"}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={this.handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-2">
                  {this.props.id ? (
                    <div className="col-sm-6">
                      <label
                        htmlFor="product-name"
                        className="col-form-label text-end"
                      >
                        <span className="text-danger">*</span>Product:
                      </label>
                      <div>
                        <Select value={this.state.product} isDisabled={true} />
                      </div>
                    </div>
                  ) : (
                    <div className="col-sm-6">
                      <label
                        htmlFor="product-name"
                        className="col-form-label text-end"
                      >
                        <span className="text-danger">*</span>Product:
                      </label>
                      <div>
                        <Select
                          value={this.state.product}
                          onChange={this.selectProductChange}
                          options={productOptions}
                        />
                      </div>
                    </div>
                  )}
                  {this.state.product ? (
                    <div className="col-sm-6">
                      <label
                        htmlFor="listing"
                        className="col-form-label text-end"
                      >
                        <span className="text-danger">*</span>Stock Out:
                      </label>
                      <div>
                        <Select
                          value={this.state.stock_out}
                          onChange={this.selectStockOutChange}
                          options={stockOutOptions}
                          isMulti
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="col-sm-6">
                      <label
                        htmlFor="listing"
                        className="col-form-label text-end"
                      >
                        <span className="text-danger">*</span>Stock Out:
                      </label>
                      <div>
                        <Select isDisabled={true} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="row mb-2">
                  <div className="col-sm-6">
                    <label htmlFor="price" className="col-form-label text-end">
                      <span className="text-danger">*</span>Price:
                    </label>
                    <div>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        placeholder="Enter here.."
                        onChange={this.inputChange.bind(this, "price")}
                        value={this.state.price}
                      ></input>
                    </div>
                  </div>
                </div>

                <div
                  id="error-notification"
                  style={{ position: "sticky", bottom: 0 }}
                ></div>
                <div
                  id="success-notification"
                  style={{ position: "sticky", bottom: 0 }}
                ></div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-light"
                id="close-user-modal"
                onClick={this.handleClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.handleSaveListing}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateCreateListingDialog;

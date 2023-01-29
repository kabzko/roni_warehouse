import React from "react";
import { createRoot } from "react-dom/client";
import Select from "react-select";

import axios from "../../../utils/axios";
import alert from "../../../utils/alert";
import Toast from "../../../utils/toast";

const productOptions = [];
const supplierOptions = [];
const truckDriverOptions = [];
const unitOfMeasureOptions = [
  {
    value: "pieces",
    label: "Pieces",
  },
  {
    value: "bundle",
    label: "Bundle",
  },
  {
    value: "box",
    label: "Box",
  },
];

class UpdateCreateStockInDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: props.list ? [...props.list] : [],
      supplier: props.supplier ? props.supplier : "",
      checked_by: props.checked_by ? props.checked_by : "",
      received_by: props.received_by ? props.received_by : "",
      sales_invoice_no: props.sales_invoice_no ? props.sales_invoice_no : "",
      truck_plate_number: props.truck_plate_number
        ? props.truck_plate_number
        : "",
      new_truck_driver: props.new_truck_driver ? props.new_truck_driver : "",
      date: props.date ? props.date : "",
      products: props.products ? props.products : [],
    };

    if (props.id) {
      this.state["id"] = props.id;
    }

    if (props.truck_drivers) {
      truckDriverOptions.splice(0, truckDriverOptions.length);
      props.truck_drivers.map((driver) => {
        let option = {
          value: driver.id,
          label: driver.name,
        };

        truckDriverOptions.push(option);

        if (props.new_truck_driver && props.new_truck_driver === driver.id) {
          this.state.new_truck_driver = option;
        }

        return driver;
      });
    }

    this.getSuppliers();

    for (let i in this.state.list) {
      let unit_of_measure = this.state.list[i]["unit_of_measure"];

      if (unit_of_measure && typeof unit_of_measure !== "object") {
        this.state.list[i]["unit_of_measure"] =
          this.getUnitOfMeasure(unit_of_measure);
      }
    }

    if (this.state.list.length === 0) {
      this.state.list.push(this.getEmptyList());
    }

    this.modal = null;
    this.handleSaveStockIn = this.handleSaveStockIn.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static show(props) {
    let containerElement = document.getElementById("stock-in-dialog-container");
    if (!containerElement) {
      containerElement = document.createElement("div");
      containerElement.id = "stock-in-dialog-container";
    }

    document.body.appendChild(containerElement);

    const root = createRoot(containerElement);
    return root.render(<UpdateCreateStockInDialog {...props} />);
  }

  componentDidMount() {
    this.modal = new window.bootstrap.Modal("#custom-dialog-modal", {
      keyboard: false,
    });
    this.modal.show();
  }

  getSupplierOption(supplier_id) {
    let supplier;

    for (let i in supplierOptions) {
      if (supplierOptions[i].value === supplier_id) {
        supplier = supplierOptions[i];
        break;
      }
    }

    return supplier;
  }

  getSuppliers() {
    axios
      .get("/api/suppliers/")
      .then((res) => {
        supplierOptions.splice(0, supplierOptions.length);
        res.data.map((supplier) => {
          supplierOptions.push({
            value: supplier.id,
            label: supplier.name,
          });

          return supplier;
        });

        if (this.state.supplier) {
          let supplier = this.getSupplierOption(this.state.supplier);
          this.setState({ supplier: supplier });
          this.selectSupplierChange(supplier);
        }
      })
      .catch((error) => {
        console.log(error);
        Toast.error(error.response.data.message);
      });
  }

  getProducts(event) {
    event.preventDefault();
    axios
      .get("/api/products/")
      .then((res) => {
        this.setState({ products: res.data }, () => {
          if (this.state.products) {
            productOptions.splice(0, productOptions.length);
            this.state.products.map((prod) => {
              productOptions.push({
                value: prod.id,
                label: prod.name,
              });
              return prod;
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
        Toast.error(error.response.data.message);
      });
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

  getUnitOfMeasure(unit) {
    let unitOfMeasure;

    for (let i in unitOfMeasureOptions) {
      if (unitOfMeasureOptions[i].value === unit) {
        unitOfMeasure = unitOfMeasureOptions[i];
        break;
      }
    }

    return unitOfMeasure;
  }

  getEmptyList() {
    return {
      product: {
        value: "",
        label: "",
      },
      unit_of_measure: {
        value: "",
        label: "",
      },
      price: 0,
      quantity: 0,
      number_of_pieces: 0,
    };
  }

  inputChange(input_name, event) {
    let updated_field = {};
    updated_field[input_name] = event.target.value;
    this.setState({ ...updated_field });
  }

  listInputChange(input_name, index, event) {
    let data = { ...this.state };
    data["list"][index][input_name] = event.target.value;
    this.setState({
      list: data["list"],
    });
  }

  selectTruckDriverChange(selectedOption) {
    this.setState({ new_truck_driver: selectedOption });
  }

  selectSupplierChange(selectedOption) {
    this.setState({ supplier: selectedOption });

    productOptions.splice(0, productOptions.length);
    this.state.products.map((prod) => {
      if (selectedOption.value === prod.supplier) {
        productOptions.push({
          value: prod.id,
          label: prod.name,
        });
      }

      return prod;
    });

    let data = { ...this.state };

    data["list"].map((list) => {
      if (list.product) {
        if (typeof list.product !== "object") {
          list.product = productOptions.find((el) => el.value === list.product);
        } else {
          if (!productOptions.find((el) => el.value === list.product.value)) {
            list.product = "";
          }
        }
      }

      return list;
    });
  }

  selectProductChange(index, selectedOption) {
    let data = { ...this.state };
    data["list"][index]["product"] = selectedOption;
    this.setState({ list: data["list"] });
  }

  selectUnitOfMeasureChange(index, selectedOption) {
    let data = { ...this.state };
    data["list"][index]["unit_of_measure"] = selectedOption;

    if (selectedOption.value === "pieces") {
      data["list"][index]["number_of_pieces"] = 1;
    }

    this.setState({ list: data["list"] });
  }

  handleSaveStockIn(event) {
    event.preventDefault();
    let data = { ...this.state };
    let api_url = "/api/stock-in/";

    for (let i in data["list"]) {
      if (data["list"][i]["product"]) {
        data["list"][i]["product"] = data["list"][i]["product"]["value"];
      }

      if (data["list"][i]["unit_of_measure"]) {
        data["list"][i]["unit_of_measure"] =
          data["list"][i]["unit_of_measure"]["value"];
      }

      if (data["list"][i]["unit_of_measure"] === "pieces") {
        data["list"][i]["number_of_pieces"] = data["list"][i]["quantity"];
      }
    }

    if (!data.date) {
        data["date"] = new Date().toLocaleDateString("en-CA")
    }

    if (data.supplier) {
      data.supplier = data.supplier.value;
    }

    if (data.new_truck_driver) {
      data.new_truck_driver = data.new_truck_driver.value;
    }

    axios
      .post(api_url, data)
      .then((res) => {
        alert(res.data, "success", "success-notification");
        this.props.callBackSave();

        if (!data.id) {
          this.setState({
            supplier: "",
            checked_by: "",
            received_by: "",
            truck_plate_number: "",
            new_truck_driver: "",
            date: "",
            sales_invoice_no: "",
            list: [this.getEmptyList()],
          });
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message, "danger", "error-notification");
      });
  }

  addNewList(event) {
    event.preventDefault();

    let data = { ...this.state };
    data["list"].push(this.getEmptyList());

    this.setState({
      list: data["list"],
    });
  }

  removeList(index, event) {
    event.preventDefault();
    let data = { ...this.state };
    data["list"].splice(index, 1);

    if (data["list"].length === 0) {
      data["list"].push(this.getEmptyList());
    }

    this.setState({
      list: data["list"],
    });
  }

  handleClose(event) {
    event.preventDefault();
    this.modal.hide();
    document.getElementById("stock-in-dialog-container").remove();
  }

  render() {
    return (
      <div
        className="modal modal-xl fade"
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
                {this.props.id ? "Update stock in" : "Create stock in"}
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
                <h5>Details</h5>
                <div className="row mb-2">
                  <div className="col-sm-4">
                    <label htmlFor="date" className="col-form-label">
                      <span className="text-danger">*</span>Date:
                    </label>
                    <div>
                      <input
                        type="date"
                        className="form-control"
                        id="date"
                        placeholder="Enter here.."
                        onChange={this.inputChange.bind(this, "date")}
                        value={
                          this.state.date ||
                          new Date().toLocaleDateString("en-CA")
                        }
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="supplier-name"
                      className="col-form-label text-end"
                    >
                      <span className="text-danger">*</span> Supplier:
                    </label>
                    <div>
                      <Select
                        value={this.state.supplier}
                        onChange={this.selectSupplierChange.bind(this)}
                        options={supplierOptions}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="sales-invoice-number"
                      className="col-form-label text-end"
                    >
                      Sales Invoice Number:
                    </label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        id="sales-invoice-number"
                        placeholder="Enter here.."
                        onChange={this.inputChange.bind(
                          this,
                          "sales_invoice_no"
                        )}
                        value={this.state.sales_invoice_no}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="truck-driver"
                      className="col-form-label text-end"
                    >
                      Truck driver:
                    </label>
                    <div>
                      <Select
                        value={this.state.new_truck_driver}
                        onChange={this.selectTruckDriverChange.bind(this)}
                        options={truckDriverOptions}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="truck-plate-number"
                      className="col-form-label text-end"
                    >
                      Truck plate number:
                    </label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        id="truck-plate-number"
                        placeholder="Enter here.."
                        onChange={this.inputChange.bind(
                          this,
                          "truck_plate_number"
                        )}
                        value={this.state.truck_plate_number}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="received-by"
                      className="col-form-label text-end"
                    >
                      Received by:
                    </label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        id="received-by"
                        placeholder="Enter here.."
                        onChange={this.inputChange.bind(this, "received_by")}
                        value={this.state.received_by}
                      ></input>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="checked-by"
                      className="col-form-label text-end"
                    >
                      Checked by:
                    </label>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        id="checked-by"
                        placeholder="Enter here.."
                        onChange={this.inputChange.bind(this, "checked_by")}
                        value={this.state.checked_by}
                      ></input>
                    </div>
                  </div>
                </div>

                <hr></hr>
                <div className="d-flex align-items-center">
                  <div>
                    <h5>Stocks</h5>
                  </div>
                  <div className="ms-2">
                    <button
                      className="btn btn-sm btn-primary"
                      style={{marginBottom: "10px"}}
                      onClick={this.getProducts.bind(this)}
                    >
                      Reload products
                    </button>
                  </div>
                </div>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Unit of Measure</th>
                      <th>No. of Pieces per UOM</th>
                      <th>Expiration Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.map((el, idx) => {
                      return (
                        <tr key={idx}>
                          <td>
                            <Select
                              value={el.product}
                              onChange={this.selectProductChange.bind(
                                this,
                                idx
                              )}
                              options={productOptions}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              id="price"
                              placeholder="Enter here.."
                              onChange={this.listInputChange.bind(
                                this,
                                "price",
                                idx
                              )}
                              value={el.price}
                            ></input>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              id="quantity"
                              placeholder="Enter here.."
                              onChange={this.listInputChange.bind(
                                this,
                                "quantity",
                                idx
                              )}
                              value={el.quantity}
                            ></input>
                          </td>
                          <td>
                            <Select
                              value={el.unit_of_measure}
                              onChange={this.selectUnitOfMeasureChange.bind(
                                this,
                                idx
                              )}
                              options={unitOfMeasureOptions}
                            />
                          </td>
                          <td>
                            {el.unit_of_measure.value !== "pieces" ? (
                              <input
                                type="number"
                                className="form-control"
                                id="number-of-pieces"
                                placeholder="Enter here.."
                                onChange={this.listInputChange.bind(
                                  this,
                                  "number_of_pieces",
                                  idx
                                )}
                                value={el.number_of_pieces}
                              ></input>
                            ) : (
                              <input
                                type="number"
                                className="form-control"
                                id="number-of-pieces"
                                placeholder="Enter here.."
                                value={el.quantity}
                                disabled
                              ></input>
                            )}
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control"
                              id="expiration_date"
                              placeholder="Enter here.."
                              onChange={this.listInputChange.bind(
                                this,
                                "expiration_date",
                                idx
                              )}
                              value={el.expiration_date}
                            ></input>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={this.removeList.bind(this, idx)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={this.addNewList.bind(this)}
                >
                  Add new
                </button>

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
                onClick={this.handleSaveStockIn}
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

export default UpdateCreateStockInDialog;

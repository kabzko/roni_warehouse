import React from "react";
import { createRoot } from "react-dom/client";

import axios from "../../../utils/axios";
import alert from "../../../utils/alert";

class UpdateViewInvoiceDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: props.sales,
      carts: props.carts,
      users: props.users,
      products: props.products,
    };

    this.modal = null;
    this.handleSaveListing = this.handleSaveListing.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static show(props) {
    let containerElement = document.getElementById("listing-dialog-container");
    if (!containerElement) {
      containerElement = document.createElement("div");
      containerElement.id = "listing-dialog-container";
    }

    document.body.appendChild(containerElement);

    const root = createRoot(containerElement);
    return root.render(<UpdateViewInvoiceDialog {...props} />);
  }

  componentDidMount() {
    this.modal = new window.bootstrap.Modal("#custom-dialog-modal", {
      keyboard: false,
    });
    this.modal.show();
  }

  priceFormat(value) {
    const val = (value / 1).toFixed(2).replace(",", ".");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getUserName(userId) {
    let user;

    for (let i in this.state.users) {
      if (this.state.users[i].id === userId) {
        user = `${this.state.users[i].first_name}`;
        break;
      }
    }

    return user;
  }

  getProductName(productId) {
    let product;

    for (let i in this.state.products) {
      if (this.state.products[i].id === productId) {
        product = this.state.products[i].name;
        break;
      }
    }

    return product;
  }

  inputChange(input_name, event) {
    let updated_field = {};
    updated_field[input_name] = event.target.value;
    this.setState({ ...updated_field });
  }

  printReceipt() {
    var mywindow = window.open("", "PRINT", "fullscreen=yes,width=550");
    mywindow.document.write('<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head>');
    mywindow.document.write('<body>');
    mywindow.document.write(document.getElementById("receipt").innerHTML);
    mywindow.document.write("</body></html>");
    mywindow.document.close();
    setTimeout(() => {
      mywindow.focus();
      mywindow.print();
    }, 500);
    setTimeout(() => {
      mywindow.close();
    }, 500);
    return;
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

  renderTransaction() {
    if (!this.state.sales) {
      return null;
    }
    return (
      <page id="receipt">
        <div className="d-inline-block" style={{width: "500px",margin: "25px 0",border: "1px dashed",padding: "20px",}}>
          <div className="text-center">RONI WAREHOUSE CORP.</div>
          <div className="text-center">POB. 1, VILLANUEVA, MIS. OR.</div>
          <div className="text-center">TIN: 493-862-572-000</div>
          <div className="text-center">SN: Z9AXGWFX</div>
          <div className="text-center">MIN: 19082817512052915</div>
          <div className="text-center">PTU: FP082019098022692300000</div>
          <div className="text-center">ACC: 0500003029820000261381</div>
          <table className="table table-borderless mt-2">
            <thead>
              <tr style={{ borderTop: "1px dashed", borderBottom: "1px dashed" }}>
                <th className="text-start">DESC</th>
                <th className="text-end">QTY</th>
                <th>PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody style={{borderBottom: "1px dashed"}}>
              {this.state.carts.map((element) => {
                return (
                  <tr key={element.id}>
                    <td className="text-start">
                      {this.getProductName(element.product)}
                    </td>
                    <td className="text-end">{element.quantity}</td>
                    <td>{this.priceFormat(element.price)}</td>
                    <td className="text-end">
                      {this.priceFormat(element.price * element.quantity)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="d-flex justify-content-between">
            <div>
              <b>SUBTOTAL:</b>
            </div>
            <div>
              {this.priceFormat(
                this.state.sales.total_amount -
                  this.state.sales.total_amount * 0.12
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Vat Amount(12%):</b>
            </div>
            <div>{this.priceFormat(this.state.sales.total_amount * 0.12)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>TOTAL:</b>
            </div>
            <div>{this.priceFormat(this.state.sales.total_amount)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Cash:</b>
            </div>
            <div>{this.priceFormat(this.state.sales.amount_pay)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Change:</b>
            </div>
            <div>
              {this.priceFormat(
                this.state.sales.amount_pay - this.state.sales.total_amount
              )}
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <div>
              <b>Customer:</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Address:</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>TIN:</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>B. Style:</b>
            </div>
            <div></div>
          </div>
          <hr />
          <div className="d-flex justify-content-between">
            <div>
              <b>Vat Sales:</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>12% Vat:</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>VAT-Exempt Sale:</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Zero Rated:</b>
            </div>
            <div></div>
          </div>
          <hr />
          <div className="d-flex">
            <div>
              <b>No. Of Item(s): {this.state.carts.length}</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex">
            <div>
              <b>Receipt No.:&nbsp;</b>
            </div>
            <div>{this.state.sales.reference_no}</div>
          </div>
          <div className="d-flex">
            <div>
              <b>Cashier:&nbsp;</b>
            </div>
            <div>{this.getUserName(this.state.sales.cashier_by)}</div>
          </div>
          <div className="d-flex">
            <div>
              <b>Date:&nbsp;</b>
            </div>
            <div>
              {new Date(this.state.sales.created_at).toLocaleString("en-US")}
            </div>
          </div>
        </div>
      </page>
    );
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
                Invoice
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={this.handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center">{this.renderTransaction()}</div>
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
              <button type="button" className="btn btn-primary" onClick={this.printReceipt}>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UpdateViewInvoiceDialog;

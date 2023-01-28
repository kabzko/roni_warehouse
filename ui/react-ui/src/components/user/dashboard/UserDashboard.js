import React from "react";
import { toast } from "react-toastify";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import UserFindDialog from "./UserFindDialog";

import axios from "../../../utils/axios";

import * as onScan from "onscan.js";

import "./Dashboard.css";

const MySwal = withReactContent(Swal);

class UserDashboard extends React.Component {
  constructor(props) {
    if (localStorage.getItem("user_type") !== "cashier") {
      window.location.href = "/";
    }

    super(props);
    this.state = {
      products: [],
      listing: [],
      carts: [],
      lastProduct: {},
      setQuantity: 1,
      lastTransaction: {},
      windowHeight: window.innerHeight - 350,
      isShowQuantity: false,
      isShowCheckout: false,
    };

    this.callBackSaveListing = this.callBackSaveListing.bind(this);
    this.showUserCheckoutModal = this.showUserCheckoutModal.bind(this);
    this.showFindModal = this.showFindModal.bind(this);

    this.keyCommand = this.keyCommand.bind(this);

    this.getUsers();
    this.getProducts();
    setTimeout(() => {
      this.getListing();
    }, 100);
  }

  callBackSaveListing(referenceNo) {
    this.setState({
      carts: [],
      lastProduct: {},
    });
    this.getLastTransaction(referenceNo);
  }

  componentDidMount() {
    onScan.attachTo(document);
    document.addEventListener("scan", (sScancode, iQuantity) => {
      this.checkScannedBarcode(
        sScancode.detail.scanCode,
        "add",
        this.state.setQuantity
      );
    });
    document.addEventListener("keydown", this.keyCommand);
  }

  componentWillUnmount() {
    onScan.detachFrom(document);
    document.removeEventListener("scan");
    document.removeEventListener("keydown");
  }

  priceFormat(value) {
    const val = (value / 1).toFixed(2).replace(",", ".");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  keyCommand(event) {
    if (event.altKey && event.key === "c") {
      if (!Object.keys(this.state.lastTransaction).length) {
        this.showUserCheckoutModal();
      }
      return;
    }
    if (event.altKey && event.key === "q") {
      if (!Object.keys(this.state.lastTransaction).length) {
        this.setCustomQuantity();
      }
      return;
    }
    if (event.altKey && event.key === "g") {
      if (!Object.keys(this.state.lastTransaction).length) {
        this.showFindModal();
      }
      return;
    }
    if (event.altKey && event.key === "l") {
      this.logout();
      return;
    }
    if (event.altKey && event.key === "n") {
      if (Object.keys(this.state.lastTransaction).length) {
        this.setState({ lastTransaction: {} });
      }
      return;
    }
    if (event.altKey && event.key === "p") {
      if (Object.keys(this.state.lastTransaction).length) {
        this.printReceipt();
      }
      return;
    }
  }

  getUserName(userId) {
    let user;

    for (let i in this.state.users) {
      if (this.state.users[i].id === userId) {
        user = `${this.state.users[i].first_name}`;
        break;
      } else {
        user = "Superadmin";
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

  getProductBarcode(productId) {
    let product;

    for (let i in this.state.products) {
      if (this.state.products[i].id === productId) {
        product = this.state.products[i].barcode;
        break;
      }
    }

    return product;
  }

  getProductNetWeight(productId) {
    let product;

    for (let i in this.state.products) {
      if (this.state.products[i].id === productId) {
        product = this.state.products[i].net_weight;
        break;
      }
    }

    return product;
  }

  updateCart = (e, data) => {
    const newCarts = this.state.carts.find(
      (element) => element.id === parseInt(data.item)
    );
    let swalOptions = {
      title: "Change Quantity",
      input: "text",
      inputPlaceholder: newCarts.quantity,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
    };
    MySwal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {
        this.checkScannedBarcode(newCarts.barcode, "change", result.value);
      }
    });
  };

  removeCart = (e, data) => {
    const newCarts = this.state.carts.filter(
      (element) => element.id !== parseInt(data.item)
    );
    this.setState({ carts: newCarts });
  };

  setCustomQuantity = () => {
    let swalOptions = {
      title: "Enter Quantity",
      input: "text",
      inputPlaceholder: this.state.setQuantity,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
    };
    MySwal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {
        let value = result.value;
        if (!value) {
          value = this.state.setQuantity;
        }
        this.setState({ setQuantity: value });
      }
    });
  };

  logout() {
    MySwal.fire({
      title: "Logging Out?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: false,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post("/api/logout/", {})
          .then((res) => {
            window.location.reload();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }

  printReceipt() {
    var mywindow = window.open("", "PRINT", "fullscreen=yes,width=550");
    mywindow.document.write(
      '<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head>'
    );
    mywindow.document.write("<body>");
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

  getUsers() {
    let api_url = "/api/users/";

    axios
      .get(api_url)
      .then((res) => {
        this.setState({ users: res.data });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }

  getListing() {
    axios
      .get("/api/cashier/listing/")
      .then((res) => {
        res.data.map((data) => {
          data.net_weight = this.getProductNetWeight(data.product);
          data.name = this.getProductName(data.product);
          data.barcode = this.getProductBarcode(data.product);
          return data;
        });
        this.setState({ listing: res.data });
        this.setState({ copyListing: res.data });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }

  getProducts() {
    axios
      .get("/api/products/")
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }

  checkScannedBarcode(scanCode, type, quantity) {
    let productData = this.state.products.find(
      (element) => element.barcode === scanCode
    );
    if (productData) {
      let listingProduct = this.state.listing.find(
        (element) => element.product === parseInt(productData.id)
      );
      let isExistInCart = this.state.carts.find(
        (element) => element.id === parseInt(productData.id)
      );
      if (isExistInCart) {
        let newState = this.state.carts.map((element) =>
          element.id === productData.id
            ? {
                ...element,
                quantity:
                  type === "add"
                    ? (element.quantity =
                        parseInt(element.quantity) + parseInt(quantity))
                    : (element.quantity = quantity),
              }
            : element
        );
        this.setState({
          carts: newState,
        });
      } else {
        this.setState({
          carts: [
            ...this.state.carts.reverse(),
            {
              id: productData.id,
              barcode: productData.barcode,
              name: `${productData.name} ${productData.net_weight}`,
              quantity: quantity,
              price: listingProduct.price,
              unit_of_measure: listingProduct.unit_of_measure,
            },
          ].reverse(),
        });
      }
      if (type !== "change") {
        this.setState({
          lastProduct: {
            id: productData.id,
            barcode: productData.barcode,
            name: `${productData.name} ${productData.net_weight}`,
            quantity: quantity,
            price: listingProduct.price,
            unit_of_measure: listingProduct.unit_of_measure,
          },
        });
      }
      this.setState({ setQuantity: 1 });
    } else {
      toast.error("Barcode not found.");
    }
  }

  showUserCheckoutModal() {
    if (!this.state.carts.length)
      return toast.error("Can't proceed with empty table.");

    let swalOptions = {
      title: "Enter Cash",
      input: "text",
      inputPlaceholder: 0,
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage(
            '<i class="fa fa-info-circle"></i> Cash is required'
          );
        } else {
          let totalAmount = 0;
          this.state.carts.forEach((element) => {
            totalAmount += element.price * element.quantity;
          });
          if (totalAmount > parseInt(value)) {
            Swal.showValidationMessage(
              '<i class="fa fa-info-circle"></i> Enter cash is lesser than the total amount!'
            );
          }
        }
      },
    };
    MySwal.fire(swalOptions).then((result) => {
      if (result.isConfirmed) {
        this.checkout(result.value);
      }
    });
  }

  checkout(amount_pay) {
    let data = {
      carts: this.state.carts,
      amount_pay: amount_pay,
      payment_type: "cash",
    };
    let api_url = "/api/cashier/checkout/";

    axios
      .post(api_url, data)
      .then((res) => {
        this.callBackSaveListing(res.data.reference_no);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  showFindModal() {
    this.checkScannedBarcode("123456789", "add", this.state.setQuantity);
    const listing = {};
    listing["listing"] = this.state.listing;

    UserFindDialog.show({ ...listing });
  }

  getLastTransaction(referenceNo) {
    axios
      .get(`/api/cashier/last-transaction/${referenceNo}`)
      .then((res) => {
        this.setState({ lastTransaction: res.data });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message);
      });
  }

  renderProductScannedModal() {
    if (!Object.keys(this.state.lastProduct).length) {
      return (
        <div className="border">
          <div className="d-flex justify-content-between">
            <div className="product-scanned text-start">
              <label>×{this.priceFormat(this.state.setQuantity)}</label>
            </div>
            <div className="product-scanned text-end">
              <label>{this.priceFormat(0)}</label>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="border">
        <div className="d-flex justify-content-between">
          <div className="product-scanned text-start">
            <label>×{this.priceFormat(this.state.setQuantity)}</label>
          </div>
          <div className="product-scanned text-end">
            <label>
              {this.priceFormat(
                this.state.lastProduct.price * this.state.lastProduct.quantity
              )}
            </label>
          </div>
        </div>
      </div>
    );
  }

  renderTotalAmount() {
    if (!this.state.carts.length) {
      return <label className="total-amount">{this.priceFormat(0)}</label>;
    }
    let totalAmount = 0;
    this.state.carts.forEach((element) => {
      totalAmount += element.price * element.quantity;
    });
    return (
      <label className="total-amount">{this.priceFormat(totalAmount)}</label>
    );
  }

  renderCartData() {
    if (!this.state.carts.length) {
      return (
        <tr>
          <td colSpan="100%">
            <div style={{ height: "25px" }}></div>
          </td>
        </tr>
      );
    }
    return this.state.carts.map((element) => {
      return (
        <>
          <ContextMenu key={element.id} id={element.id}>
            <MenuItem onClick={this.updateCart} data={{ item: element.id }}>
              Change Quantity
            </MenuItem>
            <MenuItem onClick={this.removeCart} data={{ item: element.id }}>
              Remove
            </MenuItem>
          </ContextMenu>
          <tr className="cursor-point">
            <td>
              <ContextMenuTrigger id={element.id} holdToDisplay={1000}>
                {element.barcode}
              </ContextMenuTrigger>
            </td>

            <td>
              <ContextMenuTrigger id={element.id} holdToDisplay={1000}>
                {element.name}
              </ContextMenuTrigger>
            </td>

            <td>
              <ContextMenuTrigger id={element.id} holdToDisplay={1000}>
                {element.quantity}
              </ContextMenuTrigger>
            </td>

            <td>
              <ContextMenuTrigger id={element.id} holdToDisplay={1000}>
                {this.priceFormat(element.price)}
              </ContextMenuTrigger>
            </td>
          </tr>
        </>
      );
    });
    // return (new Array(50).fill('')).map((element) => {
    //   return (
    //     <tr>
    //       <td>1</td>
    //       <td>1</td>
    //       <td>1</td>
    //       <td>1</td>
    //     </tr>
    //   )
    // });
  }

  renderLastTransaction() {
    if (!this.state.lastTransaction) {
      return null;
    }
    return (
      <div id="receipt">
        <div
          className="d-inline-block"
          style={{
            width: "500px",
            margin: "25px 0",
            border: "1px dashed",
            padding: "20px",
          }}
        >
          <div className="text-center">RONI WAREHOUSE CORP.</div>
          <div className="text-center">POB. 1, VILLANUEVA, MIS. OR.</div>
          <div className="text-center">TIN: 493-862-572-000</div>
          <div className="text-center">SN: Z9AXGWFX</div>
          <div className="text-center">MIN: 19082817512052915</div>
          <div className="text-center">PTU: FP082019098022692300000</div>
          <div className="text-center">ACC: 0500003029820000261381</div>
          <table className="table table-borderless mt-2">
            <thead>
              <tr
                style={{ borderTop: "1px dashed", borderBottom: "1px dashed" }}
              >
                <th className="text-start">DESC</th>
                <th className="text-end">QTY</th>
                <th>PRICE</th>
                <th className="text-end">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {this.state.lastTransaction.carts.map((element) => {
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
                this.state.lastTransaction.sales.total_amount -
                  this.state.lastTransaction.sales.total_amount * 0.12
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Vat Amount(12%):</b>
            </div>
            <div>
              {this.priceFormat(
                this.state.lastTransaction.sales.total_amount * 0.12
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>TOTAL:</b>
            </div>
            <div>
              {this.priceFormat(this.state.lastTransaction.sales.total_amount)}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Cash:</b>
            </div>
            <div>
              {this.priceFormat(this.state.lastTransaction.sales.amount_pay)}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Change:</b>
            </div>
            <div>
              {this.priceFormat(
                this.state.lastTransaction.sales.amount_pay -
                  this.state.lastTransaction.sales.total_amount
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
            <div>{this.priceFormat(this.state.lastTransaction.sales.total_amount * 1.12)}</div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>12% Vat:</b>
            </div>
            <div>
              {this.priceFormat(
                this.state.lastTransaction.sales.total_amount * 0.12
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>VAT-Exempt Sale:</b>
            </div>
            <div>
              {this.priceFormat(
                this.state.lastTransaction.sales.total_amount -
                  this.state.lastTransaction.sales.total_amount * 0.12
              )}
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <b>Zero Rated:</b>
            </div>
            <div>{this.priceFormat(0)}</div>
          </div>
          <hr />
          <div className="d-flex">
            <div>
              <b>No. Of Item(s): {this.state.lastTransaction.carts.length}</b>
            </div>
            <div></div>
          </div>
          <div className="d-flex">
            <div>
              <b>Receipt No.:&nbsp;</b>
            </div>
            <div>{this.state.lastTransaction.sales.reference_no}</div>
          </div>
          <div className="d-flex">
            <div>
              <b>Cashier:&nbsp;</b>
            </div>
            <div>
              {this.getUserName(this.state.lastTransaction.sales.cashier_by)}
            </div>
          </div>
          <div className="d-flex">
            <div>
              <b>Date:&nbsp;</b>
            </div>
            <div>
              {new Date(
                this.state.lastTransaction.sales.created_at
              ).toLocaleString("en-US")}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <>
        {!Object.keys(this.state.lastTransaction).length ? (
          <div className="container-fluid pt-3">
            <div className="d-flex justify-content-between border border-bottom-0">
              <div>
                {!Object.keys(this.state.lastProduct).length ? (
                  <div className="product-scanned-item">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <div className="product-scanned-item">
                    <div>{this.state.lastProduct.name}</div>
                    <div>{this.state.lastProduct.barcode}</div>
                    <div>{this.priceFormat(this.state.lastProduct.price)}</div>
                  </div>
                )}
              </div>
              <div>{this.renderTotalAmount()}</div>
            </div>
            <div>
              <table className="table table-borderedless border">
                <thead>
                  <tr>
                    <th>BARCODE</th>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>PRICE</th>
                  </tr>
                </thead>
                <tbody className="cart-table">{this.renderCartData()}</tbody>
              </table>
            </div>
            {this.renderProductScannedModal()}
            <div className="mt-3">
              <button
                className="btn btn-danger btn-dashboard"
                onClick={this.logout}
              >
                Logout(ALT+L)
              </button>
              <button
                className="btn btn-success btn-dashboard float-end"
                onClick={this.showUserCheckoutModal}
              >
                Checkout(ALT+C)
              </button>
              <button
                className="btn btn-danger btn-dashboard float-end"
                onClick={this.showFindModal}
              >
                Find(ALT+G)
              </button>
              <button
                className="btn btn-danger btn-dashboard float-end"
                onClick={this.setCustomQuantity}
              >
                Set Quantity(ALT+Q)
              </button>
            </div>
          </div>
        ) : (
          <div className="container-fluid text-center">
            {this.renderLastTransaction()}
            <div className="receipt-action position-absolute receipt-btn">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-danger btn-dashboard"
                  onClick={this.logout}
                >
                  Logout(ALT+L)
                </button>
                <button
                  className="btn btn-success btn-dashboard"
                  onClick={() => this.setState({ lastTransaction: {} })}
                >
                  New transaction(ALT+N)
                </button>
                <button
                  className="btn btn-primary btn-dashboard"
                  onClick={this.printReceipt}
                >
                  Print(ALT+P)
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default UserDashboard;

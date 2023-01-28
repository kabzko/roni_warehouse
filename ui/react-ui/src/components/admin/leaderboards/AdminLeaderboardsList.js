import React from "react";

import SideNav from "../common/SideNav";
import Header from "../common/Header";

import axios from "../../../utils/axios";
import Toast from "../../../utils/toast";

import "./AdminLeaderboardsList.css";

class AdminLeaderboardsList extends React.Component {
  constructor(props) {
    if (
      !(
        localStorage.getItem("user_type") === "admin" ||
        localStorage.getItem("user_type") === "pointOfSale"
      )
    ) {
      window.location.href = "/";
    }
    super(props);
    this.state = {
      products: [],
      leaderboards: [],
      type: "daily",
      daily: new Date(),
      monthly: new Date(),
    };

    this.getProducts();
    this.getLeaderboards();
  }

  getLeaderboards() {
    let api_url = "/api/leaderboards/";
    let { type, daily, monthly } = this.state;

    api_url += `?type=${type}`;

    if (type === "daily") {
      const date = new Date(daily);
      api_url += `&month=${
        date.getMonth() + 1
      }&year=${date.getFullYear()}&day=${date.getDate()}`;
    } else {
      const date = new Date(monthly);
      api_url += `&month=${date.getMonth() + 1}&year=${date.getFullYear()}`;
    }

    axios
      .get(api_url)
      .then((res) => {
        this.setState({ leaderboards: res.data });
      })
      .catch((error) => {
        console.log(error);
        Toast.error(error.response.data.message);
      });
  }

  priceFormat(value) {
    const val = (value / 1).toFixed(2).replace(",", ".");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  inputChange(input_name, event) {
    let updated_field = {};
    updated_field[input_name] = event.target.value;
    this.setState({ ...updated_field }, () => {
      this.getLeaderboards();
    });
  }

  printReport() {
    var mywindow = window.open("", "PRINT", "fullscreen=yes,width=550");
    mywindow.document.write(
      '<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head>'
    );
    mywindow.document.write("<body>");
    mywindow.document.write(document.getElementById("print").innerHTML);
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

  convertFormat(type) {
    if (type === "daily") {
      if (this.state.daily) {
        return new Date(this.state.daily).toLocaleDateString("en-CA");
      }
      return "";
    } else {
      if (this.state.monthly) {
        return `${new Date(this.state.monthly).getFullYear()}-${
          "0" + (new Date(this.state.monthly).getMonth() + 1)
        }`;
      }
      return "";
    }
  }

  getProductName(productId, type) {
    let product;

    for (let i in this.state.products) {
      if (this.state.products[i].id === productId) {
        product =
          type === "name"
            ? this.state.products[i].name
            : this.state.products[i].barcode;
        break;
      }
    }

    return product;
  }

  getProducts() {
    axios
      .get("/api/products/")
      .then((res) => {
        this.setState({ products: res.data });
      })
      .catch((error) => {
        console.log(error);
        Toast.error(error.response.data.message);
      });
  }

  render() {
    return (
      <div className="side-nav-custom">
        <Header></Header>
        <div className="container-fluid">
          <div className="row">
            <SideNav active="leaderboards"></SideNav>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Product Sales</h1>
              </div>
              <div className="d-flex justify-content-end">
                <div className="input-group mb-3 me-2 w-25">
                  <select
                    className="form-select"
                    onChange={this.inputChange.bind(this, "type")}
                    value={this.state.type}
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                {this.state.type === "daily" ? (
                  <div>
                    <input
                      type="date"
                      className="form-control"
                      id="daily"
                      placeholder="Enter here.."
                      onChange={this.inputChange.bind(this, "daily")}
                      value={this.convertFormat("daily")}
                    ></input>
                  </div>
                ) : (
                  <div>
                    <input
                      type="month"
                      className="form-control"
                      id="monthly"
                      placeholder="Enter here.."
                      onChange={this.inputChange.bind(this, "monthly")}
                      value={this.convertFormat("monthly")}
                    ></input>
                  </div>
                )}
                <button
                  className="btn btn-light report-print-btn"
                  onClick={this.printReport}
                >
                  Print
                </button>
              </div>
              <div className="clearfix"></div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Barcode</th>
                      <th scope="col">Product</th>
                      <th scope="col">Total Quantity</th>
                      <th scope="col">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {this.state.leaderboards.length > 0 ? (
                      this.state.leaderboards.map((element, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {this.getProductName(element.product, "barcode")}
                            </td>
                            <td>
                              {this.getProductName(element.product, "name")}
                            </td>
                            <td>{element.total_quantity}</td>
                            <td>{this.priceFormat(element.total_price)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="1000" className="text-center">
                          No transaction has been made!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div
                id="print"
                className="table-responsive"
                style={{ display: "none" }}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Product Sales</h2>
                  </div>
                  <div>
                    <h2>
                      {this.state.type === "daily"
                        ? new Date(this.state.daily).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : new Date(this.state.daily).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                            }
                          )}
                    </h2>
                  </div>
                </div>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th scope="col">Barcode</th>
                      <th scope="col">Product</th>
                      <th scope="col">Total Quantity</th>
                      <th scope="col">Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="table-group-divider">
                    {this.state.leaderboards.map((element, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {this.getProductName(element.product, "barcode")}
                          </td>
                          <td>
                            {this.getProductName(element.product, "name")}
                          </td>
                          <td>{element.total_quantity}</td>
                          <td>{this.priceFormat(element.total_price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminLeaderboardsList;

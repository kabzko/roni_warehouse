import React from "react";
import { Link } from "react-router-dom";

import axios from "../../../utils/axios";
import "./SideNav.css";

class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
    };

    this.logout = this.logout.bind(this);
  }

  logout() {
    axios
      .post("/api/logout/", {})
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <nav
        id="sidebarMenu"
        className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
      >
        <div className="position-sticky pt-3 sidebar-sticky">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                className={
                  this.state.active === "dashboard"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/dashboard"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-house"></i>
                  Dashboard
                </span>
              </Link>
            </li>

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "users-list"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/users"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-people-fill"></i>
                  Users
                </span>
              </Link>
              : <></>
            }

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "suppliers"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/suppliers"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-truck"></i>
                  Supplier
                </span>
              </Link>
              : <></>
            }

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "products"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/products"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-box-seam"></i>
                  Products
                </span>
              </Link>
              : <></>
            }

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "stock-in"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/stock-in"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-box-arrow-in-down-right"></i>
                  Stock In
                </span>
              </Link>
              : <></>
            }

            {(localStorage.getItem("user_type") === "admin" || localStorage.getItem("user_type") === "receiver") ?
              <Link
                className={
                  this.state.active === "stock-out"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/stock-out"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-box-arrow-up-right"></i>
                  Stock Out
                </span>
              </Link>
              : <></>
            }

            {/* <Link
              className={
                this.state.active === "listing" ? "nav-link active" : "nav-link"
              }
              to="/web/admin/listing"
            >
              <span className="align-text-bottom">
                <i className="bi bi-list-ul"></i>
                Listing
              </span>
            </Link> */}

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "invoice" ? "nav-link active" : "nav-link"
                }
                to="/web/admin/invoice"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-receipt-cutoff"></i>
                  Invoice
                </span>
              </Link>
              : <></>
            }

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "sales" ? "nav-link active" : "nav-link"
                }
                to="/web/admin/invoice-sales-graph"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-graph-up-arrow"></i>
                  Sales Graph
                </span>
              </Link>
              : <></>
            }

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "leaderboards"
                    ? "nav-link active"
                    : "nav-link"
                }
                to="/web/admin/product-sales"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-card-list"></i>
                  Product Sales
                </span>
              </Link>
              : <></>
            }

            {localStorage.getItem("user_type") === "admin" ?
              <Link
                className={
                  this.state.active === "others" ? "nav-link active" : "nav-link"
                }
                to="/web/admin/others"
              >
                <span className="align-text-bottom">
                  <i className="bi bi-collection"></i>
                  Others
                </span>
              </Link>
              : <></>
            }

            <li className="nav-item" onClick={this.logout}>
              <span className="nav-link" style={{ cursor: "pointer" }}>
                <span className="align-text-bottom">
                  <i className="bi bi-door-open"></i>
                  Logout
                </span>
              </span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default SideNav;

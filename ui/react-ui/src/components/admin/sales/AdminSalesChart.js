import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

import SideNav from "../common/SideNav";
import Header from "../common/Header";

import axios from "../../../utils/axios";
import Toast from "../../../utils/toast";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

var globalTypeForChartJS = "daily";

class AdminSalesChart extends React.Component {
  constructor(props) {
    if (localStorage.getItem("user_type") !== "admin") {
      window.location.href = "/";
    }

    super(props);
    this.state = {
      sales: [],
      type: "daily",
      daily: new Date(),
      monthly: new Date(),
    };

    this.getSales();
  }

  inputChange(input_name, event) {
    let updated_field = {};
    updated_field[input_name] = event.target.value;
    this.setState({ ...updated_field }, () => {
      this.getSales();
      globalTypeForChartJS = this.state.type;
    });
  }

  printReport() {
    var canvasEle = document.getElementById("my-chart-id");
    var mywindow = window.open("", "PRINT", "fullscreen=yes,width=550");
    mywindow.document.write(
      '<html><head><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"></head>'
    );
    mywindow.document.write("<body>");
    mywindow.document.write(document.getElementById("print").innerHTML);
    mywindow.document.write("<div><img style='border: 1px solid #cfcfcf;' src='" + canvasEle.toDataURL() + "' width='1000' /></div>");
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
        return `${new Date(this.state.monthly).getFullYear()}-${
          "0" + (new Date(this.state.monthly).getMonth() + 1)
        }`;
      }
      return "";
    } else {
      if (this.state.monthly) {
        return new Date(this.state.monthly).getFullYear();
      }
      return "";
    }
  }

  getSales() {
    let api_url = "/api/sales/";
    let { type, daily, monthly } = this.state;

    api_url += `?type=${type}`;

    if (type === "daily") {
      const date = new Date(daily);
      api_url += `&month=${date.getMonth() + 1}&year=${date.getFullYear()}`;
    } else {
      const date = new Date(monthly);
      api_url += `&year=${date.getFullYear()}`;
    }

    axios
      .get(api_url)
      .then((res) => {
        res.data.map((data) => {
          return data;
        });
        this.setState({ sales: res.data });
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

  capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
  }

  renderLineChart() {
    if (!this.state.sales) {
      return null;
    }
    return (
      <Line
        id="my-chart-id"
        options={{
          responsive: true,
          plugins: {
            tooltip: {
              displayColors: false,
              callbacks: {
                title: (tooltip) => {
                  return new Date(
                    Date.parse(tooltip[0].label)
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                },
              },
            },
            legend: { display: true },
            title: {
              display: true,
              text:
                this.state.type === "daily" ? `Daily Sales` : `Monthly Sales`,
              position: "top",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              ticks: {
                callback: function (value, index, values) {
                  return globalTypeForChartJS === "daily"
                    ? new Date(
                        Date.parse(this.getLabelForValue(value))
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : new Date(
                        Date.parse(this.getLabelForValue(value))
                      ).toLocaleDateString("en-US", {
                        month: "long",
                      });
                },
                fontSize: 16,
              },
            },
          },
        }}
        data={{
          labels: this.state.sales.map((element) => {
            return new Date(element.day);
          }),
          datasets: [
            {
              label: `Total Sales`,
              data: this.state.sales.map((element) => {
                return new Date(element.total_amount);
              }),
              borderColor: "rgb(2, 48, 156)",
              backgroundColor: "rgb(2, 48, 156)",
              pointBorderWidth: 10,
              pointHoverBorderWidth: 10,
              hoverBorderWidth: 10,
              lineTension: 1,
            },
          ],
        }}
      />
    );
  }

  render() {
    return (
      <div className="side-nav-custom">
        <Header></Header>
        <div className="container-fluid">
          <div className="row">
            <SideNav active="sales"></SideNav>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Sales Graph</h1>
              </div>
              <div className="d-flex justify-content-end">
                <div className="input-group mb-3 me-2 w-25">
                  <select
                    className="form-select"
                    onChange={this.inputChange.bind(this, "type")}
                    value={this.state.type}
                  >
                    <option value="daily">Per Day</option>
                    <option value="monthly">Per Month</option>
                  </select>
                </div>
                {this.state.type === "daily" ? (
                  <div>
                    <input
                      type="month"
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
                      type="number"
                      className="form-control"
                      id="monthly"
                      placeholder="Enter here.."
                      min="1999"
                      max={new Date().getFullYear()}
                      onChange={this.inputChange.bind(this, "monthly")}
                      value={this.convertFormat("monthly")}
                    ></input>
                  </div>
                )}
                <button className="btn btn-light report-print-btn" onClick={this.printReport}>
                  Print
                </button>
              </div>
              <div className="clearfix"></div>
              <div className="mx-5 mb-5">{this.renderLineChart()}</div>
              <div id="print" style={{ display: "none" }}>
                <div className="d-flex justify-content-between">
                  <div>
                    <h2>Sales Chart</h2>
                  </div>
                  <div>
                    <h2>
                      {this.state.type === "daily"
                        ? new Date(this.state.daily).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                            }
                          )
                        : new Date(this.state.daily).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                            }
                          )}
                    </h2>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminSalesChart;

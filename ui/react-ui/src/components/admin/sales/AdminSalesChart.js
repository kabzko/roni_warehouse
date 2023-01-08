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
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import SideNav from '../common/SideNav';
import Header from '../common/Header';

import axios from '../../../utils/axios';
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

class AdminSalesChart extends React.Component {
    constructor(props) {
        if (sessionStorage.getItem("user_type") !== "admin") {
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
        this.setState({...updated_field}, () => {
            this.getSales();
        });
    }

    convertFormat(type) {
        if (type === "daily") {
            if (this.state.daily) {
                return new Date(this.state.daily).toLocaleDateString("en-CA");
            }
            return "";
        } else {
            if (this.state.monthly) {
                return `${new Date(this.state.monthly).getFullYear()}-${("0" + (new Date(this.state.monthly).getMonth()+1))}`;
            }
            return "";
        }
    }

    getSales() {
        let api_url = "/api/sales/?month=12&year=2022";

        axios.get(api_url).then(res => {
            res.data.map(data => {
                return data;
            })
            this.setState({"sales": res.data});
        }).catch(error => {
            console.log(error);
            Toast.error(error.response.data.message);
        })
    }

    priceFormat(value) {
        const val = (value/1).toFixed(2).replace(",", ".")
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    capitalize(text) {
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    }

    renderLineChart() {
        if (!this.state.sales) {
            return (
                null
            )
        }
        return (
            <Line
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false,
                        },
                    },
                }}
                data={{
                    labels: this.state.sales.map(element => {
                        return new Date(element.day)
                    }),
                    datasets: [
                        {
                            label: `${this.capitalize(this.state.type)} Sales`,
                            data: this.state.sales.map(element => {
                                return new Date(element.total_amount)
                            }),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }
                    ]
                }}
            />
        )
    }

    render() {
        return (
            <div className="side-nav-custom">
                <Header></Header>
                <div className='container-fluid'>
                    <div className='row'>
                        <SideNav active="sales"></SideNav>
                        <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
                            <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
                                <h1 className="h2">Sales</h1>
                            </div>
                            <div className="d-flex justify-content-end">
                                <div className="input-group mb-3 me-2 w-25">
                                    <select className="form-select" onChange={this.inputChange.bind(this, "type")} value={this.state.type}>
                                        <option value="daily">Daily</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                {
                                    this.state.type === "daily" ? <div>
                                        <input type="date" className="form-control" id="daily" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "daily")} value={this.convertFormat("daily")}></input>
                                    </div> : 
                                    <div>
                                        <input type="month" className="form-control" id="monthly" placeholder="Enter here.."
                                            onChange={this.inputChange.bind(this, "monthly")} value={this.convertFormat("monthly")}></input>
                                    </div>
                                }
                            </div>
                            <div className="clearfix"></div>
                            <div className="mx-5 mb-5">
                                {this.renderLineChart()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminSalesChart;
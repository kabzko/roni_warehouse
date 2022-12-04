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
        super(props);
        this.state = {
            sales: [],
        };

        this.getSales();
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
                            label: 'Daily Sales',
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
                            <div className="clearfix"></div>
                            <div className="mx-5">
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
// import React, { Component } from 'react';
import Chart from 'react-apexcharts'
import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

import '../stats.css'
import {IconButton} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import {AppContext} from "../../../App";


export default function PieChart(props){



    const options = {
        chart: {
            width: props.width,
            type: 'pie',
        },
        // labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
        labels: props.labels,
        legend: {
            position: 'bottom'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }



    return (
        <div id="card">
            <div id="chart">
                <Chart options={options} series={props.series} type="pie" width={props.width}/>
            </div>

        </div>

    )

}

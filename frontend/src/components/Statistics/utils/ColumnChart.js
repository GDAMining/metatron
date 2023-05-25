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
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

export default function ColumnChart(props){
    const { username,users,collectionslist,collectiondocuments } = useContext(AppContext);

    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [Start,SetStart] = useState(0)
    const [End,SetEnd] = useState(Object.keys(props.annotators).length  < 15 ? Object.keys(props.annotators).length : 15)
    const [UpateNext,SetUpdateNext] = useState(false)
    const [UpdatePrev,SetUpdatePrev] = useState(false)
    const [Annotators,SetAnnotators] = useState(false)

    function getPrev(){
        SetStart(Start -15)
        SetEnd(End-15)
    }
    function getNext(){
        SetStart(Start + 15)
        if (End + 15 > Object.keys(props.annotators).length){
            SetEnd(Object.keys(props.annotators).length)

        }else{
            SetEnd(End+15)
        }
    }

    useEffect(()=>{
        let ann = []
        Object.keys(props.annotators).map(k=>{
            // ann.push(
            //     {
            //         x:k,
            //         y:props.annotators[k]['count']
            //     }
            // )
            ann.push(
               props.annotators[k]['count']

            )
        })
        const series = [{
            name: 'annotators',
            data: ann
        },]

        SetAnnotators(series)
    },[])






    // const series = [{
    //     name: 'PRODUCT A',
    //     data: [44, 55, 41, 67, 22, 43]
    // }, {
    //     name: 'PRODUCT B',
    //     data: [13, 23, 20, 8, 13, 27]
    // }, {
    //     name: 'PRODUCT C',
    //     data: [11, 17, 15, 15, 21, 14]
    // }, {
    //     name: 'PRODUCT D',
    //     data: [21, 7, 25, 13, 22, 8]
    // }]

    const options =  {
        chart: {
            type: 'bar',
            height: 550,
            stacked: false,
            toolbar: {
                show: false,
                tools: {
                    download: false
                }
            }
        },
        yaxis: {
            forceNiceScale: true,
            labels: {
                formatter: function (val) {
                    return parseInt(val).toString();
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                columnWidth: '40%',
                horizontal: false,
                borderRadius: 0,
                // dataLabels: {
                //     total: {
                //         enabled: true,
                //         style: {
                //             fontSize: '13px',
                //             fontWeight: 900
                //         }
                //     }
                // }
            },
        },
        xaxis: {
            type: 'string',
            categories: Object.keys(props.annotators).slice(Start,End),
        },

        legend: {
            position: 'top',
            // offsetY: 40
        },
        fill: {
            opacity: 1
        }
    }


    return (
        <div >

                <div className={'centerbars'}>
                    {Annotators && <div><Chart options={options} series={Annotators} type="bar" height={300}/></div>}

            </div>
            <div style={{marginTop:'5px',textAlign:'center'}}>   <IconButton disabled={Start === 0} onClick={getPrev}><NavigateBeforeIcon/></IconButton> From {Start} to {End}
                <IconButton onClick={getNext} disabled={End === Object.keys(props.annotators).length}><NavigateNextIcon/></IconButton></div>

        </div>

    )

}

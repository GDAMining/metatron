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


export default function PieCollection(props){
    const document_count = props.collection.documents_count
    const { username,users,collectionslist } = useContext(AppContext);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [CollectionToShow,SetCollectionToShow] = useState(false)
    const [AddCollection,SetAddCollection] = useState(false)
    const [UpdateCollection,SetUpdateCollection] = useState(false)
    const [Details,SetDetails] = useState(false)
    const [UsersList,SetUsersList] = users


     const options = {
             chart: {
                 height: 350,
                 type: 'radialBar',
                 toolbar: {
                     show: false
                 }
             },
             states: {
                 hover: {
                     filter: {
                         type: 'none' /* none, lighten, darken */
                     }
                 },
                 active: {
                     filter: {
                         type: 'none' /* none, lighten, darken */
                     }
                 }
             },
             plotOptions: {

                 radialBar: {
                     startAngle: -135,
                     endAngle: 225,
                     hollow: {
                         margin: 0,
                         size: '80%',
                         background: '#fff',
                         image: undefined,
                         imageOffsetX: 0,
                         imageOffsetY: 0,
                         position: 'front',
                         dropShadow: {
                             enabled: true,
                             top: 3,
                             left: 0,
                             blur: 4,
                             opacity: 0.04
                         }
                     },
                     track: {
                         background: '#fff',
                         strokeWidth: '67%',
                         margin: 0, // margin is in pixels
                         dropShadow: {
                             enabled: true,
                             top: -3,
                             left: 0,
                             blur: 4,
                             opacity: 0.0
                         }
                     },

                     dataLabels: {
                         show: true,
                         name: {
                             offsetY: -10,
                             show: true,
                             color: '#888',
                             fontSize: '17px'
                         },
                         value: {
                             formatter: function () {
                                 return props.collection.user_annotations_count + '/' + props.collection.documents_count;
                             },
                             color: '#111',
                             fontSize: '36px',
                             show: true,
                         }
                     }
                 }
             },
             fill: {
                 type: 'gradient',
                 gradient: {
                     shadeIntensity: 0.2,
                     shade: "light",
                     type: "horizontal",
                     // gradientToColors: ["#00ff00"],
                     inverseColors: true,
                     opacityFrom: 1,
                     opacityTo: 1,
                     stops: [0, 100],
                     colorStops: [
                         {
                             offset: 0,
                             color: "rgba(188,120,236,1)",
                             opacity: 1
                         },
                         {
                             offset: 35,
                             color: "rgba(188,120,236,1)",
                             opacity: 1
                         },
                         {
                             offset: 65,
                             color: "rgba(29,133,163,1)",
                             opacity: 1
                         },
                         {
                             offset: 100,
                             color: "rgba(29,133,163,1)",
                             opacity: 1
                         }
                     ]
                 }
             },
             stroke: {
                 lineCap: 'round'
             },

             labels: [props.collection.name],
         }

    const options_details_true = {
        chart: {
            height: props.expand === props.id ? 250 : 150,
            type: 'radialBar',
            toolbar: {
                show: false
            }
        },
        states: {
            hover: {
                filter: {
                    type: 'none' /* none, lighten, darken */
                }
            },
            active: {
                filter: {
                    type: 'none' /* none, lighten, darken */
                }
            }
        },
        plotOptions: {

            radialBar: {
                startAngle: -135,
                endAngle: 225,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: '#fff',
                    image: undefined,
                    imageOffsetX: 0,
                    imageOffsetY: 0,
                    position: 'front',
                    dropShadow: {
                        enabled: true,
                        top: 3,
                        left: 0,
                        blur: 4,
                        opacity: 0.04
                    }
                },
                track: {
                    background: '#fff',
                    strokeWidth: '67%',
                    margin: 0, // margin is in pixels
                    dropShadow: {
                        enabled: true,
                        top: -3,
                        left: 0,
                        blur: 4,
                        opacity: 0.0
                    }
                },

                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '17px'
                    },
                    value: {
                        formatter: function () {
                            return props.collection.user_annotations_count + '/' + props.collection.documents_count;
                        },
                        color: '#111',
                        fontSize: '36px',
                        show: true,
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 0.2,
                shade: "light",
                type: "horizontal",
                // gradientToColors: ["#00ff00"],
                inverseColors: true,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100],
                colorStops: [
                    {
                        offset: 0,
                        color: "#c591c7",
                        opacity: 1
                    },
                    {
                        offset: 35,
                        color: "#9866ee",
                        opacity: 1
                    },
                    {
                        offset: 65,
                        color: "#7066ee",
                        opacity: 1
                    },
                    {
                        offset: 100,
                        color: "#668fee",
                        opacity: 1
                    }
                ]
            }
        },
        stroke: {
            lineCap: 'round'
        },

        labels: [props.collection.name],
    }





    //     this.state = {
    //         series: this.props.annotations,
    //         options: {
    //             chart: {
    //                 width: 380,
    //                 type: 'pie',
    //                 colors:["green","red"],
    //
    //             },
    //             legend: {
    //                 show: false
    //             },
    //             labels: ['Annotated', 'Not Annotated'],
    //
    //             responsive: [{
    //                 breakpoint: 480,
    //                 options: {
    //                     chart: {
    //                         width: 200
    //                     },
    //                     legend: {
    //                         position: 'bottom'
    //                     }
    //                 }
    //             }]
    //         },
    //
    //
    //     };



        return (
            <div id="card">
                <div id="chart">
                    <Chart options={options} series={[props.collection.perc_annotations_user]} type="radialBar" height={350}/>
                </div>

                <div style={{textAlign:'center'}}>
                    <Button  href={'statistics/'+props.collection.id} endIcon={<SearchIcon />}>
                        View
                    </Button>
                </div>
            </div>
            // <div id="card">
            //     <div id="chart">
            //         <Chart options={props.expand === props.id ? options_details_true : options} series={[props.collection.perc_annotations_all]} type="radialBar" height={350}/>
            //     </div>
            //
            //     <div style={{textAlign:'center'}}>
            //         <Button onClick={()=> {
            //             let cont = document.getElementById('radial-container')
            //             cont.className = cont.className === 'active' ? 'normal':'active'
            //             // props.setExpand(prev=>!prev)
            //             if(props.expand === false){
            //                 props.setExpand(props.id)
            //             }else{
            //                 props.setExpand(false)
            //
            //             }
            //         }} endIcon={<SearchIcon />}>
            //             View
            //         </Button>
            //     </div>
            // </div>
        )

}














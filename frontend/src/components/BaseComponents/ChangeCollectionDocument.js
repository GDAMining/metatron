import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from "@mui/icons-material/Download";
import {CollectionsBookmarkOutlined} from "@material-ui/icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";


function ChangeConfiguration(props){
    return(


        <label>
            {props.type}:&nbsp;&nbsp;
                <Autocomplete
                    style={{width:'50vh',display:'inline-block'}}
                    id="disable-clearable"
                    disableClearable
                    includeInputInList
                    size = "small"
                    options={props.options}
                    value={props.value} //modified 24/10/2021


                    renderInput={(params) => (

                        <TextField {...params} variant="standard" />
                    )}


                    renderOption={(props, option) => {
                        // console.log('option1',option['id'])
                        // console.log('option2',NotAnn)
                        // console.log('option3',NotAnn.indexOf(option['id']) !==-1)

                        return (
                            <li {...props}>
                                    <span
                                        // key={index}
                                        // style={{fontSize: '0.8rem',fontWeight:(NotAnn.indexOf(option['id']) !==-1 ? 'bold':'normal')}}

                                    >ciao</span>

                            </li>
                        );
                    }}
                />



        </label>

    );

}
export default ChangeConfiguration






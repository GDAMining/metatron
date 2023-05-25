import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
// import Draggable from 'react-draggable';

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import SaveIcon from '@mui/icons-material/Save';
import HubIcon from '@mui/icons-material/Hub';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import EditIcon from '@mui/icons-material/Edit';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';

import Fade from '@mui/material/Fade';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";

import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../document.css'
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import {type} from "@testing-library/user-event/dist/type";
import {waitForElm} from "../../HelperFunctions/HelperFunctions";

export default function ParagraphDoc(props){
    const { username,users,inarel,documentdescription,document_id,relationship,currentdiv,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);





    // waitForElm('#'+props.id).then(element=>{
    //     // let element = document.getElementById(props.id)
    //     element.className = ''
    //     console.log('ch',props.chiave,props.chiave !== 'title_key',props.chiave.endsWith('_key'))
    //     if (props.chiave !== 'title_key' && props.chiave.endsWith('_key')){
    //         element.classList.add(...['no_men','key'])
    //     }else if (props.chiave === 'title_value' ){{
    //         element.classList.add(...['no_men', 'title_value'])
    //     }
    //     }else if (props.chiave.endsWith('_value')){
    //
    //         element.classList.add(...['no_men'])
    //
    //     }
    // })







    return (
        <>
                    {/*{props.chiave.endsWith('_key') && props.chiave !== 'title_key' && <span className='no_men key' id = {props.id} onClick={(e)=>props.click_function(e)}>{props.testo}</span>}*/}
                    {/*{props.chiave === 'title_value' && <span className='no_men title_value' id = {props.id} onClick={(e)=>props.click_function(e)}>{props.testo}</span>}*/}
                    {/*{props.chiave !== 'title_value' && props.chiave.endsWith('value') && props.chiave.endsWith('_value')&& <span className='no_men' id = {props.id} onClick={(e)=>props.click_function(e)}>{props.testo}</span>}*/}
            {props.chiave.endsWith('_key') && props.chiave !== 'title_key' && <span className='no_men key' id = {props.id} >{props.testo}</span>}
            {props.chiave === 'title_value' && <span className='no_men title_value' id = {props.id}>{props.testo}</span>}
            {props.chiave !== 'title_value' && props.chiave.endsWith('value') && props.chiave.endsWith('_value')&& <span className='no_men' id = {props.id} >{props.testo}</span>}


        </>
        // <span className='no_men' id = {props.id} onClick={(e)=>props.click_function(e)}>
        //     {props.chiave.endsWith('_key') && props.chiave !== 'title_key' && <b>{props.testo}</b>}
        //     {props.chiave === 'title_value' && <h3>{props.testo}</h3>}
        //     {props.chiave !== 'title_value' && props.chiave.endsWith('value') && props.chiave.endsWith('_value')&& <span>{props.testo}</span>}
        //
        // </span>
    )

}

import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Collapse from '@mui/material/Collapse';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import UploadIcon from '@mui/icons-material/Upload';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ArticleIcon from '@mui/icons-material/Article';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import UploadFileIcon from '@mui/icons-material/UploadFile';
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
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {AppContext} from "../../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export default function FilterComponent(props){
    const { collection,document_id,labels, expand,showsettings,showfilter,fields,fieldsToAnn } = useContext(AppContext);

    const [ShowFilter,SetShowFilter] = showfilter

    const [Fields,SetFields] = fields
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn
    const [Remember, SetRemember] = useState(false)
    const [Check,SetCheck] = useState(false)
    const [ShowSettings,SetShowSettings] = showsettings
    const [Expand,SetExpand] = expand




    const handleChange = (event,field) => {
        event.stopPropagation()
        event.preventDefault()
        console.log('fields',FieldsToAnn)
        SetRemember(false)
        console.log(field)
        if(FieldsToAnn.indexOf(field) === -1){
            SetFieldsToAnn([...FieldsToAnn,field])
        }else{
            var filtered = FieldsToAnn.filter(f => f !== field)
            SetFieldsToAnn(filtered)
        }
    };




    function ConfirmFields(e){
        e.preventDefault()
        e.stopPropagation()
        // SetExpand(false)
        // SetShowFilter(false)
        axios.post('set_new_fields',{fields_to_ann:FieldsToAnn})
            .then(response=> {
                console.log('resp', response);
                props.setbased(false)

            })
            .catch(error=>console.log('err',error))
    }
    return(
        <div className='filter'>
            <h6>
                Fields to annotate
            </h6>
            {/*<Checkbox {...label} defaultChecked color="default" />*/}
            {Fields ? <div>
                {Fields.map((field,i) =><div>
                    <span><Checkbox id={field}

                                    checked={FieldsToAnn.indexOf(field) !== -1} onClick={(e)=>handleChange(e,field)}/></span>{' '}<span style={{cursor: "default"}} onClick={(e)=>handleChange(e,field)}>{field}</span></div>)}


            <div>
                <Button variant="contained" size="small" onClick={(e)=>{ConfirmFields(e)}}>Confirm</Button>
            </div>

            </div> : <div className='loading'><CircularProgress /></div>}
        </div>
    );
}
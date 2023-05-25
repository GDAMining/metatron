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
import '../sidebar.css'
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
import { HuePicker,SliderPicker   } from 'react-color';
import {waitForElm} from "../../HelperFunctions/HelperFunctions";
// "react-color": "^3.0.0-beta.3",

export default function ColorPickerComponent(props){
    const { collection,document_id,labels, areascolors,labelstosave,concepts } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState([])
    const [ShowSelect,SetShowSelect] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = useState(false)
    const [LabelsToSave, SetLabelsToSave] = labelstosave
    const [Color,SetColor] = useState(props.color)
    const [ConceptsList,SetConceptsList] = concepts
    // const [ColorUpdated,SetColorUpdated] = colorupdated
    const [AreasColors,SetAreasColors] = areascolors


    // waitForElm('.slider-picker').then((element) => {
    //     let children = element.children
    //     let second_child_children = children[1].children
    //     let final_child = second_child_children[0].children
    //     final_child = final_child[final_child.length -1]
    //     final_child.remove()
    //
    // })

    useEffect(()=>{
        let elem = document.getElementById(props.id)
        elem.style.backgroundColor = props.color


    },[])

    function updateArea(color){
        let areas = {}
        let elem = document.getElementById(props.id)
        elem.style.backgroundColor = color
        window.localStorage.setItem(props.area,color)
        Object.keys(AreasColors).map(a=>areas[a] = AreasColors[a])
        areas[props.area] = color
        console.log('areas',areas)
        SetAreasColors(areas)
        SetColor(color)

    }


    const updateColor = (color) => {
        console.log('nuovo colore',color)
        // let elem = document.getElementById(props.id)
        let color_str_0 = 'rgba('+color.rgb.r+','+color.rgb.g + ','+color.rgb.b+', 1)'
        // let color_str_1 = 'rgba('+color.rgb.r+','+color.rgb.g + ','+color.rgb.b+', 0.7)'
        // window.localStorage.setItem(props.area,color_str_0)
        // window.localStorage.setItem(props.area+'_1',color_str_1)
        // console.log('nuovo colore',color_str_0,color_str_1)
        // SetColor(color_str_0)
        // elem.style.backgroundColor = color_str_0
        updateArea(color_str_0)

        // let areas = {}
        // Object.keys(AreasColors).map(a=>areas[a] = AreasColors[a])
        // areas[props.area] = color_str_0
        // console.log('areas',areas)
        // SetAreasColors(areas)
    }

    function ResetColor(e){
        e.preventDefault()
        e.stopPropagation()
        let color = 'rgba(65,105,225,1)'
        // window.localStorage.setItem(props.area,'rgba(65,105,225,1.0)')
        updateArea(color)
        // SetColor(color)

    }



    return(
        <div>
            <b>Current color: </b>
            <div>
                <div className='colored_div' id={props.id}>

                </div><br/>
            <div>
                <SliderPicker
                    color={Color}
                    width='100%'
                    onChangeComplete={updateColor}

                />
            </div>

            <div>
                <span className={'button_reset'} onClick={(e)=>{ResetColor(e)}}>Reset color</span>
            </div>
            <br/>
            </div>


        </div>

    );
}

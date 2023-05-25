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
import './sidebar.css'
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Fade from '@mui/material/Fade';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Slider from '@mui/material/Slider';


import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {AppContext} from "../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";
import { HuePicker  } from 'react-color';
import ColorPickerComponent from "./utils/ColorPicker";
import Concept from "../Annotation/concepts/Concept";
import FilterComponent from "./utils/Filter";


export default function ChangeSettingsComponent(props){
    const { collection,document_id,labels, inarel,linea,fontsize,showsettings,concepts,areascolors } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState([])
    const [ShowSelect,SetShowSelect] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = useState(false)
    const [DocBased, SetDocBased] = useState(true)
    const [General, SetGeneral] = useState(true)
    const [InARel,SetInARel] = inarel
    const [ConceptsList,SetConceptsList] = concepts
    const [AreasColors,SetAreasColors] = areascolors
    const [Interlines,SetInterlines] = linea
    const [FontSize,SetFontSize] = fontsize
    const [Areas,SetAreas] = useState({})
    const [AreaPrev,SetAreaPrev] = useState(false)
    const [ShowSettings,SetShowSettings] =showsettings
    const [SaveSettings,SetSaveSettings] = useState(false)

    function valuetext(value) {
        return `${value}`;
    }
    function valueheight(value) {
        return `${value}`;
    }
    // useEffect(()=>{
    //     SetAreaPrev(_.cloneDeep(AreasColors))
    // },[])

    function handleChangeInterlinea(e){
        SetInterlines(e.target.value)
        let doc = document.getElementById('paper_doc')
        doc.style.lineHeight = e.target.value
         window.localStorage.setItem('interlines',e.target.value)
    }

    function handleChangeSettings(e){
        SetGeneral(false)
    //     window.localStorage.setItem('fontsize',e.target.value +'rem')
    //     window.localStorage.setItem('interlines',e.target.value)
    //     SetSaveSettings(true)
    }


    function handleChangeSize(e){
        SetFontSize(e.target.value)
        let doc = document.getElementById('paper_doc')
        doc.style.fontSize = e.target.value + 'rem'
        window.localStorage.setItem('fontsize',e.target.value +'rem')

    }
    // useEffect(()=>{
    //     if(!ShowSettings && AreaPrev && !SaveSettings){
    //         SetAreasColors(_.cloneDeep(AreaPrev))
    //     }
    // },[ShowSettings])

    useEffect(()=>{
        let areas_with_color = {}

        axios.get('get_collection_areas').then(response=>{
            console.log('coll1',response.data)
            let areas = response.data.areas
            areas.map((a,i)=>{
                let color = window.localStorage.getItem(a)
                if(color === null){
                    color = 'rgba(65,105,225,1)'
                    // let elem = document.getElementById('colored_div_'+i)
                    // elem.style.backgroundColor = color
                }
                areas_with_color[a] = color
            })
            console.log('areas',areas_with_color)
            SetAreasColors(areas_with_color)
        })

            .catch(error=>console.log('error',error))

        // }





    },[ConceptsList])







    return(
        <div >
            <h5 className='h5toexpand inlineh5' onClick={(e)=> {
                e.preventDefault()
                SetGeneral(prev => !prev);
                // SetDocBased(false)
            }}>
                General Settings
            </h5> <IconButton onClick={(e)=> {
            e.preventDefault()
            SetGeneral(prev => !prev);
            // SetDocBased(false)
        }}>{General ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>
            <Collapse in={General}>
                <i>Select the colors for the concept types</i>
                <div className={"settings"}>
                    <div style={{width:'90%'}}>
                        {Object.keys(AreasColors).map((a,i)=>
                            <div>
                                <h6>{a}</h6>
                                <ColorPickerComponent id={'colored_div_'+i} color={AreasColors[a]}  area ={a} />
                            </div>

                        )}

                    </div>



                </div>
                <i>Font size</i>
                <div>
                    <div style={{display:"inline",marginLeft:'8px'}}>
                        <Slider
                            aria-label="Font size"
                            defaultValue={1.0}
                            getAriaValueText={valuetext}
                            step={0.1}
                            marks
                            min={1}
                            onChange={handleChangeSize}

                            max={2}
                            valueLabelDisplay="auto"
                        />
                    </div>

                </div>
                <i>Line Height</i>
                <div>
                    <div style={{display:"inline",marginLeft:'8px'}}>
                        <Slider
                            aria-label="Line height"
                            defaultValue={2}
                            getAriaValueText={valueheight}
                            step={0.5}
                            marks
                            min={2}
                            max={5}
                            onChange={handleChangeInterlinea}
                            valueLabelDisplay="auto"
                        />
                    </div>

                </div>
                <div>
                    <Button variant="contained" size="small" onClick={(e)=>{handleChangeSettings(e)}}>Confirm and Close</Button>
                </div>
            </Collapse>

            <hr/>
            <h5 className={'h5toexpand inlineh5'}
                onClick={(e)=> {
                    e.preventDefault()
                SetDocBased(prev => !prev);
            }}> Document based
        </h5> <IconButton onClick={(e)=> {
            e.preventDefault()
            SetDocBased(prev => !prev);
            // SetDocBased(false)
        }}>{DocBased ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}</IconButton>

    <Collapse in={DocBased}>

            <FilterComponent setbased={SetDocBased}/>
            </Collapse>

        </div>
    );
}
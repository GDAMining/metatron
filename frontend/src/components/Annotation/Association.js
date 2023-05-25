import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Mention from "./mentions/Mention";

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
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import './annotation.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import Chip from '@mui/material/Chip';

export default function Association(props){
    const { username,users,collectionslist,document_id,collection,mentions,startrange,endrange } = useContext(AppContext);

    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [ShowChips,SetShowChips] = useState(false)

    var mention = MentionsList.filter(m=>m['mention_text'] = props.mention_text)[0]
    // console.log('test1',props.mention_text)
    // return (<>
    useEffect(()=>{
        var mention_index = Array.from(document.getElementsByClassName(props.class.split(' ')[0]))
        console.log('mention_inde',mention_index)
        var max_text = 0
        var mention = false
        mention_index.map((o,i)=>{
            console.log('obh',o.innerText.length,o.innerText)
            console.log('obh',o)
            console.log('obh',mention,max_text)
            if(o.innerText.length > max_text){
                console.log('obh',o.innerText.length,max_text)

                max_text = o.innerText.length
                mention = o
            }
        })
        if (mention.innerText === props.mention_text){
            SetShowChips(true)
        }

    },[])


    return (
        <>
        {<div className='concepts' style={{color:'pink'}}>
                <Chip sx={{height:'15px',fontSize:'0.6rem'}} label="primary" color="primary"   />
            </div>}
            {/*<div style={{color:'pink'}} className = 'men' >*/}
                <Mention id ={props.id} loc ={props.loc} class ={props.class} mention_text ={props.mention_text} />
            {/*</div>*/}

        </>


    )
}
import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

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
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import '../rightsidestyles.css'
import {
    clearMentionsFromBorder,
    DeleteRange,
    highlightMention,
    recomputeColor, RemovehighlightMention
} from "../../HelperFunctions/HelperFunctions";

export default function RightSideMention(props){
    const { username,showmentionsspannel,inarel,firstsel,currentdiv,secondsel,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [InARel,SetInARel] = inarel
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    // console.log('test',props.mention_text)
    const [ShowInfo, SetShowInfo] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const [ShowMentions,SetShowMentions] = showmentionsspannel

    useEffect(()=>{
        let elements = Array.from(document.getElementsByClassName(props.mention.mentions))
        elements.map(e=>{
            if(e.style.borderWidth === '2px'){
                document.getElementById(props.mention.mentions).style.borderWidth = '2px';
                document.getElementById(props.mention.mentions).style.fontWeight = 'bold';
                document.getElementById(props.mention.mentions).style.color = e.style.color;
                document.getElementById(props.mention.mentions).style.backgroundColor = e.style.backgroundColor;

            }
        })

    },[])



    return (
        <div  className={'right_mention'} onClick={(e)=> {
            e.preventDefault()
            e.stopPropagation()
            DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
            // if(MentionToHighlight !== props.mention.mentions){
            if(document.getElementById(props.mention.mentions).style.fontWeight === 'bold'){

                SetMentionToHighlight(false)
                // document.getElementById(props.mention.mentions).style.fontWeight = 'normal'
                RemovehighlightMention(props.mention)


            } else {
                // document.getElementById(props.mention.mentions).style.fontWeight = 'bold'
                SetMentionToHighlight(props.mention.mentions)
                // recomputeColor(props.mention,true)
                highlightMention(props.mention)

            }

        }}>
            {/*{ShowInfo && !InARel && <hr/>}*/}
            <span id={'mention'+props.index}>{props.testo}</span>

        </div>


    )
}
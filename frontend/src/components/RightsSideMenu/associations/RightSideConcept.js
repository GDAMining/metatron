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
    DeleteRange, highlightMention,
    recomputeConceptColor,
    RemovehighlightMention
} from "../../HelperFunctions/HelperFunctions";

export default function RightSideConcept(props){
    const { secondsel,currentdiv,firstsel,inarel,showconceptspannel,concepts,mentions,areascolors,startrange,endrange } = useContext(AppContext);
    const [ConceptToHighlight,SetConceptToHighlight] = useState(false)
    const [MentionsList, SetMentionsList] = mentions
    const [ConceptsList,SetConceptsList] = concepts
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [InARel,SetInARel] = inarel
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [AreasColors,SetAreasColors] = areascolors
    const [ShowConcepts,SetShowConcepts] = showconceptspannel


    function GetMentionsToBorder(c){
        let name = c.concept_name
        let url = c.concept_url
        let to_ret = []

        props.ConceptsList.map(concept=>{
            if(to_ret.indexOf(concept.mentions) === -1 && url === concept.concept.concept_url){
                to_ret.push(concept)
            }
        })
        return to_ret
    }

    function clickOnConcept(e){
        e.preventDefault()
        e.stopPropagation()
        DeleteRange(SetStart,SetEnd,SetFirstSelected,SetSecondSelected,SetCurrentDiv)
        let mentions_to_border = GetMentionsToBorder(props.c)
        let area = props.c.area
        let men_color = 'rgba(65,105,225,1)'
        if(AreasColors) {
            men_color = AreasColors[area]

        }
        console.log(men_color)
        if(ConceptToHighlight !== props.c.concept_url){
            if(document.getElementById(props.id).style.fontWeight === 'bold'){

                SetConceptToHighlight(props.id)
                // document.getElementById(props.mention.mentions).style.fontWeight = 'normal'
                document.getElementById(props.id).style.fontWeight = 'normal'
                document.getElementById(props.id).style.color = ''
                document.getElementById(props.id).style.backgroundColor = ''
                mentions_to_border.map(mention=>{
                    RemovehighlightMention(mention)
                })
            } else {
                // document.getElementById(props.mention.mentions).style.fontWeight = 'bold'
                SetConceptToHighlight(props.c.concept_url)
                document.getElementById(props.id).style.fontWeight = 'bold'
                document.getElementById(props.id).style.color = men_color
                document.getElementById(props.id).style.backgroundColor = men_color.replace('1)','0.1)')

                mentions_to_border.map(mention=>{
                    highlightMention(mention)
                })

                // recomputeColor(props.mention,true)

            }
        }else{
            document.getElementById(props.id).style.fontWeight = 'normal'
            document.getElementById(props.id).style.color = ''
            document.getElementById(props.id).style.backgroundColor = ''
            mentions_to_border.map(mention=>{
                RemovehighlightMention(mention)
            })
            SetConceptToHighlight(false)
            // document.getElementById(props.mention.mentions).style.fontWeight = 'normal'

        }




    }
    useEffect(()=>{
        document.getElementById(props.id).style.fontWeight = ''
        document.getElementById(props.id).style.color = ''
        document.getElementById(props.id).style.backgroundColor = ''

    },[ShowConcepts])

    return (
        <div
            id={props.id}
            className='mentionButton'
            onClick={clickOnConcept}
        >{props.c.concept_name} <i>({ConceptsList.filter(x=>x['concept']['concept_url'] === props.c.concept_url && x['concept']['area'] === props.c.area).length})</i></div>

    )
}
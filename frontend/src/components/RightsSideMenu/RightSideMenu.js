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
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import './rightsidestyles.css'
import LabelsClass from "./labels/Labels";
import MentionsListClass from "./mentions/MentionsListClass";
import ConceptsListClass from "./associations/ConceptsListClass";

export default function RightSideMenu(props){
    const { username,labels,inarel,concepts,mentions,mentiontohighlight,showlabelspannel,showmentionsspannel,showconceptspannel,showrelspannel } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [MentionsList, SetMentionsList] = mentions
    const [ConceptsList,SetConceptsList] = concepts
    const [ShowLabels,SetShowLabels] = showlabelspannel
    const [ShowMentions,SetShowMentions] = showmentionsspannel
    const [ShowConcepts,SetShowConcepts] = showconceptspannel
    const [ShowRels,SetShowRels] = showrelspannel
    const [InARel,SetInARel] = inarel

    const [Labels, SetLabels] = labels



    return (
        <div>
            {Labels.length > 0 && !InARel && ShowLabels &&  <div id='right-side-bar'><LabelsClass/><hr/></div>}
            {MentionsList.length > 0  && !InARel && ShowMentions && <><MentionsListClass /><hr/></>}
            {ConceptsList.length > 0  && !InARel && ShowConcepts && <><ConceptsListClass /><hr/></>}
        </div>

    )
}
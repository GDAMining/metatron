import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
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
import React, {useState, useEffect, useContext, createContext, useRef} from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../rightsidestyles.css'

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Chip from "@mui/material/Chip";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import RelationshipModal, {RelationConceptContext} from "../../Annotation/concepts/RelationshipConceptModal";
import {createTheme, ThemeProvider} from "@mui/material/styles";

import ClearIcon from '@mui/icons-material/Clear';
import MuiAlert from '@mui/material/Alert';
import {ArrowContext} from "../../Document/DocumentFinal_2";
import {ConceptContext} from "../../../BaseIndex";

export default function RightSideRelation(props){
    const { username,showmentionsspannel,predicate,source,sourcetext,sourceconcepts,targettext,targetconcepts,predicatetext,predicateconcepts,target,inarel,firstsel,currentdiv,secondsel,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight


    // RENDERE RELATION DOPO CHIAMATA GET

    return (
        <div  style={{marginLeft:'5%'}}>
          <>
                <div>
                    <span><b>Insertion datetime:{' '}</b></span>
                    <span>{props.time}</span>
                </div>
                <div>
                    <span><b>Annotators:{' '}</b></span>
                    <span>{props.count}</span>
                </div><hr/>
            </>



        </div>


    )
}
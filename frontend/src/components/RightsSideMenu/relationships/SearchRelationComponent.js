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
import '../rightsidestyles.css'
import LabelsSelect from '../labels/LabelsSelect'
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
import RightSideMention from "../mentions/RightSideMention";
import RightSideConcept from "../associations/RightSideConcept";
import {waitForElm,clearMentionsFromBorder} from "../../HelperFunctions/HelperFunctions";
import AutoCompleteWithAdd from "./AutoCompleteWithAdd3";
import DialogContent from "@mui/material/DialogContent";
import {ConceptContext} from "../../../BaseIndex";
import {RelationConceptContext} from "../../Annotation/concepts/RelationshipConceptModal";

export default function SearchRelationComponent(props){

    const {area,url,name,areas,conceptslist,areaSearch,urlSearch,nameSearch,areasSearch,searchsubject,searchpredicate,searchobject} =  useContext(ConceptContext);
    const {area1,url1,name1,urlname1,description1,areas1,conceptslist1} =  useContext(RelationConceptContext);

    const [SearchSubject,SetSearchSubject] = searchsubject
    const [SearchPredicate,SetSearchPredicate] = searchpredicate
    const [SearchObject,SetSearchObject] = searchobject


    return(
        <div className={'autocompl'}>
            {( SearchObject || SearchPredicate || SearchSubject) &&<AutoCompleteWithAdd type={'search'} no_add_new_concept={true}/>}

        </div>
    );
}
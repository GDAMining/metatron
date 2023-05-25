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
import '../RightsSideMenu/rightsidestyles.css'
import LabelsSelect from '../RightsSideMenu/labels/LabelsSelect'
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
import RightSideMention from "../RightsSideMenu/mentions/RightSideMention";

export default function RelationshipListClass(props){
    const { collection,inarel,document_id,labels,source,target,predicate,relationship } = useContext(AppContext);

    const [Labels,SetLabels] = labels
    const [Relationship,SetRelationship] = relationship
    const [InARel,SetInARel] = inarel
    const [Source,SetSource] = source
    const [Target,SetTarget] = predicate
    const [Predicate,SetPredicate] = target

    useEffect(()=>{
        var source = false
        var target = false
        var predicate = false
        console.log('rela ment rule',Relationship)
        Relationship.map((ment,ind)=>{
            if(ment['role'] === 'Source'){
                console.log('rela ment source',ment['role'])
                source = true
                SetSource(ment)
            }else if(ment['role'] === 'Target'){
                console.log('rela ment target',ment['role'])

                target = true
                SetTarget(ment)
            }else if(ment['role'] === 'Predicate'){
                console.log('rela ment predicate',ment['role'])

                predicate = true
                SetPredicate(ment)
            }
        })
        if (!predicate){
            SetPredicate(false)
        }
        if (!Source){
            SetSource(false)
        }
        if(!Target){
            SetTarget(false)
        }
    },[Relationship])



    return(
        <div>
            <h5>
                Relationship
            </h5>
            {/*{MentionsList && <div><i><b>{MentionsList.length}</b> mentions</i></div>}*/}
            <div>
                {Source && <div>Source</div>}
                {Predicate && <div>Predicate</div>}
                {Target && <div>Target</div>}

            </div>


        </div>
    );
}
import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
import Draggable from 'react-draggable';

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
import '../annotation.css'

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
import '../annotation.css'
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import DraggableModal from "./DraggableConceptModal";
import {DeleteRange, updateMentionColor, waitForElm} from "../../HelperFunctions/HelperFunctions";
import DeleteMentionModal from "../mentions/modals/DeleteMentionModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import IconButton from '@mui/material/IconButton';

import {type} from "@testing-library/user-event/dist/type";
import Tooltip from '@mui/material/Tooltip';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ChipRel from "../relationship/ChipRelationship";



export default function DescriptionDialog(props) {





    return (


        <Dialog
            open={props.show}
            onClose={() => props.setshow(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth={'sm'}
            fullWidth={'sm'}
        >
            <DialogTitle id="alert-dialog-title">
                <h2><i>{props.area}</i>: {props.name}</h2>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <div>

                        <div style={{marginBottom: '3%'}}>
                            <a href={props.url} target={"_blank"}> {props.url}</a>
                        </div>
                        {/*<b>Name</b>*/}
                        {/*<div style={{marginBottom:'3%'}}>*/}
                        {/*    {props.concepts[0]['concept'].concept_name}*/}
                        {/*</div>*/}
                        {/*<b>Description</b>*/}
                        <div style={{marginBottom: '3%'}}>
                            {props.description}
                        </div>
                        {/*<b>Concept Type</b>*/}
                        {/*<div style={{marginBottom:'3%'}}>*/}
                        {/*    {props.concepts[0]['concept'].area}*/}
                        {/*</div>*/}


                    </div>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setshow(false)
                }}>Close</Button>

            </DialogActions>
        </Dialog>
    )
}
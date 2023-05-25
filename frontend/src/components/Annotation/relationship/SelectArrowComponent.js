import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";
// import Draggable from 'react-draggable';

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
import DraggableModal from "../concepts/DraggableConceptModal";
import {DeleteRange} from "../../HelperFunctions/HelperFunctions";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import IconButton from '@mui/material/IconButton';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SwipeDownIcon from '@mui/icons-material/SwipeDown';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import {ArrowContext} from "../../Document/DocumentFinal_2";
export default function SelectArrowComponent(props){
    const { username,users,inarel } = useContext(AppContext);


    const [Content,SetContent] = useState(false)
    const { changestoff,changeptoff,changespoff } = useContext(ArrowContext);
    // const { inarel } = useContext(ArrowContext);

    const [ChangeSTOff,SetChangeSTOff] = changestoff
    const [ChangePTOff,SetChangePTOff] = changeptoff
    const [ChangeSPOff,SetChangeSPOff] = changespoff
    const [InARel,SetInARel] = inarel



    return (
        <>{InARel && <div>
            <IconButton aria-label="delete" size="small" onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (props.request === 'sp') {
                    SetChangeSPOff(prev => !prev)
                } else if (props.request === 'st') {
                    SetChangeSTOff(prev => !prev)
                } else if (props.request === 'pt') {
                    SetChangePTOff(prev => !prev)
                }
            }}>
                <ReplayCircleFilledIcon fontSize="inherit"/>
            </IconButton>


        </div>}</>


    )
}
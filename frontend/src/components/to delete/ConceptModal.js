import {Col, Row} from "react-bootstrap";

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
import DocumentToolBar from "./DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import '../Annotation/annotation.css'
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}
export default function DraggableModal(props) {
    const {
        username,
        users,
        collectionslist,
        document_id,
        collection,
        mentions,
        mentiontohighlight,
        startrange,
        endrange
    } = useContext(AppContext);
    const [MentionToHighlight, SetMentionToHighlight] = mentiontohighlight
    const [DocumentID, SetDocumentID] = document_id
    const [Collection, SetCollection] = collection
    const [MentionsList, SetMentionsList] = mentions
    const [Start, SetStart] = startrange
    const [End, SetEnd] = endrange
    const [ShowAddConceptModal, SetShowAddConceptModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);

    function handleClose(){
        props.setshowconceptmodal(false)
    }

    return (
    <Dialog
        open={props.showconceptmodal}
        onClose={handleClose}
        disableEnforceFocus={true}

        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
    >
        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
            Subscribe
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                To subscribe to this website, please enter your email address here. We
                will send updates occasionally.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleClose}>
                Cancel
            </Button>
            <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
    </Dialog>
);
}
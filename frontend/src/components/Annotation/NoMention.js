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
import './annotation.css'

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
// import './documents.css'
import {CircularProgress} from "@mui/material";
import {AppContext} from "../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, createTheme, styled, ThemeProvider} from "@mui/material/styles";
import DraggableModal from "./concepts/DraggableConceptModal";
import {DeleteRange} from "../HelperFunctions/HelperFunctions";
import DeleteMentionModal from "./mentions/modals/DeleteMentionModal";
import AssistantIcon from '@mui/icons-material/Assistant';
import CheckIcon from '@mui/icons-material/Check';
import Chip from "@mui/material/Chip";
import {type} from "@testing-library/user-event/dist/type";

export default function NoMention(props){
    const { username,users,inarel,documentdescription,document_id,relationship,currentdiv,firstsel,curmention,secondsel,collection,mentions,addconceptmodal,mentiontohighlight,startrange,endrange } = useContext(AppContext);
    const [MentionToHighlight,SetMentionToHighlight] = mentiontohighlight
    const [DocumentID,SetDocumentID] = document_id
    const [Collection,SetCollection] = collection
    const [MentionsList,SetMentionsList] = mentions

    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [CurrentDiv,SetCurrentDiv] = currentdiv
    const [CurMention,SetCurMention] = curmention
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [Role,SetRole] = useState(false)


    const [DocumentDesc,SetDocumentDesc] = documentdescription
    const [SourceLabel,SetSourceLabel] = useState(false)
    const [PredicateLabel,SetPredicateLabel] = useState(false)
    const [TargetLabel,SetTargetLabel] = useState(false)

    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [ShowDeleteMetnionModal,SetShowDeleteMetnionModal] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [InARel,SetInARel] = inarel
    const [Relationship,SetRelationship] = relationship
    const [Concepts,SetConcepts] = useState(false)

    const mention_cur = props.mention

    // console.log('m',mention_cur)
    // mention_cur['id'] = props.id
    // Relationship.map((men,ind)=>{
    //     if(men['id'] === props.id && Object.keys(men).contains('role')){
    //         mention_cur['role'] = men['role']
    //     }
    // })


    const handleContextMenu = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
    };







    return (
        <div>
            {/*<DeleteMentionModal show={ShowDeleteMetnionModal} setshow={SetShowDeleteMetnionModal} mention={props.mention} position={props.loc} />*/}
            {/*{Concepts && Concepts.length === 1 &&*/}
            {/*<div className='concepts' style={{color:'pink'}}>*/}
            {/*    <Chip sx={{height:'15px',fontSize:'0.6rem'}} label={Concepts[0]['concept_name']} color="primary"   />*/}
            {/*</div>}*/}
            {/*{Concepts && Concepts.length > 1 &&*/}
            {/*<div className='concepts' style={{color:'pink'}}>*/}
            {/*    <Chip sx={{height:'15px',fontSize:'0.6rem'}} label={Concepts.length} color="primary"   />*/}
            {/*</div>}*/}
            {<div onContextMenu={handleContextMenu} >


                <div id={props.id} ref={inputEl} className = {props.class  + ' ' +'nomen'}

                      >
                    {props.mention_text.startsWith(' ') && !props.mention_text.endsWith(' ') && <>&nbsp;{props.mention_text.trim()}</>}
                    {props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text.trim()}&nbsp;</>}
                    {props.mention_text.endsWith(' ') && props.mention_text.startsWith(' ') && <>&nbsp;{props.mention_text.trim()}&nbsp;</>}
                    {!props.mention_text.endsWith(' ') && !props.mention_text.startsWith(' ') && <>{props.mention_text}</>}

                </div>










            </div>}

        </div>
    )
}
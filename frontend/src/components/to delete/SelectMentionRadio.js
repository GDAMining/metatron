// import {Col, ProgressBar, Row} from "react-bootstrap";
//
// import axios from "axios";
// import {ButtonGroup} from "@material-ui/core";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from '@mui/material/TextField';
// import React, {useState, useEffect, useContext, createContext, useRef} from "react";
// import Badge from 'react-bootstrap/Badge'
// import SaveIcon from '@mui/icons-material/Save';
// import HubIcon from '@mui/icons-material/Hub';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
// import EditIcon from '@mui/icons-material/Edit';
// const checkedIcon = <CheckBoxIcon fontSize="small" />;
// import Divider from '@mui/material/Divider';
// import ListItemIcon from '@mui/material/ListItemIcon';
//
// import Fade from '@mui/material/Fade';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
// import {
//     faChevronLeft, faPalette,
//     faChevronRight, faExclamationTriangle,
//     faGlasses,
//     faInfoCircle,
//     faList, faPlusCircle,
//     faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
// } from "@fortawesome/free-solid-svg-icons";
// import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
// import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
// import ToolBar from "../../BaseComponents/ToolBar";
// import AddIcon from '@mui/icons-material/Add';
// import Collapse from "@material-ui/core/Collapse";
// import Paper from "@mui/material/Paper";
// // import '../annotation.css'
// // import '../documents.css'
// import './conceptmodal.css'
// import {CircularProgress} from "@mui/material";
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
// import {AppContext} from "../../../App";
// import DeleteIcon from '@mui/icons-material/Delete';
// import InfoIcon from '@mui/icons-material/Info';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import Typography from '@mui/material/Typography';
// import {alpha, styled} from "@mui/material/styles";
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import Alert from '@mui/material/Alert';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Draggable from 'react-draggable';
// import AddNewConcept from "./AddNewConcept";
// import SelectConcept from "./SelectConcept";
// import IconButton from '@mui/material/IconButton';
// import Tooltip from '@mui/material/Tooltip';
// import Checkbox from "@mui/material/Checkbox";
// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';
// import DialogContent from "@mui/material/DialogContent";
// import {updateMentionColor} from "../../HelperFunctions/HelperFunctions";
// export const ConceptContext = createContext('')
//
// function PaperComponent(props) {
//     return (
//         <Draggable
//             handle="#draggable-dialog-title"
//             cancel={'[class*="MuiDialogContent-root"]'}
//         >
//             <Paper {...props} />
//         </Draggable>
//     );
// }
// export default function SelectMentionRadio(props) {
//     const {
//         username,
//         concepts,
//         collectionslist,
//         document_id,
//         collection,
//         mentions,curconcept,
//         mentiontohighlight,
//         startrange,
//         curmention,
//         endrange,areascolors
//     } = useContext(AppContext);
//     const [MentionToHighlight, SetMentionToHighlight] = mentiontohighlight
//     const [DocumentID, SetDocumentID] = document_id
//     const [Collection, SetCollection] = collection
//     const [MentionsList, SetMentionsList] = mentions
//     const [Start, SetStart] = startrange
//     const [AreasColors,SetAreasColors] = areascolors
//
//     const [End, SetEnd] = endrange
//     const [Area,SetArea] = useState(null)
//     const [Description,SetDescription] = useState(null)
//     const [Name,SetName] = useState(null)
//     const [Concepts,SetConcepts] = concepts;
//     const [Url,SetUrl] = useState(null)
//     const [UrlName,SetUrlName] = useState(false)
//     const [ShowAlert, SetShowAlert] = useState(false)
//     const [contextMenu, setContextMenu] = useState(null);
//     const inputEl = useRef(null);
//     const [Add,SetAdd] = useState(false)
//     const [CurMention,SetCurMention] = curmention;
//     const [ConceptsList,SetConceptsList] = useState(false)
//     const [Areas,SetAreas] = useState(false)
//     const [ShowAlertWarningArea,SetShowAlertWarningArea] = useState(false)
//     const [CurConcept,SetCurConcept] = curconcept
//     const [SelectedMention, SetSelectedMention] = useState(false)
//     const [value,SetValue] = useState(0)
//
//
//
//
//
//
//     return (
//
//         <Dialog
//             open={props.showconceptmodal}
//             onClose={props.handleClose}
//
//             // hideBackdrop={true}
//             // disableEnforceFocus={true}
//
//             PaperComponent={PaperComponent}
//             aria-labelledby="draggable-dialog-title"
//         >
//
//                 <div style={{padding:'2%',width:'500px'}}>
//
//                         <div style={{padding:'3%'}}>
//                             <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
//                                 Select the mention
//                             </DialogTitle>
//                             <DialogContent>
//                                 <DialogContentText id="alert-dialog-description">
//                                     Select the mention you want to associate a concept to
//                                     <div>
//                                         {props.mentions.map((m,i)=><div>
//                                             <Radio
//                                                 checked={value === i}
//                                                 onClick={props.handleChangeRadio}
//                                                 value={i}
//                                                 aria-label={props.m.mention_text}
//                                             />{' '}{props.m.mention_text}
//                                         </div>)}
//                                     </div>
//                                 </DialogContentText>
//
//                             </DialogContent>
//
//
//
//
//
//
//                     </> :<div className='loading'>
//                         <CircularProgress />
//                     </div>
//                     }
//
//
//                 </div>
//
//                 <DialogActions>
//
//
//                     <Button autoFocus onClick={props.handleClose}>
//                         Cancel
//                     </Button>
//                     {CurMention.length > 1 && <Button onClick={()=>SetCurMention([CurMention[value]])}>Confirm</Button>}
//                 </DialogActions>
//
//
//         </Dialog>
//
//     );
// }
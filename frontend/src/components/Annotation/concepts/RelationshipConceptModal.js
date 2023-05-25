import {Col, ProgressBar, Row} from "react-bootstrap";

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
// import '../annotation.css'
// import '../documents.css'
import './conceptmodal.css'
import {CircularProgress} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Draggable from 'react-draggable';
import AddNewConcept from "./AddNewConcept";
import SelectConcept from "./SelectConcept";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from "@mui/material/Checkbox";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DialogContent from "@mui/material/DialogContent";
import {updateMentionColor} from "../../HelperFunctions/HelperFunctions";
import {ConceptContext} from "../../../BaseIndex";
export const RelationConceptContext = createContext('')

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
export default function RelationshipModal(props) {
    const {
        username,
        concepts,
        collectionslist,
        document_id,
        collection,
        mentions,curconcept,
        mentiontohighlight,
        startrange,sourcetext,sourceconcepts,targettext,targetconcepts,predicatetext,predicateconcepts,
        curmention,collectionconcepts,
        endrange,areascolors,predicate,source,target
    } = useContext(AppContext);
    const [MentionToHighlight, SetMentionToHighlight] = mentiontohighlight
    const [DocumentID, SetDocumentID] = document_id
    const [Collection, SetCollection] = collection
    const [MentionsList, SetMentionsList] = mentions
    const [Start, SetStart] = startrange
    const [AreasColors,SetAreasColors] = areascolors
    const [ConceptsList,SetConceptsList] = collectionconcepts
    const {area,url,name,urlname,description,areas,conceptslist} =  useContext(ConceptContext);

    const [End, SetEnd] = endrange
    const [Areas,SetAreas] = useState(false)
    const [Area,SetArea] = useState(null)
    const [Description,SetDescription] = useState(null)
    const [Name,SetName] = useState(null)
    const [Url,SetUrl] = useState(null)
    const [UrlName,SetUrlName] = useState(false)
    const [Concepts,SetConcepts] = concepts;

    // const [Areas,SetAreas] = areas
    // const [Area,SetArea] = area
    // const [Description,SetDescription] = description
    // const [Name,SetName] = name
    // const [Concepts,SetConcepts] = concepts;
    // const [Url,SetUrl] = url
    // const [UrlName,SetUrlName] = urlname

    const [ShowAlert, SetShowAlert] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [Add,SetAdd] = useState(false)
    // const [ConceptsList,SetConceptsList] = useState(false)
    const [ShowAlertWarningArea,SetShowAlertWarningArea] = useState(false)

    // const {  } = useContext(ConceptContext);
    const [Source,SetSource] = source;
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts,SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] = targettext




    function handleClose(){
        props.setshowconceptmodal(false)
        SetName(null)
        SetUrl(null)
        SetArea(null)
        SetDescription(null)
        SetShowAlertWarningArea(false)
        SetShowAlert(false)
        SetUrlName(null)

    }
    useEffect(()=>{

        if(ConceptsList){
            var aa = []
            ConceptsList.map(elemento=>{
                var area = elemento['area']
                if(aa.indexOf(area) === -1){
                    aa.push(area)
                }
            })
            console.log('areas',aa)
            SetAreas(aa)

        }

    },[ConceptsList])

    // useEffect(()=>{
    //
    //     axios.get('get_collection_concepts')
    //         .then(response=>{
    //             SetConceptsList(response.data)
    //             var aa = []
    //             response.data.map(elemento=>{
    //                 var area = elemento['area']
    //                 if(aa.indexOf(area) === -1){
    //                     aa.push(area)
    //                 }
    //             })
    //             console.log('areas',aa)
    //             SetAreas(aa)
    //         })
    // },[])






    function submitNewConcept(e){
        e.preventDefault();
        e.stopPropagation();
        let area = 'Default'
        if(Url === null || Name === null || Area === null){
            SetShowAlert(true)
        }else{

            if(Area !== null){
                area = Area.area
            }

        }
        let description = ''
        let existing_concept = ConceptsList.filter(x=>x.url === Url.url)
        if(existing_concept.length === 1){
            description = existing_concept[0].description
        }
        else{
            description = Description
        }
        console.log(props.relation)
        let concept = {concept_url: Url.url,concept_name:Name.name,concept_area:area,concept_description:description}
        if(props.relation === 'predicate'){
            let predicates = PredicateConcepts ? PredicateConcepts : []

            let new_list = [...predicates,concept]
            SetPredicateConcepts(new_list)
            SetPredicateText(Name.name)
        }
        else if(props.relation === 'target'){
            let targets = TargetConcepts ? TargetConcepts : []

            let new_list = [...targets,concept]
            SetTargetConcepts(new_list)
            SetTargetText(Name.name)
        }
        else if(props.relation === 'source'){
            let sources = SourceConcepts ? SourceConcepts : []
            let new_list = [...sources,concept]
            SetSourceConcepts(new_list)
            SetSourceText(Name.name)
        }
        handleClose()

        // props.setshowconceptmodal(false)
    }


    useEffect(()=>{
        if(ConceptsList){
            if(Area === null || (Url === null || Name === null)){
                SetShowAlertWarningArea(false)
            }
            if(Url !== null || Name !== null){
                SetShowAlert(false)

            }
            if(Url !== null && Name !== null && Area !== null){
                ConceptsList.map(x=>{
                    if(x.name === Name.name && x.url === Url.url && x.area !== Area.area){
                        SetShowAlertWarningArea(true)
                    }
                })
            }

        }

    },[Name,Url,Area])






    return (
    <Dialog
        open={props.showconceptmodal}
        onClose={handleClose}

        // hideBackdrop={true}
        // disableEnforceFocus={true}

        // PaperComponent={PaperComponent}
        // aria-labelledby="draggable-dialog-title"
    >
        <RelationConceptContext.Provider value={{area1:[Area,SetArea],areas1:[Areas,SetAreas],name1:[Name,SetName],conceptslist1:[ConceptsList,SetConceptsList],description1:[Description,SetDescription],urlname1:[UrlName,SetUrlName],url1:[Url,SetUrl]}}>

            <div style={{padding:'2%',width:'500px'}}>
                {(Areas && ConceptsList ) ? <>
                    <SelectConcept type={'relationship'} handleclose ={handleClose}   />

                </> :<div className='loading'>
                    <CircularProgress />
                </div>
                    }


            </div>
            <div style={{margin:'3%'}}>
                {ShowAlert && <Alert sx={{marginBottom: '3%'}} severity="error">Please, set an Area, a Name and a URL for the new concept, then, confirm.</Alert>}
                {ShowAlertWarningArea && Area !== null && <Alert severity="warning">This concept already exists and is associated to a different area. If you confirm, this concept
                    will be available also for <b>{Area.area}</b> area.</Alert>}
            </div>

            <DialogActions>


                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
               <Button onClick={submitNewConcept}>Confirm</Button>
            </DialogActions>

        </RelationConceptContext.Provider>

    </Dialog>
);
}
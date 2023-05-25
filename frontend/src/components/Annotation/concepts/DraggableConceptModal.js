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
// export const ConceptContext = createContext('')

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
        relationshipslist,
        concepts,
        curconcept,collectionconcepts,

        curmention,
        endrange,areascolors
    } = useContext(AppContext);

    const {
        areas,
        name,area,
        url,
        urlname,
        conceptslist,
        description
    } = useContext(ConceptContext);

    const [ConceptsList,SetConceptsList] = collectionconcepts
    const [RelationshipsList,SetRelationshipsList] = relationshipslist

    const [End, SetEnd] = endrange
    const [Area,SetArea] = area
    const [Description,SetDescription] = description
    const [Name,SetName] = name
    const [Concepts,SetConcepts] = concepts;
    const [Url,SetUrl] = url
    const [UrlName,SetUrlName] = urlname
    const [ShowAlert, SetShowAlert] = useState(false)
    const [contextMenu, setContextMenu] = useState(null);
    const inputEl = useRef(null);
    const [Add,SetAdd] = useState(false)
    const [CurMention,SetCurMention] = curmention;
    const [Areas,SetAreas] = areas
    const [ShowAlertWarningArea,SetShowAlertWarningArea] = useState(false)
    const [CurConcept,SetCurConcept] = curconcept
    const [SelectedMention, SetSelectedMention] = useState(false)
    const [value,SetValue] = useState(0)

    function handleChangeRadio(e){
        e.preventDefault()
        e.stopPropagation()
        let v = e.target.value
        SetValue(parseInt(v))

        let selected = CurMention[v]

        SetSelectedMention(selected)
    }


    function handleClose(){
        props.setshowconceptmodal(false)
        SetName(null)
        SetUrl(null)
        SetArea(null)
        SetAreas(false)
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



    useEffect(()=>{
        SetUrl(null)
        SetName(null)
        SetArea(null)
    },[])


    function submitNewConcept(e){
        e.preventDefault();
        e.stopPropagation();

        if(Url === null || Name === null || Area === null){
            SetShowAlert(true)
        }else{
            let area = 'Default'
            if(Area !== null && Area){
                area = Area.area
            }

            axios.post('concepts/insert',{mention:CurMention[0],name:Name.name,url:Url.url,area:area,description:Description})
                .then(response=>{
                    SetCurConcept({area:area,concept_name:Name,url:Url})
                    SetConcepts(response.data['concepts'])
                    SetConceptsList(response.data['concepts_list'])
                    SetRelationshipsList(response.data['relationships'])


                    // updateMentionColor(CurMention[0].mentions,CurMention[0].start,CurMention[0].stop,response.data['concepts'],AreasColors)
                    handleClose()

                })
                .catch(error =>{
                    console.log('error',error)
                })

        }


    }
    useEffect(()=>{
        if(ConceptsList){
            if((Area === null) || (Url === null || Name === null)){
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

        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
    >
        {/*<ConceptContext.Provider value={{area:[Area,SetArea],areas:[Areas,SetAreas],name:[Name,SetName],conceptslist:[ConceptsList,SetConceptsList],description:[Description,SetDescription],urlname:[UrlName,SetUrlName],url:[Url,SetUrl]}}>*/}

            <div style={{padding:'2%',width:'500px'}}>
                {(Areas && ConceptsList &&  CurMention) ? <>
                    {CurMention.length === 1 && <SelectConcept type={'concept'} handleclose ={handleClose}   />}
                    {CurMention.length > 1 && <div style={{padding:'3%'}}>
                        <DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
                            Select the mention
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Select the mention you want to associate a concept to
                                <div>
                                    {CurMention.map((m,i)=><div>
                                        <Radio
                                            checked={value === i}
                                            onClick={handleChangeRadio}
                                            value={i}
                                            aria-label={m.mention_text}
                                        />{' '}{m.mention_text}
                                    </div>)}
                                </div>
                            </DialogContentText>

                        </DialogContent>




                    </div>}
                    <div style={{margin:'3%'}}>
                        {ShowAlert && <Alert sx={{marginBottom: '3%'}} severity="error">Please, set an Area, a Name and a URL for the new concept, then, confirm.</Alert>}
                        {ShowAlertWarningArea && Area !== null && Area && <Alert severity="warning">This concept already exists and is associated to a different area. If you confirm, this concept
                            will be available also for <b>{Area.area}</b> area.</Alert>}
                    </div>
                </> :<div className='loading'>
                    <CircularProgress />
                </div>
                    }


            </div>


            <DialogActions>


                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                {CurMention.length === 1 && <Button disabled={Url === '' || Url === false || Name === false || Name === '' || Area === '' || Area === false} onClick={submitNewConcept}>Confirm</Button>}
                {CurMention.length > 1 && <Button onClick={()=>SetCurMention([CurMention[value]])}>Confirm</Button>}
            </DialogActions>

        {/*</ConceptContext.Provider>*/}

    </Dialog>
);
}
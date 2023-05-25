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
import DocumentToolBar from "./DocumentToolBar";
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

export default function LabelsClass(props){
    const { collection,document_id,labels, inarel,labelstosave } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState(false)
    const [ShowSelect,SetShowSelect] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = useState([])
    const [LabelsToSave, SetLabelsToSave] = labelstosave
    const [InARel,SetInARel] = inarel

    function changeLabelList(changeListEl){
        var labels = NotAdded.filter(o => o !== changeListEl)
        SetAnnotatedLabels([...AnnotatedLabels,changeListEl])
        SetLabelsToSave([...LabelsToSave,changeListEl])
        SetNotAdded(labels)
    }


    function deleteLabel(toDel){
        var labels = AnnotatedLabels.filter(o => o !== toDel)
        // AnnotatedLabels.map((o,i)=>{
        //     if(o !== toDel){
        //         labels.push(o)
        //     }
        // })
        SetNotAdded([...NotAdded,toDel])
        SetAnnotatedLabels(labels)

    }

    useEffect(()=>{
        console.log('collection',Collection)
        if(Collection && Labels){
            axios.get('http://127.0.0.1:8000/get_annotated_labels')
                .then(response=>{
                    SetAnnotatedLabels(response.data)
                    var notadded = Labels.filter(o => (response.data).indexOf(o) === -1)
                    SetNotAdded(notadded)
                })
        }
    },[Collection,Labels])


    return(
        <div>
        <h5>
            Labels <i>({AnnotatedLabels.length})</i>
        </h5>
        <div>

            <div style={{display:"inline-block"}}>
            <i><b>{AnnotatedLabels.length}</b> assigned labels</i>
            </div>
            <div style={{display:"inline-block"}}>
                <IconButton onClick={()=> {
                    if(!InARel){
                        SetShowSelect(prev => !prev)

                    }
                }}>
                    {!InARel && <>{ShowSelect ? <RemoveIcon /> : <AddIcon /> }
                    </>}
                </IconButton>
            </div>


        </div>


            <div>

                {AnnotatedLabels.map((o,i)=>
                    <><Chip color="primary" label={o} size="small" onDelete={(e) => deleteLabel(o)}/>{' '}</>
                    )}
            </div>

            <div>
                <Collapse in={ShowSelect && NotAdded}><div>
                    <hr/>
                    <div>
                        <i>Add one or more labels: </i>
                    </div>
                    {NotAdded.length ? NotAdded.map((o,i)=>
                        <><Chip onClick={()=>changeLabelList(o)} color="primary" label = {o} size='small' />{' '}</>

                    ) : <i>No labels to add</i>}
                </div>
                    <hr/>
                </Collapse>
            </div>


        </div>
    );
}
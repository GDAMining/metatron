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
import LabelsSelect from './labels/LabelsSelect'
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

export default function StatsClass(props){
    const { collection,document_id,labels } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState(false)
    const [ShowSelect,SetShowSelect] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = useState([])
    const [CollectionDescription,SetCollectionDescription] = useState(false)

    function changeLabelList(changeListEl){
        var labels = NotAdded.filter(o => o !== changeListEl)
        SetAnnotatedLabels([...AnnotatedLabels,changeListEl])
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
            axios.get('get_annotated_labels')
                .then(response=>{
                    SetAnnotatedLabels(response.data)
                    var notadded = Labels.filter(o => (response.data).indexOf(o) === -1)
                    SetNotAdded(notadded)
                })
        }
    },[Collection,Labels])

    useEffect(()=>{
        console.log('show',ShowSelect)
    },[ShowSelect])

    return(
        <div>
            <h5>
                Documents Stats
            </h5>
            <div>
               <div>
                   <span><i>Annotators: </i></span>
               </div>
                <div>
                    <span><i>Labels annotated: </i></span>
                </div>
                <div>
                    <span><i>Mentions annotated: </i></span>
                </div>

            </div>

        </div>
    );
}
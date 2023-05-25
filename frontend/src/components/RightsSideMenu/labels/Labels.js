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
import LabelsSelect from './LabelsSelect'
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
import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {AppContext} from "../../../App";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import {CircularProgress} from "@mui/material";

export default function LabelsClass(props){
    const { collection,document_id,labels, curannotator,username,inarel,labelstosave,annotatedlabels } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState([])
    const [ShowSelect,SetShowSelect] = useState(false)
    // const [AnnotatedLabels, SetAnnotatedLabels] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = annotatedlabels
    const [LabelsToSave, SetLabelsToSave] = labelstosave
    const [InARel,SetInARel] = inarel
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [Username,SetUsername] = username
    const [Loading,SetLoading] = useState(false)


    function AdddeleteLabel(label){
        SetLoading(true)
        if(CurAnnotator === Username){
            if(AnnotatedLabels.indexOf(label) === -1) {
                // AnnotatedLabels.push(label)
                var labels = NotAdded.filter(o => o !== label)
                SetNotAdded(labels)
                SetAnnotatedLabels([...AnnotatedLabels,label])
                axios.post('labels/insert',{label:label})
                    .then(response=>{
                        var labels = NotAdded.filter(o => o !== label)
                        SetNotAdded(labels)
                        SetAnnotatedLabels([...AnnotatedLabels,label])
                        SetLoading(false)

                    })

            }
            else{
                axios.delete('labels',{data:{label:label}})
                    .then(response=>{
                        SetNotAdded([...NotAdded,label])
                        var labels = AnnotatedLabels.filter(o => o !== label)
                        SetAnnotatedLabels(labels)
                        SetLoading(false)

                    })

            }
        }else{
                if(AnnotatedLabels.indexOf(label) !== -1) {
                    axios.post('labels/copy',{label:label}).then(res=>console.log(res)).catch(error=>console.log(error))
                    SetLoading(false)

                }

            }


    }

    useEffect(()=>{
        if(AnnotatedLabels){
            var notadded = Labels.filter(o => (AnnotatedLabels).indexOf(o) === -1)
            SetNotAdded(notadded)

        }


    },[AnnotatedLabels])


    const labelstheme = createTheme({
        palette: {
            added: {
                main: 'rgb(103, 148, 54)',
                contrastText: '#fff',
            },
            not_added: {
                main: 'rgb(66, 122, 161)',
                contrastText: '#fff',
            },

        },
    });

    return(
        <div>
        <h5>
            Document Labels <i>({AnnotatedLabels.length})</i>
        </h5>
        <div>
            {AnnotatedLabels ? <ThemeProvider theme={labelstheme}>
            {Labels.map(o=>
                <span><Chip color={'not_added'} disabled={Loading} variant={NotAdded.indexOf(o) !== -1 ? "outlined": "filled"} label={o} size="small" onClick={()=>AdddeleteLabel(o)}/>{' '}</span>

            )}

            </ThemeProvider>:<div className='loading'>
                <CircularProgress />
                </div>}


        </div>
        </div>
    );
}
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
import {CircularProgress} from "@mui/material";

export default function MembersComponent(props){
    const { collection,document_id,documentdescription,username, mentions,curannotator,annotatedlabels,concepts,annotators,relationshipslist } = useContext(AppContext);
    const [MentionsList,SetMentionsList] = mentions
    const [ConceptsList,SetConceptsList] = concepts
    const [RelationshipsList,SetRelationshipsList] = relationshipslist
    const [AnnotatedLabels, SetAnnotatedLabels] = annotatedlabels
    const [DocumentDesc,SetDocumentDesc] = documentdescription

    const [Username,SetUsername] = username
    const [Annotators,SetAnnotators] = annotators
    const [CurAnnotator,SetCurAnnotator] = curannotator

    useEffect(()=>{
        if(Annotators){
            let annotators = []
            Annotators.map(x=>{
                if(x === Username){
                    annotators.splice(0, 0, x);
                }else{
                    annotators.push(x)
                }
            })
            SetAnnotators(annotators)

        }
    },[])


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
                Annotators
            </h5>
            <div>
                {Annotators ? <div>
                    {Annotators.length > 0 && <i>Click on a member to check her annotation</i>}
                    <div style={{paddingTop:'2%'}}>
                        {Annotators.map(annotator=>
                            <div>
                                <Chip sx={{marginTop:'5px',marginBottom:'5px'}} label={annotator === Username ? 'You' : annotator} color={'primary'} variant={CurAnnotator === annotator ? 'filled':"outlined"} onClick={(e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if(CurAnnotator !== annotator){

                                        SetDocumentDesc(false)
                                        SetMentionsList(false);
                                        SetConceptsList(false);
                                        SetRelationshipsList(false);
                                        SetAnnotatedLabels(false);
                                        SetCurAnnotator(annotator)
                                    }
                                 }} />
                            </div>
                        )}
                        {Annotators.length === 0 && <div>There are not annotators for this document yet</div>}

                    </div>




                </div> : <div className='loading'><CircularProgress /></div>}
                {/*{AnnotatedLabels ? <ThemeProvider theme={labelstheme}>*/}
                {/*    {Labels.map(o=>*/}
                {/*        <span><Chip color={'not_added'} variant={NotAdded.indexOf(o) !== -1 ? "outlined": "filled"} label={o} size="small" onClick={()=>AdddeleteLabel(o)}/>{' '}</span>*/}

                {/*    )}*/}

                {/*</ThemeProvider>:<div className='loading'>*/}
                {/*    <CircularProgress />*/}
                {/*</div>}*/}


            </div>
        </div>
    );
}
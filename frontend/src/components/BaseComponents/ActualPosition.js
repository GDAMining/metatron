import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {AppContext} from "../../App";

export default function ActualPosition(props){
    const { collection,document_id,collectiondocuments } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [CollectionDescription,SetCollectionDescription] = useState(false)
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [Doc,SetDoc] = useState(null)
    useEffect(()=>{
        console.log('collection',Collection)
        if(Collection){
            axios.get('collections/name',{params:{collection:Collection}})
                .then(response=>{
                    SetCollectionDescription(response.data['name'])
                })
        }
    },[Collection])

    useEffect(()=>{
        if(CollectionDocuments && DocumentID){
            CollectionDocuments.map(doc=>{
                if(doc.hashed_id === DocumentID){
                    SetDoc(doc.id)
                }
            })
        }

    },[CollectionDocuments,DocumentID])

    return(
        <div className='inline'>
            {CollectionDescription && Doc && DocumentID && <div role="presentation">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="inherit"
                        href="collections"
                    >
                        {/*<CollectionsBookmarkIcon sx={{ mr: 0.5 }} fontSize="inherit" />*/}
                        {CollectionDescription}
                    </Link>
                    <Link
                        underline="hover"
                        sx={{display: 'flex', alignItems: 'center'}}
                        color="text.primary"
                        href={"collections/" + Collection}
                    >
                        {/*<ArticleIcon sx={{ mr: 0.5 }} fontSize="inherit" />*/}
                        {Doc}
                    </Link>

                </Breadcrumbs>
            </div>}



            {/*<span style={{display:'inline-block'}}><h3>{props.collection_name}</h3></span >&nbsp;&nbsp;{bull}&nbsp;&nbsp;<span style={{display:'inline-block'}}><h4>{props.document_id}</h4></span>*/}
            {/*<span style={{display:'inline-block'}}><h3>Collection name</h3></span >&nbsp;&nbsp;/&nbsp;&nbsp;<span style={{display:'inline-block'}}><h4>Doc id</h4></span>*/}
        </div>
    );
}
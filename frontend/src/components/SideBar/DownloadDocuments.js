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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UploadIcon from '@mui/icons-material/Upload';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ArticleIcon from '@mui/icons-material/Article';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export default function DownloadDocument(props){
    const { collection,document_id,users,username, inarel,labelstosave,showfilter,fields,fieldsToAnn,expand } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Username,SetUsername] = username
    const [Batch,SetBatch] = useState(false)
    const [FormatValue,SetFormatValue] = useState('json')
    const [AnnotatorValue,SetAnnotatorValue] = useState(Username)
    const [AnnotationValue,SetAnnotationValue] = useState('mentions')
    const [DocumentsValue,SetDocumentsValue] = useState(DocumentID)
    const [BatchValue,SetBatchValue] = useState(1)
    const [UsersList,SetUsersList] = users
    var FileDownload = require('js-file-download');

    useEffect(()=>{

        let max_batch = 0
        axios.get('get_batches')
            .then(response=> {
                console.log('response',response.data['max_batch'])
                max_batch = response.data['max_batch']
                SetBatch(max_batch)
            })
            .catch(e=>console.log(e))
        axios.get('collections/users',{params:{collection:Collection}})
            .then(response=>{
                SetUsersList(response.data['members'])
            })
            .catch(error=>{
                console.log('error',error)

            })


    },[])

    useEffect(()=>{
        if(Username){
            SetAnnotatorValue(Username)
        }
        if(DocumentID){
            SetDocumentsValue(DocumentID)
        }
    },[Username,DocumentID])


    function downloadAnnotations(e){
        e.preventDefault()
        e.stopPropagation()
        axios.get('download_annotations', {
            params: {
                format: FormatValue,
                annotators: AnnotatorValue,
                annotation: AnnotationValue,
                document: DocumentsValue,
                batch:BatchValue,
            }
        })
            .then(function (response) {
                console.log('message', response.data);
                let filename = AnnotationValue + '.'+FormatValue.toLowerCase()
                if(FormatValue === 'json' || FormatValue === 'biocjson'){
                    FileDownload(JSON.stringify(response.data,null,4), filename);

                }else{
                    FileDownload((response.data), filename);

                }


            })
            .catch(function (error) {

                console.log('error message', error);
            });


    }

    return(
        <div className='download'>



            <h5>Download</h5>
            <div className='selectclass'>
                <FormControl fullWidth>
                <InputLabel id="format">Format</InputLabel>
                <Select
                    labelId="format"
                    id="format"
                    value={FormatValue}
                    sx={{width:'100%'}}
                    label="Format"
                    size={'small'}

                    onChange={(e)=>{SetFormatValue(e.target.value)}}
                >

                    <MenuItem value={'json'}>JSON</MenuItem>
                    <MenuItem value={'csv'}>CSV</MenuItem>
                    {AnnotationValue !== 'labels' && AnnotationValue !== 'assertions' && <MenuItem value={'xml'}>BioC/XML</MenuItem>}
                    {/*<MenuItem value={'biocxml'}>BIOC/XML</MenuItem>*/}
                    {/*<MenuItem value={'biocjson'}>BIOC/JSON</MenuItem>*/}
                </Select></FormControl>
            </div>

            <div className='selectclass'><FormControl fullWidth>
                <InputLabel id="doc">Documents</InputLabel>
                <Select
                    labelId="doc"
                    id="format_select"
                    size={'small'}


                    value={DocumentsValue}
                    sx={{width:'100%'}}
                    label="Documents"
                    onChange={(e)=>{SetDocumentsValue(e.target.value)}}
                >

                    <MenuItem value={DocumentID}>This document</MenuItem>
                    <MenuItem value={'all'}>All collection</MenuItem>

                </Select></FormControl>
            </div>

            {DocumentsValue === 1 && Batch > 0 && <div className='selectclass'><FormControl fullWidth>
                <InputLabel id="doc">Batch</InputLabel>
                <Select
                    labelId="doc"
                    id="format_select"
                    value={BatchValue}
                    sx={{width: '100%'}}
                    size={'small'}

                    label="Batch"
                    onChange={(e) => {
                        SetBatchValue(e.target.value)
                    }}
                >

                    {Array.from({length:parseInt(Batch)},(v,k)=>k+1).map(batch =>
                        <MenuItem value={parseInt(batch)}>{batch.toString()}</MenuItem>)}
                    <MenuItem value={'all'}>All batches</MenuItem>

                </Select></FormControl>
            </div>}

            <div className='selectclass'><FormControl fullWidth>
                <InputLabel id="ann">Annotation</InputLabel>
                <Select
                    labelId="ann"
                    id="format_select"
                    value={AnnotationValue}
                    sx={{width:'100%'}}
                    size={'small'}

                    label="annotation"
                    onChange={(e)=>{SetAnnotationValue(e.target.value)}}
                >

                    <MenuItem value={'mentions'}>Mentions</MenuItem>
                    <MenuItem value={'concepts'}>Concepts</MenuItem>
                    <MenuItem value={'relationships'}>Relationships</MenuItem>
                    {FormatValue !== 'xml' && <MenuItem value={'assertions'}>Document assertions</MenuItem>}
                    {FormatValue !== 'xml' && <MenuItem value={'labels'}>Document labels</MenuItem>}
                    {FormatValue === 'json' && <MenuItem value={'all'}>All</MenuItem>}

                </Select></FormControl>
            </div>

            {UsersList && <div className='selectclass'><FormControl fullWidth>
                <InputLabel id="annotator">Annotator</InputLabel>
                <Select
                    labelId="annotator"
                    id="format_select"
                    value={AnnotatorValue}
                    sx={{width: '100%'}}
                    label="Annotator"
                    size={'small'}
                    onChange={(e) => {
                        SetAnnotatorValue(e.target.value)
                    }}
                >

                    <MenuItem value={Username}>{Username}</MenuItem>
                    {UsersList.map(u => <MenuItem value={u.username}>{u.username}</MenuItem>)}



                    <MenuItem value={'IAA-Inter Annotator Agreement'}>IAA-Inter Annotator Agreement</MenuItem>
                    <MenuItem value={'all'}>All</MenuItem>

                </Select></FormControl>
            </div>}
            <Button className='selectclass' onClick={downloadAnnotations} variant="contained">Download</Button>


        </div>
    );
}
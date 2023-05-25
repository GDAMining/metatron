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
import ColorPickerComponent from "./utils/ColorPicker";
import Slider from "@mui/material/Slider";
import FilterComponent from "./utils/Filter";
export default function UploadDocument(props){
    const { collection,document_id,showupload,username, collectionconcepts,collectionslist,opensnack,snackmessage,expand,collectiondocuments,loadingann } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Username,SetUsername] = username
    const [LoadingNewAnn, SetLoadingNewAnn] = loadingann;
    const [Batch,SetBatch] = useState(false)
    const [FormatValue,SetFormatValue] = useState('json')
    const [AnnotatorValue,SetAnnotatorValue] = useState(0)
    const [AnnotationValue,SetAnnotationValue] = useState('mentions')
    const [DocumentsValue,SetDocumentsValue] = useState(0)
    const [BatchValue,SetBatchValue] = useState(1)
    var FileDownload = require('js-file-download');
    const [UploadAnnotation,SetUploadAnnotation] = useState(false)
    const [UploadDocuments,SetUploadDocuments] = useState(false)
    const [UploadConcepts,SetUploadConcepts] = useState(false)
    const [CollList,SetCollList] = collectionslist
    const [Message,SetMessage] = useState(false)
    const [Creator,SetCreator] = useState(false)
    const [UploadOpenaireDocuments,SetUploadOpenaireDocuments] = useState(false)
    const [UploadSemanticScholarDocuments,SetUploadSemanticScholarDocuments] = useState(false)
    const [UploadPubmedDocuments,SetUploadPubmedDocuments] = useState(false)
    const [PubmedId,SetPubmedId] = useState('')
    const [SemanticID,SetSemanticID] = useState('')
    const [OpenAIREId,SetOpenAIREId] = useState('')
    const [Files, SetFiles] = useState([])
    const [ConceptsFiles, SetConceptsFiles] = useState([])
    const [AnnotationsFiles, SetAnnotationsFiles] = useState([])
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack
    const [ShowUpload,SetShowUpload] =showupload
    const [Expand,SetExpand] =expand
    const [NewBatch,SetNewBatch] = useState(false)
    const [UpdateDocuments,SetUpdateDocuments] = useState(false)
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [CollectionConcepts,SetCollectionConcepts] = collectionconcepts


    useEffect(()=>{
        if(CollList){
            CollList.map(col=>{
                if(col.id === Collection){
                    SetCreator(col.creator)
                }
            })
        }
    },[CollList])



    function AddFiles(type){

        if(type === 'documents'){
            var input = document.getElementById('documents_to_upload');
            var files = []
            if(input.files[0] !== undefined || input.files[0] !== null) {
                for (let ind = 0; ind < input.files.length; ind++) {
                    console.log('nome file',input.files[ind].name)
                    if(input.files[ind].name.endsWith('csv') || input.files[ind].name.endsWith('json') || input.files[ind].name.endsWith('txt')|| input.files[ind].name.endsWith('pdf')){
                        files.push(input.files[ind])

                    }
                }

            }

            SetFiles(files)
        }

        else if(type === 'concepts'){
            var input = document.getElementById('concepts_to_upload');
            // SetInpuLength(input.files.length)
            var files = []
            if(input.files[0] !== undefined || input.files[0] !== null) {
                for (let ind = 0; ind < input.files.length; ind++) {
                    if(input.files[ind].name.endsWith('csv') || input.files[ind].name.endsWith('json')){
                        files.push(input.files[ind])

                    }
                }


            }

            SetConceptsFiles(files)

        }else if(type === 'annotations'){
            var input = document.getElementById('annotations_to_upload');
            // SetInpuLength(input.files.length)
            var files = []
            if(input.files[0] !== undefined || input.files[0] !== null) {
                for (let ind = 0; ind < input.files.length; ind++) {
                    if(input.files[ind].name.endsWith('csv') || input.files[ind].name.endsWith('json')){
                        files.push(input.files[ind])

                    }
                }


            }

            SetAnnotationsFiles(files)
        }

    }



    const handleChangePubmedId = (event) => {
        SetPubmedId(event.target.value);
        SetMessage(false)

    };
    const handleChangeOpenaireId = (event) => {
        SetOpenAIREId(event.target.value);
        SetMessage(false)
    };
    const handleChangeSemanticId = (event) => {
        SetSemanticID(event.target.value);
        SetMessage(false)

    };



    function GetFiles(type){
        var formData = new FormData();
        var files = []
        if(Files && (type === 'documents' || type === 'all')){

            for (let ind = 0; ind < Files.length; ind++) {
                formData.append('document_' + ind.toString(), Files[ind]);
            }

        }
        if(ConceptsFiles && (type === 'concepts' || type === 'all')) {

            for (let ind = 0; ind < ConceptsFiles.length; ind++) {
                formData.append('concept_' + ind.toString(), ConceptsFiles[ind]);
            }
        }
        if(AnnotationsFiles && (type === 'annotations' || type === 'all')) {

            for (let ind = 0; ind < ConceptsFiles.length; ind++) {
                formData.append('annotation_' + ind.toString(), ConceptsFiles[ind]);
            }
        }

        return formData

    }



    function uploadData(e){
            e.preventDefault()
            var input = ''
            var formData = new FormData();
            // let formData = GetFiles('all')
            // if(type === 'pubmed') {
            if(Username === Creator){
                input = document.getElementById('pubmed_ids');
                var pubmed = input.value
                formData.append('pubmed_ids', pubmed);
                console.log(pubmed)

                // }else if (type === 'semantic'){
                input = document.getElementById('semantic_ids');
                var semantic = input.value
                formData.append('semantic_ids', semantic);
                console.log(semantic)

                // }else if (type === 'openaire'){
                input = document.getElementById('openaire_ids');
                var openaire = input.value
                formData.append('openaire_ids', openaire);
                for (let ind = 0; ind < Files.length; ind++) {
                    formData.append('document_' + ind.toString(), Files[ind]);
                }
            }


            // }else if (type === 'concepts'){
            // formData = GetFiles('concepts')
            for (let ind = 0; ind < ConceptsFiles.length; ind++) {
                formData.append('concept_' + ind.toString(), ConceptsFiles[ind]);
            }
            // }else if (type === 'documents'){
            // formData = GetFiles('documents')

                // let formData = GetFiles('all')
            // }else if (type === 'annotations'){
            // formData = GetFiles('annotations')
            for (let ind = 0; ind < AnnotationsFiles.length; ind++) {
                formData.append('annotation_' + ind.toString(), AnnotationsFiles[ind]);
            }
            if (AnnotationsFiles.length > 0){

                formData.append('type_annotation',AnnotationValue)
            }
            formData.append('new_batch',NewBatch)

        // }
            SetOpenSnack(true)

            axios({
                method: "post",
                url: "upload",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })

                .then(function (response) {
                    //handle success
                    if (AnnotationsFiles.length > 0) {
                        SetLoadingNewAnn(true)
                    }
                    SetUpdateDocuments(true)
                    SetShowUpload(false)
                    SetExpand(false);
                    console.log(response);
                    SetSnackMessage({'message': 'Saved'});


                })
                .catch(function (response) {
                    //handle error
                    if(response.response['data']['error'] === 'Not found'){
                        SetMessage({'message': 'Not found'});
                    }else{
                        SetSnackMessage({'message': 'ERROR'});
                        console.log(response);
                    }
                    SetOpenAIREId('')
                    SetPubmedId('')
                    SetSemanticID('')


                });
        }


    useEffect(()=>{
        if(UpdateDocuments){
            console.log('update')
            axios.get('collections/documents')
                .then(response=>{
                    SetCollectionDocuments(response.data)
                    SetUpdateDocuments(false)


                })
            axios.get('collections/concepts')
                .then(response=>{
                    SetCollectionConcepts(response.data)
                    SetUpdateDocuments(false)

                })
        }
    },[UpdateDocuments])


    return(
        <div >



            <h5>Upload</h5>

            <div className={'upload'}>


            <h6 className='h5toexpand' onClick={()=> {
                SetUploadAnnotation(prev=>!prev)
            }}>
                Annotations
            </h6>

            <Collapse in={UploadAnnotation}>
            <i>Upload the annotations for your documents</i>


            <div className='selectclass'><FormControl fullWidth>
                <InputLabel id="ann">Annotation</InputLabel>
                <Select
                    labelId="ann"
                    id="format_select"
                    value={AnnotationValue}
                    sx={{width:'100%'}}
                    size={'small'}

                    label="Annotator"
                    onChange={(e)=>{SetAnnotationValue(e.target.value)}}
                >

                    <MenuItem value={'mentions'}>Mentions</MenuItem>
                    <MenuItem value={'concepts'}>Concepts</MenuItem>
                    <MenuItem value={'relationships'}>Relationships</MenuItem>
                    <MenuItem value={'labels'}>Document labels</MenuItem>
                    <MenuItem value={'assertions'}>Document assertions</MenuItem>

                </Select></FormControl>
            </div>
                <Button startIcon={<AddIcon />} color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="*" id="annotations_to_upload" onChange={()=>{AddFiles('annotations')}} multiple type="file" />
                    Annotations
                </Button>
                {AnnotationsFiles &&
                <>
                    {AnnotationsFiles.length > 0 && <div><b>Uploaded annotation files:</b></div>}
                    {AnnotationsFiles.map(file=>
                        <div>
                            <span>{file.name}</span>{' '}<span><IconButton onClick={()=>{
                            let conc = AnnotationsFiles.map(x=>x)
                            conc = conc.filter(x=>x.name !== file.name)
                            SetAnnotationsFiles(conc)
                        }}><DeleteIcon/></IconButton></span>
                        </div>
                    )}
                </>}
            {/*<Button variant="contained" component="label">*/}
            {/*    Upload*/}
            {/*    <input accept="*" id="annotations_to_upload" onChange={()=>{AddFiles('annotations')}} multiple type="file" />*/}
            {/*    /!*<input id={'files_to_upload'} hidden  multiple type="file" onClick={GetFiles}/>*!/*/}
            {/*</Button>*/}
            </Collapse>

            <br/>
            <h6 className='h5toexpand' onClick={()=> {
                SetUploadConcepts(prev=>!prev)
            }}>
                Concepts
            </h6>
            <Collapse in={UploadConcepts}>
                <i>Upload new concepts</i>
                <div>
                    <Button startIcon={<AddIcon />} color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="*" id="concepts_to_upload" onChange={()=>{AddFiles('concepts')}} multiple type="file" />
                        Concepts
                    </Button>

                    {/*<Button variant="contained" component="label">*/}
                    {/*    Upload*/}
                    {/*    <input accept="*" id="concepts_to_upload" onChange={()=>{AddFiles('concepts')}} multiple type="file" />*/}
                    {/*</Button>*/}
                </div>

                {ConceptsFiles &&
                <>
                    {ConceptsFiles.length > 0 && <div><b>Uploaded concepts files:</b></div>
                    }
                    {ConceptsFiles.map(file=>
                        <div>
                            <span>{file.name}</span>{' '}<span><IconButton onClick={()=>{
                            let conc = Files.map(x=>x)
                            conc = conc.filter(x=>x.name !== file.name)
                            SetConceptsFiles(conc)
                        }}><DeleteIcon/></IconButton></span>
                        </div>
                    )}
                </>}



            </Collapse>

            <br/>
            <h6 className='h5toexpand' onClick={()=> {
                SetUploadDocuments(prev=>!prev)
            }}>
                Documents
            </h6>
            <Collapse in={UploadDocuments}>
                <div><i>Upload new documents</i></div>
                {Creator === Username ? <>
                    <Button startIcon={<AddIcon />} color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="*" id="documents_to_upload" onChange={()=>{AddFiles('documents')}} multiple type="file" />
                        Documents
                    </Button>
                    {Files &&
                <>
                    {Files.length > 0 && <div><b>Uploaded document files:</b></div>
                    }
                    {Files.map(file=>
                        <div>
                            <span>{file.name}</span>{' '}<span><IconButton onClick={()=>{
                            let conc = Files.map(x=>x)
                            conc = conc.filter(x=>x.name !== file.name)
                            SetFiles(conc)
                        }}><DeleteIcon/></IconButton></span>
                        </div>
                    )}
                </>}

                    {/*<Button variant="contained" component="label">*/}
                    {/*    Upload*/}
                    {/*    <input accept="*" id="documents_to_upload" onChange={()=>{AddFiles('documents')}} multiple type="file" />*/}
                    {/*</Button>*/}
                </> : <>
                    Only {Creator}, the creator of the collection, is allowed to upload new documents.
                </>}



            </Collapse>

            <br/>
            <h6 className='h5toexpand' onClick={()=> {
                SetUploadPubmedDocuments(prev=>!prev)
            }}>
                PubMed IDs
            </h6>
            <Collapse in={UploadPubmedDocuments}>
                <div><i>Upload new documents</i></div>
                {Creator === Username ? <>
                    <TextField
                        id="pubmed_ids"
                        // placeholder="PubMed IDs commma separated: 1234,12,456"
                        label="PubMed IDs"
                        multiline
                        onChange={(e)=>handleChangePubmedId(e)}
                        value={PubmedId}
                        sx={{width: '100%',marginTop:'15px',marginRight:'5px'}}
                        helperText="PubMed IDs must be single space separated: 123 12 456"
                        rows={3}
                    />
                    {/*<Button variant="contained" component="label">*/}
                    {/*    Upload*/}
                    {/*    <input id={'documents_to_upload'} hidden multiple type="file" onClick={GetDocumentsFiles}/>*/}
                    {/*</Button>*/}
                </> : <>
                    Only {Creator}, the creator of the collection, is allowed to upload new documents.
                </>}



            </Collapse>
            <br/>
            <h6 className='h5toexpand' onClick={()=> {
                SetUploadSemanticScholarDocuments(prev=>!prev)
            }}>
                Semantic Scholar articles
            </h6>
            <Collapse in={UploadSemanticScholarDocuments}>
                <div><i>Upload new documents</i></div>
                {Creator === Username ? <>
                    <TextField
                        id="semantic_ids"
                        // placeholder="PubMed IDs commma separated: 1234,12,456"
                        label="DOI in Semantic Scholar"
                        multiline
                        onChange={(e)=>handleChangeSemanticId(e)}
                        value={SemanticID}
                        sx={{width: '100%',marginTop:'15px',marginRight:'5px'}}
                        helperText="DOIs must be single-space separated"
                        rows={3}
                    />
                </> : <>
                    Only {Creator}, the creator of the collection, is allowed to upload new documents.
                </>}



            </Collapse>
            <br/>
            <h6 className='h5toexpand' onClick={()=> {
                SetUploadOpenaireDocuments(prev=>!prev)
            }}>
                OpenAIRE articles
            </h6>
            <Collapse in={UploadOpenaireDocuments}>
                <div><i>Upload new documents</i></div>
                {Creator === Username ? <>
                    <TextField
                        id="openaire_ids"
                        // placeholder="PubMed IDs commma separated: 1234,12,456"
                        label="DOI in OpenAIRE"
                        multiline
                        onChange={(e)=>handleChangeOpenaireId(e)}
                        value={OpenAIREId}
                        sx={{width: '100%',marginTop:'15px',marginRight:'5px'}}
                        helperText="DOIs must be single-space separated"
                        rows={3}
                    />
                </> : <>
                    Only {Creator}, the creator of the collection, is allowed to upload new documents.
                </>}



            </Collapse>

            <div style={{marginTop:'20px'}}>
                <FormGroup>
                    <FormControlLabel onChange={(e)=>(SetNewBatch(e.target.checked))} control={<Checkbox />} label="Upload in a new batch" />
                </FormGroup>

                <Button variant="contained" onClick={uploadData}>
                    Upload
                </Button>
            </div >
                {Message && Message.message.toLowerCase() === 'not found' && <div style={{margin:'5px 0'}}><h6 style={{color:"royalblue"}}>One or more documents not found.</h6></div>}

            </div>




        </div>
    );
}
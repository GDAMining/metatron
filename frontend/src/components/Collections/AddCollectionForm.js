import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Chip from '@mui/material/Chip';

import './collection.css'
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import UploadIcon from '@mui/icons-material/Upload';
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
import Collection from "./Collection";
import DocumentToolBar from "../Document/ToolBar/DocumentToolBar";
import ToolBar from "../BaseComponents/ToolBar";
import IconButton from '@mui/material/IconButton';
import Collapse from "@material-ui/core/Collapse";
import Checkbox from '@mui/material/Checkbox';
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {CollectionContext} from "./CollectionsList";
import {AppContext} from "../../App";
import {forEach} from "react-bootstrap/ElementChildren";

export default function AddCollectionForm(){
    const {addcollection,collectionlist,updatecollection} = useContext(CollectionContext);
    const {users,username} = useContext(AppContext);
    const [AddCollection,SetAddCollection] = addcollection
    const [Description,SetDescription] = useState('')
    const [Title,SetTitle] = useState('')
    const [PubmedId,SetPubmedId] = useState('')
    const [SemanticID,SetSemanticID] = useState('')
    const [OpenAIREId,SetOpenAIREId] = useState('')
    const [ShowAreaPubmed,SetShowAreaPubmed] = useState(false)
    const [ShowAreaOpenAIRE,SetShowAreaOpenAIRE] = useState(false)
    const [ShowSemantic,SetShowSemantic] = useState(false)
    const [InpuLength,SetInpuLength] = useState(false)
    const [Users,SetUsers] = users
    const [LabelsToAdd,SetLabelsToAdd] = useState([])
    const [Username,SetUsername] = username
    const [SelectedMembers,SetSelectedMembers] = useState([])
    const [UpdateCollection,SetUpdateCollection] = updatecollection
    const [ShowDocumentsUpload,SetShowDocumentsUpload] = useState(true)
    const [ShowError,SetShowError] = useState(false)
    const [Files, SetFiles] = useState([])
    const [OpenAIREFiles, SetOpenAIREFiles] = useState([])
    const [PubmedFiles, SetPubmedFiles] = useState([])
    const [SemanticFiles, SetSemanticFiles] = useState([])
    const [ConceptsFiles, SetConceptsFiles] = useState([])
    const [options,SetOptions] = useState([])
    const [textual_user,Settextual_user] = useState('')
    var FileDownload = require('js-file-download');

    // useEffect(()=>{
    //     axios.get("get_users_list")
    //         .then(response => {
    //             if(response.data['users'].length>0){
    //                 SetUsers(response.data['users'])
    //             }})
    //         .catch(error=>{
    //             console.log(error)
    //         })
    // },[])

    useEffect(()=>{
        if(Users && Username){
            var opt = Users
            console.log(opt)
            var profiles = []
            // for (let ind = 0; ind < Users.length; ind++) {
            //     if(profiles.indexOf(Users[ind].profile) === -1){
            //         profiles.push(Users[ind].profile)
            //         var str_name = 'All' +' '+ Users[ind].profile
            //         opt.push({'username':str_name,'profile':Users[ind].profile})
            //     }
            // }
            for (let i = 0; i < profiles.length; i++) {
                var count_p = 0
                // console.log('opt',profiles[i])
                for (let ind = 0; ind < opt.length; ind++) {
                    if(opt[ind].profile === profiles[i]){
                        console.log('us',opt[ind])
                        count_p = count_p + 1

                    }
                }
                if(count_p <= 1){

                    opt = opt.filter(o => o.profile !== profiles[i])

                }

            }
            SetOptions(opt)
        }

    },[Users,Username])

    useEffect(()=>{
        console.log('opts',options.find(x=>x.username === Username))
    },[options])



    const handleChangeDesc = (event) => {
        SetDescription(event.target.value);
    };
    const handleChangeTitle = (event) => {
        SetTitle(event.target.value);
    };
    const handleChangePubmedId = (event) => {
        SetPubmedId(event.target.value);
    };
    const handleChangeOpenaireId = (event) => {
        SetOpenAIREId(event.target.value);
    };
    const handleChangeSemanticId = (event) => {
        SetSemanticID(event.target.value);
    };
    const handleChangeLabels = (event)=>{
        SetLabelsToAdd(event.target.value)
    }

    useEffect(()=>{
        if(!AddCollection){
            clearFields()
        }
    },[AddCollection])

    const clearFields = () => {
        SetDescription('')
        SetTitle('')
        SetSelectedMembers([])
        SetPubmedId('')
        // delete files
        DeleteFiles()

        // delete members

        // delete pubmed ids

    }


    const theme = createTheme({
        palette: {
            neutral: {
                main: '#64748B',
                contrastText: '#fff',
            },
            neutral_pubmed: {
                main: '#0e2f44',
                contrastText: '#fff',
            },
            neutral_updload: {
                main: '#daa520',
                contrastText: '#fff',
            },
        },
    });
    const Input = styled('input')({
        display: 'none',
    });

    function AddFiles(type){
        SetShowError(false)
        if(type === 'documents'){
            var input = document.getElementById('files_to_upload');
            // SetInpuLength(input.files.length)
            var files = []
            if(input.files[0] !== undefined || input.files[0] !== null) {
                for (let ind = 0; ind < input.files.length; ind++) {
                    if(input.files[ind].name.endsWith('csv') || input.files[ind].name.endsWith('json') || input.files[ind].name.endsWith('txt')){
                        files.push(input.files[ind])

                    }
                }

            }

            SetFiles(files)
        }
        // else if(type === 'pubmed'){
        //     var input = document.getElementById('pubmed_to_upload');
        //     // SetInpuLength(input.files.length)
        //     var files = []
        //     if(input.files[0] !== undefined || input.files[0] !== null) {
        //         for (let ind = 0; ind < input.files.length; ind++) {
        //             files.push(input.files[ind])
        //         }
        //
        //     }
        //
        //     SetPubmedFiles(files)
        // }else if(type === 'semantic'){
        //     var input = document.getElementById('semantic_to_upload');
        //     // SetInpuLength(input.files.length)
        //     var files = []
        //     if(input.files[0] !== undefined || input.files[0] !== null) {
        //         for (let ind = 0; ind < input.files.length; ind++) {
        //             files.push(input.files[ind])
        //         }
        //
        //     }
        //
        //     SetSemanticFiles(files)
        // }
        // else if(type === 'openaire'){
        //     var input = document.getElementById('openaire_to_upload');
        //     // SetInpuLength(input.files.length)
        //     var files = []
        //     if(input.files[0] !== undefined || input.files[0] !== null) {
        //         for (let ind = 0; ind < input.files.length; ind++) {
        //             if(input.files[ind].endsWith('csv') || input.files[ind].endsWith('json')){
        //                 files.push(input.files[ind])
        //
        //             }
        //
        //     }
        //
        //     SetOpenAIREFiles(files)
        else if(type === 'concepts'){
            SetShowError(false)
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
        }

    }




    function DeleteFiles(){
        var input = document.getElementById('files_to_upload');
        // SetInpuLength(false)
        input.value  = null
        SetFiles([])
        SetConceptsFiles([])
        SetPubmedFiles([])
        SetOpenAIREFiles([])
        SetSemanticFiles([])

    }
    function GetFiles(type){
        var formData = new FormData();
        var files = []
        if(Files && (type === 'documents' || type === 'all')){
            // var name = 'files_to_upload'
            // var input = document.getElementById('files_to_upload');
            // // console.log('test input',input.files)
            // if(input.files[0] !== undefined || input.files[0] !== null) {
            //     for (let ind = 0; ind < input.files.length; ind++) {
            //         if (input.files[ind].endsWith('json') || input.files[ind].endsWith('csv')){
            //             files = input.files[ind]
            //
            //         }
            //
            //     }
            for (let ind = 0; ind < Files.length; ind++) {
                formData.append('document_' + ind.toString(), Files[ind]);
            }

        }
        if(ConceptsFiles && (type === 'concepts' || type === 'all')) {
            // var name = 'concepts_to_upload'
            // var input = document.getElementById('concepts_to_upload');
            // if(input.files[0] !== undefined || input.files[0] !== null) {
            //     for (let ind = 0; ind < input.files.length; ind++) {
            //         if (input.files[ind].endsWith('json') || input.files[ind].endsWith('csv')){
            //             files = input.files[ind]
            //
            //         }
            //
            //     }
            for (let ind = 0; ind < ConceptsFiles.length; ind++) {
                formData.append('concepts_' + ind.toString(), ConceptsFiles[ind]);
            }
        }

        return formData

    }



    function uploadData(){

        SetShowError(false)
        if(Title === '' ){
            SetShowError('Please, add the collection name before confirm.')
        }
        else if (PubmedId === '' && OpenAIREId === '' && SemanticID === '' && Files.length === 0 && PubmedFiles.length === 0 && OpenAIREFiles.length === 0 && SemanticFiles.length === 0){
            SetShowError('Please, add at least a document (or its ID) before confirm.')
        }
        else{
            var input = ''
            // var formData = new FormData();
            let formData = GetFiles('all')

            input = document.getElementById('pubmed_ids');
            var pubmed = input.value
            formData.append('pubmed_ids', pubmed);
            console.log(pubmed)

            input = document.getElementById('openaire_ids');
            var openaire = input.value
            formData.append('openaire_ids', openaire);
            console.log(pubmed)

            input = document.getElementById('semantic_ids');
            var semantic = input.value
            formData.append('semantic_ids', semantic);
            console.log(semantic)

            input = document.getElementById('collection_name');
            var name1 = input.value
            console.log(name1)

            input = document.getElementById('labels');
            var labels = input.value
            console.log(labels)

            input = document.getElementById('collection_description');
            var desc = input.value
            console.log(desc)
            formData.append('name', name1);
            formData.append('description', desc)
            formData.append('labels', labels)
            if(Users.length > 1 && SelectedMembers.length > 0){
                // input = document.getElementById('members');
                var sels = []
                SelectedMembers.map((s,i)=>{
                    sels.push(s)

                    // sels.push(s.username)
                })
                formData.append('members', SelectedMembers)
                console.log('members',SelectedMembers)
            }else{
                formData.append('members', '')
            }

            // input = document.getElementById('files_to_upload');
            // // console.log('test input',input.files)
            // if(input.files[0] !== undefined || input.files[0] !== null) {
            //     for (let ind = 0; ind < input.files.length; ind++) {
            //         var name = 'files_to_upload'
            //         formData.append(name, input.files[ind]);
            //     }
            // }
            // input = document.getElementById('concepts_to_upload');
            // // console.log('test input',input.files)
            // if(input.files[0] !== undefined || input.files[0] !== null) {
            //     for (let ind = 0; ind < input.files.length; ind++) {
            //         var name = 'concepts_to_upload'
            //         formData.append(name, input.files[ind]);
            //     }
            // }

            axios({
                method: "post",
                url: "collections",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            })

                .then(function (response) {
                    //handle success
                    console.log(response);
                    SetAddCollection(false) // close window
                    SetUpdateCollection(true) // reload collection list

                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    SetShowError('An error occurred.')

                });
        }



    }
    function DownloadTemplate(type){
        axios.get('download_template_concepts',{params:{type:type}})
            .then(response=>{
                if(type === 'json' ){
                    FileDownload(JSON.stringify(response.data,null,4), 'template_concepts.json');

                }else if (type === 'doc_json' ){
                    FileDownload(JSON.stringify(response.data,null,4), 'template_documents.json');

                }

                else{
                    FileDownload((response.data), 'template_concepts.csv');

                }
            })
    }


    return(
        <div className='addcontainer'>
            <h3>Add a new collection</h3>
            <div><i>In order to create a new collection you need to set the name and to add at least a document.</i></div>
            <Row className='addcollectionclass'>
                <Col md={1}></Col>
                {/*<Col md={2}>Name:</Col>*/}
                <Col md={10}><TextField id="collection_name" sx={{width:'100%'}} style={{marginTop:'1%'}} placeholder="Collection name"
                                        label="Name"
                                        value={Title}

                                        onChange={(e)=>handleChangeTitle(e)}
                                        required variant="outlined" /></Col>
                <Col md={1}></Col>
            </Row>
            <Row className='addcollectionclass'>
                <Col md={1}></Col>
                {/*<Col md={2}>Description</Col>*/}
                <Col md={10}><TextField
                    id="collection_description"
                    placeholder="Collection description"
                    label="Description"
                    value = {Description}
                    onChange={(e)=>handleChangeDesc(e)}
                    multiline
                    sx={{width: '100%'}}
                    rows={2}
                /></Col>
                <Col md={1}></Col>
            </Row>
            <Row className='addcollectionclass'>
                <Col md={1}></Col>
                {/*<Col md={2}>Shared with:</Col>*/}
                <Col md={10}>
                    <div>
                        <h6>Members</h6>
                        <div>Members share the collection with you. Add one or members allowed to annotate your documents. </div>
                    </div>
                    <div >
                        <TextField
                            placeholder="Select a list of users"
                            variant='outlined'
                            id='members'
                            onChange={()=>{
                                SetSelectedMembers(document.getElementById('members').value.split('\n'))
                            }}
                            label="Members"
                            multiline
                            rows={3}

                            sx={{width: '100%',marginTop:'15px'}}
                            helperText="Insert here the usernames of the members you wnat to include \n separated"

                            // value={LabelsToAdd}
                        />

                    {/*{(Users.length > 1 && options.length > 0) ? <Autocomplete*/}
                    {/*    multiple*/}
                    {/*    freeSolo*/}
                    {/*    disableClearable*/}
                    {/*    // value = {SelectedMembers}*/}
                    {/*    id="members"*/}
                    {/*    open={textual_user.length > 5}*/}

                    {/*    defaultValue={[options.filter(x=>x.username === Username)[0]]}*/}
                    {/*    sx={{width:'100%'}}*/}
                    {/*    getOptionLabel={(option) => option.username}*/}
                    {/*    options={options.sort((a, b) => -b.username[0].localeCompare(a.username[0]))}*/}
                    {/*    onChange={(e, newValue) => {*/}
                    {/*        // console.log(newValue)*/}
                    {/*        SetSelectedMembers(newValue)*/}
                    {/*    }}*/}
                    {/*    groupBy={(option) => option.profile}*/}
                    {/*    renderInput={(params) => (*/}
                    {/*        <TextField*/}
                    {/*            {...params}*/}
                    {/*            placeholder="Select members this collection will be shared with"*/}
                    {/*            variant='outlined'*/}
                    {/*            value={textual_user}*/}
                    {/*            onChange={(e)=>{Settextual_user(e.target.value)}}*/}
                    {/*            label="Members"*/}
                    {/*            // value={SelectedMembers}*/}
                    {/*        />*/}
                    {/*    )}*/}
                    {/*/> : <b>There are not other members</b>}*/}
                    </div>
                </Col>
                <Col md={1}></Col>
            </Row>
            <Row className='addcollectionclass'>
                <Col md={1}></Col>
                {/*<Col md={2}>Shared with:</Col>*/}
                <Col md={10}>
                    <div>
                        <h6>Document labels</h6>
                        <div>Provide a set of labels; one or more of these labels can be associated to each document of the collection. </div>
                    </div>
                    <div >

                                <TextField
                                    placeholder="Select a list of documents labels"
                                    variant='outlined'
                                    id='labels'
                                    onChange={handleChangeLabels}
                                    label="Labels"
                                    multiline
                                    rows={2}
                                    sx={{width: '100%',marginTop:'15px'}}
                                    helperText="Labels must be \n separated"

                                    value={LabelsToAdd}
                                />

                    </div>
                </Col>
                <Col md={1}></Col>
            </Row>
            <Row className='addcollectionclass'>
                <Col md={1}></Col>
                {/*<Col md={2}>Shared with:</Col>*/}
                <Col md={10}>
                    <h6>Concepts</h6>
                    <div>Add one or more files containing the concepts. Files can be CSV, or json.</div>
                    <div style={{fontSize:'0.8rem'}}>
                        <div>Download         <span className={'buttontem'} onClick={()=>DownloadTemplate('csv')} >here</span>{' '}
                            the csv template.</div>
                        <div>Download         <span className={'buttontem'} onClick={()=>DownloadTemplate('json')}  >here</span>{' '}
                            the json template.</div>
                    </div>

                    <div className='uploadfiles'>
                        <span className='collectionButt'>
                            <label htmlFor="concepts_to_upload">
                                <input hidden accept="*" id="concepts_to_upload" onChange={()=>{AddFiles('concepts')}} multiple type="file" />
                                    {/*<Button variant="contained" size={'small'} sx={{margin:'10px',display:"inline-block"}} onChange={()=>GetFiles('concepts')} component="span" startIcon={<UploadFileIcon/>}>*/}
                                <Button variant="contained" size={'small'} sx={{margin:'10px',display:"inline-block"}}  component="span" startIcon={<UploadFileIcon/>}>
                                        Upload
                                </Button>
                            </label>

                        </span>

                    </div>
                    <div>
                        {ConceptsFiles &&
                        <>
                            {ConceptsFiles.length > 0 && <b>Uploaded concepts:</b>
                            }
                            {ConceptsFiles.map(file=>
                                <div>
                                    <span>{file.name}</span>{' '}<span><IconButton onClick={()=>{
                                    let conc = ConceptsFiles.map(x=>x)
                                    conc = conc.filter(x=>x.name !== file.name)
                                    SetConceptsFiles(conc)
                                }}><DeleteIcon/></IconButton></span>
                                </div>
                            )}
                        </>}


                    </div>

                </Col>
                <Col md={1}></Col>
            </Row>

            <hr/>
            <div>
                <div className={'clickable'} onClick={()=>SetShowDocumentsUpload(prev=>!prev)}>
                    <h5>Upload documents</h5></div>
            <Collapse in={ShowDocumentsUpload}>
            <i>Documents can be uploaded in PDF, CSV, JSON, TXT formats.</i>


                <div style={{fontSize:'0.8rem'}}>
                    <div>If you plan to associate an ID to your documents, provide them as csv or json files, and, for each document, provide a key (for json), or the column (for the csv) with <i>document_id</i> name.
                        If your documents have a title, put it in the <i>title</i> key (column). TXT files will be treated as unique annotable text, hence it will not be split into sections.</div>
                    <div>Download         <span className={'buttontem'} onClick={()=>DownloadTemplate('doc_json')} >here</span>{' '}
                        the json template.</div>

                </div>
            <Row className='addcollectionclass'>

                <Col md={1}></Col>
                <Col md={10}>

                    <div className='uploadfiles'>
                        <span className='collectionButt'>
                            <label htmlFor="files_to_upload">
                                <Input accept="*" id="files_to_upload" onChange={()=>{AddFiles('documents')}} multiple type="file" />
                                <ThemeProvider theme={theme}>
                                    {/*<Button variant="contained"  onChange={()=>GetFiles('documents')} color='neutral_updload' component="span" startIcon={<UploadFileIcon/>}>*/}
                                    <Button sx={{marginTop: '15px'}} variant="contained"  color='neutral_updload' component="span" startIcon={<UploadFileIcon/>}>
                                        Upload
                                    </Button></ThemeProvider>
                            </label>
                        </span>


                    </div>
                    {Files &&
                    <>
                        {Files.length > 0 && <b>Uploaded documents files:</b>
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
                </Col>
                <Col md={1}></Col>
            </Row>
            </Collapse></div><hr/>
                    <div>
                    <div className={'clickable'} onClick={()=>SetShowAreaPubmed(prev=>!prev)}>
                        <h5>Upload PubMed abstracts</h5>
                    </div>
                        <Collapse in={ShowAreaPubmed}>
                            <i>Upload a list of Pubmed IDs <b>single-space separated</b>. </i>
                            <div>Note: the requests are based on the Pubmed API, and there is a limited number of requests that can be performed per second.</div>

                            <Row className='addcollectionclass'>

                                <Col md={1}></Col>
                                <Col md={10}>
                            {/*<Collapse in={ShowAreaPubmed}>*/}
                            <TextField
                                id="pubmed_ids"
                                // placeholder="PubMed IDs commma separated: 1234,12,456"
                                label="PubMed IDs"
                                multiline
                                onChange={(e)=>handleChangePubmedId(e)}
                                value={PubmedId}
                                sx={{width: '100%',marginTop:'15px'}}
                                helperText="PubMed IDs must be single space separated: 123 12 456"
                                rows={3}
                            />
                            {/*</Collapse>*/}
                            {/*<i>Upload a list of Pubmed IDs in a .txt file the IDs <b>space separated</b>. </i>*/}
                            {/*<div>*/}
                            {/*    <span className='collectionButt'>*/}
                            {/*    <ThemeProvider theme={theme}>*/}
                            {/*    <Input accept="*" id="pubmed_to_upload" onChange={()=>{AddFiles('pubmed')}} multiple type="file" />*/}
                            {/*    /!*<Button variant="contained" size = 'small' color='neutral_pubmed' component="span" onChange={()=>GetFiles('pubmed')}*!/*/}
                            {/*        <Button sx={{marginTop: '15px'}}  variant="contained" size = 'small' color='neutral_pubmed' component="span"*/}
                            {/*        >*/}
                            {/*        Upload IDs in a file*/}
                            {/*    </Button></ThemeProvider>*/}
                            {/*</span>*/}
                            {/*</div>*/}
                                </Col>
                            <Col md={1}></Col>
                            </Row>
                        </Collapse>
                    </div><hr/>
                    <div>
                    <div className={'clickable'} onClick={()=>SetShowAreaOpenAIRE(prev=>!prev)}>

                    <h5>Upload form OpenAIRE Research Graph</h5>

                    </div>
                        <Collapse in={ShowAreaOpenAIRE}>
                            <i>Upload a list of at most 100 DOIs <b>single-space separated</b>. The related title, authors, and abstract will be extracted from the OpenAIRE Research Graph.</i>
                            <div>Note: the requests are based on the OpenAIRE API, and there is a limited number of requests that can be performed per hour.</div>

                            <Row className='addcollectionclass'>

                                <Col md={1}></Col>
                                <Col md={10}>


                            <TextField
                                id="openaire_ids"
                                // placeholder="PubMed IDs commma separated: 1234,12,456"
                                label="DOI in the OpenAIRE Research Graph"
                                multiline
                                onChange={(e)=>handleChangeOpenaireId(e)}
                                value={OpenAIREId}
                                sx={{width: '100%',marginTop:'15px'}}
                                helperText="DOIs must be single-space separated"
                                rows={3}
                            />
                            {/*</Collapse>*/}
                            {/*<i>Upload a list of DOIs in .txt file the IDs <b>single-space separated</b>. </i>*/}
                            {/*<div>*/}
                            {/*    <span className='collectionButt'>*/}
                            {/*    <ThemeProvider theme={theme}>*/}
                            {/*    <Input accept="*" id="openaire_to_upload" onChange={()=>{AddFiles('openaire')}} multiple type="file" />*/}
                            {/*    /!*<Button variant="contained" size = 'small' color='neutral_pubmed' component="span" onChange={()=>GetFiles('openaire')}*!/*/}
                            {/*    <Button sx={{margin: '15px'}} variant="contained" size = 'small' color='neutral_pubmed' component="span">*/}
                            {/*        Upload IDs in a file*/}
                            {/*    </Button>*/}
                            {/*    </ThemeProvider>*/}
                            {/*</span>*/}
                            {/*</div>*/}
                                </Col>
                                <Col md={1}></Col>
                            </Row>
                        </Collapse>
                    </div><hr/>
                    <div>
                        <div className={'clickable'} onClick={()=>SetShowSemantic(prev=>!prev)}>                            <h5>Upload from Semantic Scholar</h5>
                    </div>
                        <Collapse in={ShowSemantic}>
                            <i>Upload a list of at most 100 DOIs <b>single-space separated</b>. The related title, authors, and abstract will be extracted from the OpenAIRE Research Graph.</i>
                            <div>Note: the requests are based on the Semantic Scholar API, and there is a limited number of requests that can be performed.</div>
                            <Row className='addcollectionclass'>

                                <Col md={1}></Col>
                                <Col md={10}>

                            <TextField
                                id="semantic_ids"
                                // placeholder="PubMed IDs commma separated: 1234,12,456"
                                label="DOI in Semantic Scholar"
                                multiline
                                onChange={(e)=>handleChangeSemanticId(e)}
                                value={SemanticID}
                                sx={{width: '100%',marginTop:'15px'}}
                                helperText="DOIs must be single-space separated"
                                rows={3}
                            />
                            {/*</Collapse>*/}
                            {/*<i>Upload a list of DOIs in .txt file the IDs <b>single-space separated</b>. </i>*/}
                            {/*<div>*/}
                            {/*    <span className='collectionButt'>*/}
                            {/*    <ThemeProvider theme={theme}>*/}
                            {/*    <Input accept="*" id="semantic_to_upload" onChange={()=>{AddFiles('semantic')}} multiple type="file" />*/}
                            {/*        /!*<Button variant="contained" size = 'small' color='neutral_pubmed' component="span" onChange={()=>GetFiles('openaire')}*!/*/}
                            {/*        <Button sx={{marginTop: '15px'}}  variant="contained" size = 'small' color='neutral_pubmed' component="span">*/}
                            {/*        Upload IDs in a file*/}
                            {/*    </Button>*/}
                            {/*    </ThemeProvider>*/}
                            {/*</span>*/}
                            {/*</div>*/}
                                </Col>
                                <Col md={1}></Col>
                            </Row>
                        </Collapse>
                    </div>
            {/*    </Col>*/}

            {/*    <Col md={1}>*/}

            {/*    </Col>*/}

            {/*</Row>*/}




            {InpuLength && InpuLength > 0 && <div><b>Uploaded: </b>{InpuLength} files
                <span>
                    <ThemeProvider theme={theme}>
                    <IconButton color="neutral" onClick={()=>DeleteFiles()} aria-label="delete files" component="span">
                    <DeleteIcon /></IconButton>
                    </ThemeProvider>
                </span>
            </div>}
            <hr/>
            {ShowError && <Alert severity="error">Error - {ShowError}</Alert>}
            <div><i>If one or more documents of pubmed, semantic scholar, openaire are not found, they will be silently ignored.</i></div>
            <Row>
                <Col md={1}></Col>
                <Col md={10} >
                    <div style={{textAlign:"center"}}>
                        <ThemeProvider theme={theme}>
                            <Button color="neutral" onClick={()=> {SetAddCollection(false);SetShowError(false)}} className='collectionButt' variant="contained">
                                Clear
                            </Button>
                        </ThemeProvider>
                        <div className='confirmButt'><Button variant="contained" onClick={()=>uploadData()} >Confirm</Button></div>
                    </div>

                </Col>
                <Col md={1}></Col>
            </Row>
        </div>

    );
}
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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
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
import Form from 'react-bootstrap/Form';
import Checkbox from "@mui/material/Checkbox";

export default function FilterDocumentComponent({displayDocs, setDisplayDocs}){
    const { collection,document_id,labels, inarel,labelstosave,collectiondocuments,annotatedlabels } = useContext(AppContext);

    const [TextValue,SetTextValue] = useState('')
    const [BatchValue,SetBatchValue] = useState(null)
    const [RadioValue,SetRadioValue] = useState('all')
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [DocumentID,SetDocumentID] = document_id

    function get_filtered_list(filed,batch = null,ID = null){
        const anno = CollectionDocuments.filter(r=> r.annotated === true)
        const not_anno = CollectionDocuments.filter(r=> r.annotated === false)
        let final_list = []
        let documents_list = []

        if(filed === 'all' && CollectionDocuments && CollectionDocuments.length > 0){
            final_list = (CollectionDocuments.map(x=>x))
        }

        else if(filed === 'annotated'){
            final_list = (anno)
            documents_list = final_list.map(x=>x.id)

        }

        else if(filed === 'not_annotated'){
            final_list = (not_anno)
        }
        let new_b = batch !== null ? batch : BatchValue
        let new_t = (ID !== null && ID !== '') ? ID : TextValue
        if(new_b){
            final_list = final_list.filter(x=>x.batch.toString() === new_b.toString())
        }
        if(new_t !== '' && new_t !== null){
            final_list = final_list.filter(x=>x.id.toString().includes(new_t.toString()))

        }
        // entro qua se non sto filtrano per id o per batch
        if (final_list.length > 0 && final_list.indexOf(DocumentID) === -1 && batch === null && ID === null){
            axios.post('update_document_id',{'document':final_list[0]['id']})
                .then(resp=>{
                    SetDocumentID(final_list[0]['id'])
                })
        }
        return final_list
    }
    function FilterID(e){
        e.stopPropagation()
        e.preventDefault()
        SetTextValue(e.target.value)
        // console.log('val',e.target.value)
        // console.log('val',e.target.value.length)
        let disp_id = []
        let final_list = get_filtered_list(RadioValue,BatchValue,e.target.value)
        if(e.target.value === ''){
            disp_id = final_list

        }else{
            disp_id = final_list.filter(x => x.id.includes(e.target.value))

        }
        if (disp_id.length > 0 && disp_id.map(x=>x.id).indexOf(DocumentID) === -1){
            axios.post('update_document_id',{'document':disp_id[0]['id']})
                .then(resp=>{
                    SetDocumentID(disp_id[0]['id'])
                })
        }
        // console.log('total',disp_id)
        setDisplayDocs(disp_id)


    }
    function FilterBatch(e){
        e.stopPropagation()
        e.preventDefault()
        SetBatchValue(e.target.value)
        let disp_id = []
        let final_list = get_filtered_list(RadioValue,e.target.value,TextValue)
        console.log('final',final_list)
        if(e.target.value === ''){
            disp_id = final_list

        }else{
            disp_id = final_list.filter(x => x.batch.toString() === e.target.value.toString())

        }
        if (disp_id.length > 0 && disp_id.map(x=>x.id).indexOf(DocumentID) === -1){
            axios.post('update_document_id',{'document':disp_id[0]['id']})
                .then(resp=>{
                    SetDocumentID(disp_id[0]['id'])
                })
        }
        // console.log('total',disp_id)
        setDisplayDocs(disp_id)


    }
    const handleChange = (e,field) => {
        e.preventDefault()
        e.stopPropagation()
        // SetRadioValue(e.target.name)
        console.log('CollectionDocuments',CollectionDocuments)
        SetRadioValue(field)
        let final_list = get_filtered_list(field)
        setDisplayDocs(final_list)


    }




    return(
        <div>
            <i style={{fontSize:'0.9rem'}}>Filter the documents</i>
            <Form>
                <div>
                    <Radio
                        checked={RadioValue === 'annotated'}
                        onClick={(e)=>handleChange(e,'annotated')}
                        value="annotated"
                        name="annotated"
                        sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: 15,
                            },
                        }}
                        inputProps={{ 'aria-label': 'B' }}
                    />
                    <span onClick={(e)=>handleChange(e,'annotated')} style={{cursor:'default', fontSize:'0.8rem'}}>Annotated</span>



                </div>
                <div>
                    <Radio
                        checked={RadioValue === 'not_annotated'}
                        onClick={(e)=>handleChange(e,'not_annotated')}
                        value="not_annotated"
                        name="not_annotated"
                        sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: 15,
                            },
                        }}
                        inputProps={{ 'aria-label': 'B' }}
                    />
                    <span onClick={(e)=>handleChange(e,'not_annotated')} style={{cursor:'default', fontSize:'0.8rem'}}>Not annotated</span>



                </div>
                <div>
                    <Radio
                        checked={RadioValue === 'all'}
                        onClick={(e)=>handleChange(e,'all')}
                        value="all"
                        name="all"
                        sx={{
                            '& .MuiSvgIcon-root': {
                                fontSize: 15,
                            },
                        }}
                        inputProps={{ 'aria-label': 'B' }}
                    />
                    <span onClick={(e)=>handleChange(e,'all')} style={{cursor:'default', fontSize:'0.8rem'}}>All</span>




                </div>


            </Form>


            <hr />
            <div>
                {/*<div>*/}
                {/*    <i style={{fontSize:'0.9rem'}}>Filter by ID</i>*/}
                {/*</div>*/}
                {/*<div>*/}

                {/*</div>*/}
                <TextField size="small" label="Filter by ID" id="keywords_search" variant="outlined" value={TextValue} onChange={(e)=>FilterID(e)}/>

            </div>
            <hr/><div>
            {/*<div>*/}
            {/*    <i style={{fontSize:'0.9rem'}}>Filter by Batch</i>*/}
            {/*</div>*/}
            {/*<div>*/}

            {/*</div>*/}
            <TextField size="small"
                        id="batch_search" label="Filter by Batch" variant="outlined" inputProps={{ inputMode: 'numeric'}}  onChange={(e)=>FilterBatch(e)}/>

        </div>
            <hr/>

        </div>
    );
}
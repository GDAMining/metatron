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
import {alpha, styled} from "@mui/material/styles";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import './modal.css'
import FormLabel from '@mui/material/FormLabel';
import DialogContent from "@mui/material/DialogContent";
import UploadIcon from '@mui/icons-material/Upload';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ArticleIcon from '@mui/icons-material/Article';
import DialogTitle from "@mui/material/DialogTitle";


export default function DownloadModal(props) {

    const [Batch,SetBatch] = useState(false)
    const [FormatValue,SetFormatValue] = useState('json')
    const [AnnotatorValue,SetAnnotatorValue] = useState(props.doc.annotators_list_names[0])
    const [AnnotationValue,SetAnnotationValue] = useState('mentions')
    const [DocumentsValue,SetDocumentsValue] = useState(0)
    const [BatchValue,SetBatchValue] = useState(1)
    var FileDownload = require('js-file-download');



    function downloadAnnotations(e){
        e.preventDefault()
        e.stopPropagation()
        axios.get('download_annotations', {
            params: {
                format: FormatValue,
                annotators: AnnotatorValue,
                annotation: AnnotationValue,
                document: props.doc.document_id,
                // batch:BatchValue,
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



    return (
        <Dialog
            open={props.show}
            onClose={()=>props.setshow(false)}

            fullWidth={true}
            maxWidth={'sm'}
        >
            <DialogTitle id="alert-dialog-title">
            Download annotations
        </DialogTitle>
                <div id={'downloadmodal'}>




                    <div style={{marginLeft:'30px',marginRight:'30px',marginBottom:'30px'}}>
                        <FormControl fullWidth>
                            <InputLabel id="format">Format</InputLabel>
                            <Select
                                labelId="format"
                                id="format"
                                value={FormatValue}
                                sx={{width:'100%'}}
                                label="Format"
                                onChange={(e)=>{SetFormatValue(e.target.value)}}
                            >

                                <MenuItem style={{display:"block",padding:'6px 8px'}} value={'json'}>JSON</MenuItem>
                                <MenuItem style={{display:"block",padding:'6px 8px'}} value={'csv'}>CSV</MenuItem>
                                {/*<MenuItem value={'biocxml'}>BIOC/XML</MenuItem>*/}
                                {/*<MenuItem value={'biocjson'}>BIOC/JSON</MenuItem>*/}
                            </Select></FormControl>
                    </div>



                    <div style={{marginLeft:'30px',marginRight:'30px',marginBottom:'30px'}}>

                        <FormControl fullWidth>
                        <InputLabel id="ann">Annotation</InputLabel>
                        <Select
                            labelId="ann"
                            id="format_select"
                            value={AnnotationValue}
                            sx={{width:'100%'}}

                            label="Annotator"
                            onChange={(e)=>{SetAnnotationValue(e.target.value)}}
                        >

                            <MenuItem style={{display:"block",padding:'6px 8px'}} value={'mentions'}>Mentions</MenuItem>
                            <MenuItem style={{display:"block",padding:'6px 8px'}} value={'concepts'}>Concepts</MenuItem>
                            <MenuItem style={{display:"block",padding:'6px 8px'}} value={'relationships'}>Relationships</MenuItem>
                            <MenuItem style={{display:"block",padding:'6px 8px'}} value={'assertions'}>Document assertions</MenuItem>
                            <MenuItem style={{display:"block",padding:'6px 8px'}} value={'labels'}>Document labels</MenuItem>

                        </Select></FormControl>
                    </div>

                <div style={{marginLeft:'30px',marginRight:'30px',marginBottom:'30px'}}>
                            <FormControl fullWidth>
                            <InputLabel id="annotator">Annotator</InputLabel>
                            <Select
                                labelId="annotator"
                                id="format_select"
                                value={AnnotatorValue}
                                sx={{width: '100%'}}
                                label="Annotator"
                                onChange={(e) => {
                                    SetAnnotatorValue(e.target.value)
                                }}
                            >

                                {props.doc.annotators_list_names.map(u =>
                                    <MenuItem style={{display:"block",margin:'3px'}} value={u}>{u}</MenuItem>


                                )}
                                <MenuItem style={{display:"block",margin:'3px'}} value={'all'}>'All</MenuItem>

                            </Select></FormControl>
                        </div>




            </div>



            <DialogActions>
                <Button onClick={()=>props.setshow(false)}>Close</Button>
                <Button onClick={downloadAnnotations} >Download</Button>

            </DialogActions>
        </Dialog>
    );
}
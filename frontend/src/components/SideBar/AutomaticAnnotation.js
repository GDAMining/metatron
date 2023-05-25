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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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

export default function AutomaticAnnotation(props){
    const { collection,autoannotation,documentdescription,username, mentions,curannotator,annotatedlabels,concepts,annotators,relationshipslist } = useContext(AppContext);
    const [MentionsList,SetMentionsList] = mentions
    const [ConceptsList,SetConceptsList] = concepts
    const [RelationshipsList,SetRelationshipsList] = relationshipslist
    const [AnnotatedLabels, SetAnnotatedLabels] = annotatedlabels
    const [DocumentDesc,SetDocumentDesc] = documentdescription

    const [Username,SetUsername] = username
    const [Annotators,SetAnnotators] = annotators
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [AutoAnnotate,SetAutoAnnotate] = autoannotation
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const autoAnnotation = (e) =>{
        console.log('value',document.getElementById("demo-select-small").value)
        e.preventDefault()
        e.stopPropagation()

        SetAutoAnnotate(true)


        axios.post('autotron_annotation',{task:value}).then(resp=>{
            SetDocumentDesc(false)
            SetMentionsList(false);
            SetConceptsList(false);
            SetRelationshipsList(false);
            SetAnnotatedLabels(false);
            SetAutoAnnotate(false)

        })
    }

    return(
        <div>
            <h5>
                AUTOTRON
            </h5>
            <div>Automatic annotate the current document.
                <hr/>
                Documents having a pubmed ID will have the mentions and the concepts extracted with <b>PUBTATOR</b> mesh/omim diseases ncbi gene, otherwise they will have the
            mentions and the concepts annotated with <b>METAMAP</b> umls cui concepts.  </div>
            <div><br/>
                Select your task.
                <div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="demo-select-small">Task</InputLabel>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            // value={age}
                            label="Task"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>Select a a task</em>
                            </MenuItem>
                            <MenuItem value={"GCA"}>Gene Cancer Association</MenuItem>
                            <MenuItem value={"GDA"}>Gene Disease Association</MenuItem>

                        </Select>
                    </FormControl>
                </div>


                <Button variant="contained" disabled={value===''} onClick={autoAnnotation}>Annotate</Button>






            </div>
        </div>
    );
}
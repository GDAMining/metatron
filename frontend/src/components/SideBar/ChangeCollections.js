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

export default function CollectionsComponent(props){
    const { collection,document_id,labels, inarel,labelstosave,collectionslist,username } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState([])
    const [ShowSelect,SetShowSelect] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = useState(false)
    const [LabelsToSave, SetLabelsToSave] = labelstosave
    const [InARel,SetInARel] = inarel
    const [CollList,SetCollList] = collectionslist
    const [Username,SetUsername] = username
    const [UserCollections, SetUserCollections] = useState(false)

    useEffect(()=>{
        axios.get('collections/list').then(response=>{
            SetCollList(response.data['collections'])})
            .catch(error=>{
                console.log('error',error)
            })
    },[])

    const labelstheme = createTheme({
        palette: {
            empty: { // <20%
                main: '#c71324',
                contrastText: '#fff',
            },
            notempty: { //<40%
                main: '#f57a4f',
                contrastText: '#fff',
            },
            half: {//<60%
                main: '#f5bd4f',
                contrastText: '#fff',
            },

            quiteall: {//<80%
                main: '#b1d435',
                contrastText: '#fff',
            },
            all: {//<100%
                main: '#399a22',
                contrastText: '#fff',
            },
            current: {//<100%
                main: '#00AFB9',
                contrastText: '#fff',
            },

        },
    });


    const handleClick = (e,id) => {
        e.preventDefault()
        e.stopPropagation()
        SetDocumentID(false)
        axios.get("change_collection_id",{params:{collection:id}})
            .then(rs=> {
                SetCollection(id);
                SetDocumentID(rs.data['document_id'])
            })
        // SetCollection(e.target.id)


    }

    return(
        <div>
            <h5>
                Change collection
            </h5>

            <div>
                {CollList && CollList.length > 0 ?
                    <div style={{paddingTop:'2%'}}>

                        {CollList.map(c =>
                            <div style={{marginTop:'10px'}}>
                                <ThemeProvider theme={labelstheme}>
                                    {/*{c.id === Collection && <i>Current: </i>}*/}
                                        {c.perc_annotations_user <= 20 && <div id={c.id}>
                                            <Chip label={c.name + ' ' + c.perc_annotations_user + '%'} color={'empty'} variant={c.id === Collection ? "filled" : "outlined"} onClick={(e)=>handleClick(e,c.id)} />
                                        </div>}
                                        {c.perc_annotations_user > 20 && c.perc_annotations_user <= 40 && <div id={c.id} >
                                            <Chip label={c.name + ' ' + c.perc_annotations_user + '%'} color={'notempty'} variant={c.id === Collection ? "filled" : "outlined"} onClick={handleClick} /></div>}
                                    {c.perc_annotations_user > 40 && c.perc_annotations_user <= 60 && <div id={c.id}><Chip label={c.name + ' ' + c.perc_annotations_user + '%'} color={'half'} variant={c.id === Collection ? "filled" : "outlined"} onClick={(e)=>handleClick(e,c.id)} /></div>}
                                    {c.perc_annotations_user > 60 && c.perc_annotations_user <= 80 && <div id={c.id}><Chip label={c.name + ' ' + c.perc_annotations_user + '%'} color={'quiteall'} variant={c.id === Collection ? "filled" : "outlined"} onClick={(e)=>handleClick(e,c.id)} /></div>}
                                        {c.perc_annotations_user > 80 && c.perc_annotations_user <= 100 && <div id={c.id}><Chip label={c.name + ' ' + c.perc_annotations_user + '%'} color={'all'} variant={c.id === Collection ? "filled" : "outlined"} onClick={(e)=>handleClick(e,c.id)} /></div>}


                                    </ThemeProvider>

                            </div>
                        )}
                    </div>


                    : <div className='loading'>
                        <CircularProgress />
                    </div>}



            </div>
        </div>
    );
}
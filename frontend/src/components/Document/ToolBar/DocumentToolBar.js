import {Col, Row} from "react-bootstrap";
// import Button from "react-bootstrap/Button";
import Button from "@mui/material/Button";
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    faChevronLeft, faPalette,
    faChevronRight, faExclamationTriangle,
    faGlasses,
    faInfoCircle,
    faList, faPlusCircle,
    faProjectDiagram, faArrowLeft, faArrowRight, faTrash, faSave, faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ActualPosition from "../../BaseComponents/ActualPosition";
import ChangeDoc from "./ChangeDoc";
import './tool.css'
import {AppContext} from "../../../App";
import DeleteAnnotation from "./DeleteAnnotation";
import DownloadAnnotation from "./DownloadAnnotation";
import UploadAnnotation from "./UploaddAnnotation";
import AnnotationPanel from "./AnnotationPanel";
import {CircularProgress, Tooltip} from "@mui/material";
import CreateFactComponent from "./CreateFactComponent";
import CreateFact from "./CreateFactComponent";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
function DocumentToolBar(props){
    const { username,collection,document_id,inarel,saving,curannotator,snackmessage,opensnack } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Username,SetUsername] = username
    const [InARel,SetInARel] = inarel
    const [Saving,SetSaving] = saving
    const [CollectionDescription,SetCollectionDescription] = useState(false)
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack

    function copyAnnotation(e){
        e.preventDefault()
        e.stopPropagation()
        SetOpenSnack(true)
        SetSnackMessage({'message':'Copying...'})
        axios.post('copy_annotation',{user:CurAnnotator}).then(response=> {
            console.log(response)
            SetSnackMessage({'message':'Copied'})
        })
            .catch(error=> {
                console.log(error)
                SetSnackMessage({'message': 'ERROR'})
            }

    )

    }


    return(
        <>
            {DocumentID && <div style={{marginBottom:'1.5vh'}}>
                    <ActualPosition />

                    <ChangeDoc documentList={props.documentList}/>
                {InARel ? <div className={"exit"}>Press <h6 style={{display:"inline-block"}}>Esc </h6>{' '}<ExitToAppIcon /> to exit from relationship annotation</div> : <>

                    {CurAnnotator === Username ? <><DeleteAnnotation/>
                        <CreateFact /></> : <><span style={{marginLeft:'20px'}}>
                    Annotator: <b>{CurAnnotator}</b>
                </span>
                        <div style={{display:"inline-block",marginLeft:'20px'}}>
                            <Tooltip title={"Copy entire annotation"}>
                                <IconButton variant= 'contained' size = 'small' color="primary" onClick={(e)=>copyAnnotation(e)}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </Tooltip>


                        </div>
                        <div style={{display:"inline-block",marginLeft:'20px'}}>
                            <Tooltip title={"Back to my annotation"}>
                                <IconButton variant= 'contained' size = 'small' color="primary" onClick={()=> {
                                    SetCurAnnotator(Username);

                                }}>
                                    <KeyboardReturnIcon />
                                </IconButton>
                            </Tooltip>
                            {/*<Button variant={'text'} size = 'small' onClick={()=>SetCurAnnotator(Username)} startIcon={<ArrowLeftIcon color={'primary'} />}>*/}
                            {/*    My annotation*/}
                            {/*</Button>*/}

                        </div>
                    </>}


                </>}


                <AnnotationPanel />


            </div>}
        </>

    );


}



export default DocumentToolBar
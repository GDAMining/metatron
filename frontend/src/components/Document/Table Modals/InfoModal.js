import {Col, ProgressBar, Row} from "react-bootstrap";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import SaveIcon from '@mui/icons-material/Save';
import HubIcon from '@mui/icons-material/Hub';
import 'bootstrap/dist/css/bootstrap.min.css';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
import EditIcon from '@mui/icons-material/Edit';
const checkedIcon = <CheckBoxIcon fontSize="small" />;
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';

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
import DocumentToolBar from "../../Document/ToolBar/DocumentToolBar";
import ToolBar from "../../BaseComponents/ToolBar";
import AddIcon from '@mui/icons-material/Add';
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
// import '../annotation.css'
// import '../documents.css'
import {CircularProgress} from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {AppContext} from "../../../App";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from "@mui/material/Checkbox";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DialogContent from "@mui/material/DialogContent";
import {updateMentionColor} from "../../HelperFunctions/HelperFunctions";
import {ConceptContext} from "../../../BaseIndex";
// export const ConceptContext = createContext('')


export default function InfoModal(props) {
    const {
        username,
        concepts,
        curconcept,collectionconcepts,

        curmention,
        endrange,areascolors
    } = useContext(AppContext);

    const [row,SetRow] = useState(false)

    useEffect(()=>{
        if(props.annotation === 'mentions_count'){
            axios.get('get_annotation_mentions',{params:{document:props.curid}}).then(resp=>{
                SetRow(resp['data']['mentions'])
            })
                .catch(error=>console.log(error))
            // props.row.map(r=>{
            //     if(r.document_id === props.curid){
            //         SetRow(r.mentions)
            //     }
            // })
        }
        else if(props.annotation === 'concepts_count'){
            axios.get('get_annotation_concepts',{params:{document:props.curid}}).then(resp=>{
                SetRow(resp['data']['concepts'])
            })
                .catch(error=>console.log(error))
            // props.row.map(r=>{
            //     if(r.document_id === props.curid){
            //         SetRow(r.concepts)
            //     }
            // })
        }
        else if(props.annotation === 'annotators_list'){
            props.row.map(r=>{
                if(r.document_id === props.curid){
                    SetRow(r.annotators_list_names)
                }
            })
        }
        else if(props.annotation === 'assertions_count'){
            axios.get('get_annotation_assertions',{params:{document:props.curid}}).then(resp=>{
                SetRow(resp['data']['assertions'])
            })
                .catch(error=>console.log(error))
            // props.row.map(r=>{
            //     if(r.document_id === props.curid){
            //         SetRow(r.assertions)
            //     }
            // })
        }
        else if(props.annotation === 'labels_count'){
            axios.get('get_annotation_labels',{params:{document:props.curid}}).then(resp=>{
                SetRow(resp['data']['labels'])
            })
                .catch(error=>console.log(error))
            // props.row.map(r=>{
            //     if(r.document_id === props.curid){
            //         SetRow(r.labels)
            //     }
            // })
        }
        else if(props.annotation === 'relationships_count'){
            axios.get('get_annotation_relationships',{params:{document:props.curid}}).then(resp=>{
                SetRow(resp['data']['relationships'])
            })
                .catch(error=>console.log(error))
            // props.row.map(r=>{
            //     if(r.document_id === props.curid){
            //         SetRow(r.relationships)
            //     }
            // })
        }


    },[props.row])



    return (
        <Dialog
            open={props.show}
            onClose={()=>props.setshow(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth={'lg'}
        >
            {row && props.annotation === 'mentions_count' &&
            <><DialogTitle id="alert-dialog-title">
                Mentions list
            </DialogTitle>
                <DialogContent>
                <div >

                    {/*<div>Each mention is associated with the total number of times it has been annotated</div>*/}
                    {/*<hr/>*/}
                    <Row>
                        <Col md={3}><h5>Location</h5></Col>
                        <Col md={3}><h5>Mention text</h5></Col>
                        <Col md={3}><h5>Annotators Count</h5></Col>
                        <Col md={3}><h5>Annotators</h5></Col>
                    </Row>
                    <div style={{maxHeight:'50vh'}}>
                        {row.map(x=>
                            <Row>
                                <Col md={3}>{x.location_in_text}</Col>
                                <Col md={3}>{x.mention_text}</Col>
                                <Col md={3}>{x.count.toString()}</Col>
                                <Col md={3}>{x.annotators.join(", ")}</Col>
                            </Row>
                        )}
                    </div>

                </div>
                </DialogContent></>}

            {row && props.annotation === 'concepts_count' &&
            <><DialogTitle id="alert-dialog-title">
                Concepts list
            </DialogTitle>
                <DialogContent>
                    <div >

                        {/*<div>Each mention is associated with the total number of times it has been annotated</div>*/}
                        {/*<hr/>*/}
                        <Row>
                            <Col md={3}><h5>Location</h5></Col>
                            <Col md={3}><h5>Mention - Concept</h5></Col>
                            <Col md={3}><h5>Annotators Count</h5></Col>
                            <Col md={3}><h5>Annotators</h5></Col>
                        </Row>
                        <div style={{maxHeight:'50vh'}}>
                            {row.map(x=>
                                <div>

                                <Row>
                                    <Col md={3}>{x.location_in_text}</Col>
                                    <Col md={3}>
                                        <div><b>Mention: </b>{x.mention_text}</div>
                                        <div><b>Concept Type: </b>{x.concept_area}</div>
                                        <div><b>Concept: </b>{x.concept_name} - {x.concept_url}</div>
                                    </Col>
                                    <Col md={3}>{x.count.toString()}</Col>
                                    <Col md={3}>{x.annotators.join(", ")}</Col>
                                </Row><hr/></div>
                            )}
                        </div>

                    </div>
                </DialogContent></>}

            {row && props.annotation === 'annotators_list' &&
            <><DialogTitle id="alert-dialog-title">
               Annotators list
            </DialogTitle>
                <DialogContent>
                    <div >


                        <div style={{maxHeight:'50vh'}}>
                            {row.map(x=>
                                <Row>
                                    <Col md={12}>{x}</Col>
                                </Row>
                            )}
                        </div>

                    </div>
                </DialogContent></>}

            {row && props.annotation === 'labels_count' &&
            <><DialogTitle id="alert-dialog-title">
                Labels list
            </DialogTitle>
                <DialogContent>
                    <div >
                        <Row>
                            <Col md={4}><h5>Label</h5></Col>
                            <Col md={4}><h5>Annotators Count</h5></Col>
                            <Col md={4}><h5>Annotators</h5></Col>
                        </Row>

                        <div style={{maxHeight:'50vh'}}>
                            {row.map(x=>
                                <Row>
                                    <Col md={4}>{x.label}</Col>
                                    <Col md={4}>{x.count}</Col>
                                    <Col md={4}>{x.annotators.join(", ")}</Col>
                                </Row>
                            )}
                        </div>

                    </div>
                </DialogContent></>}


            {row && props.annotation === 'assertions_count' &&
            <><DialogTitle id="alert-dialog-title">
                Assertions list
            </DialogTitle>
                <DialogContent>
                    <div >

                        <Row>
                            <Col md={7}><h5>Assertions</h5></Col>
                            <Col md={2}><h5>Annotarors count</h5></Col>
                            <Col md={3}><h5>Annotarors</h5></Col>
                        </Row>
                        <div style={{maxHeight:'50vh'}}>
                            {/*{row.map(x=>*/}
                            {/*    <div>*/}
                                    {row.map(x=>
                                        <div>

                                            <Row>
                                                <Col md={2} style={{color:'red'}}><b>Subject</b></Col>
                                                <Col md={5}>
                                                    <div><b>Concept: </b>{x.subject_concept_name}</div>
                                                    <div><b>ID: </b>{x.subject_concept_url}</div>
                                                    <div><b>Type: </b>{x.subject_concept_area}</div><br/>

                                                </Col>
                                                <Col md={2}></Col>
                                                <Col md={3}></Col>
                                            </Row>

                                            <Row>
                                                <Col md={2} style={{color:'green'}}><b>Predicate</b></Col>
                                                <Col md={5}>
                                                    <div><b>Concept: </b>{x.predicate_concept_name}</div>
                                                    <div><b>ID: </b>{x.predicate_concept_url}</div>
                                                    <div><b>Type: </b>{x.predicate_concept_area}</div><br/>
                                                </Col>
                                                <Col md={2}>{x.count.toString()}</Col>
                                                <Col md={3}>{x.annotators.join(", ")}</Col>
                                            </Row>

                                            <Row>
                                                <Col md={2} style={{color:'orange'}}><b>Object</b></Col>
                                                <Col md={5}>
                                                    <div><b>Concept: </b>{x.object_concept_name}</div>
                                                    <div><b>ID: </b>{x.object_concept_url}</div>
                                                    <div><b>Type: </b>{x.object_concept_area}</div><br/>
                                                </Col>
                                                <Col md={2}></Col>
                                                <Col md={3}></Col>

                                            </Row>
                                            <hr/></div>
                                    )}
                                </div>
                        {/*    )}*/}
                        {/*</div>*/}

                    </div>
                </DialogContent></>}
            {row && props.annotation === 'relationships_count' &&
            <><DialogTitle id="alert-dialog-title">
                Relationships list
            </DialogTitle>
                <DialogContent>
                    <div >
                        <Row>
                            <Col md={2}><h5>Role</h5></Col>
                            <Col md={5}><h5>Relationship component</h5></Col>
                            <Col md={2}><h5>Annotators count</h5></Col>
                            <Col md={3}><h5>Annotators</h5></Col>
                        </Row>
                        <div style={{maxHeight:'50vh'}}>
                            {row.map(x=>

                                        <div>

                                            <Row>
                                                <Col md={2} style={{color:'red'}}><b>Subject</b></Col>
                                                <Col md={5}>
                                                    <>
                                                    {x.subject_mention_text ? <><div>
                                                            <b>Mention: </b>
                                                    {x.subject_mention_text}
                                                    </div>
                                                            <div><b>Location: </b> {x.subject_location_in_text} - [{x.subject_start}:{x.subject_stop}]</div></> :
                                                        <>
                                                            {x.subject_concept_url && <div>
                                                                <div>
                                                                    <b>Concept: </b>
                                                                    {x.subject_concept_name}
                                                                </div>
                                                                <div>
                                                                    <b>ID: </b>
                                                                    {x.subject_concept_url}
                                                                </div>
                                                                <div>
                                                                    <b>Type: </b>
                                                                    {x.subject_concept_area}
                                                                </div>
                                                            </div>}
                                                        </>}<br/>

                                                    </>
                                                </Col>
                                                <Col md={2}></Col>
                                                <Col md={3}></Col>
                                            </Row>
                                            <Row>
                                                <Col md={2} style={{color:'green'}}><b>Predicate</b></Col>
                                                <Col md={5}>
                                                    <>
                                                        {x.predicate_mention_text ? <><div>
                                                                <b>Mention: </b>
                                                                {x.predicate_mention_text}
                                                            </div>
                                                                <div><b>Location: </b> {x.predicate_location_in_text} - [{x.predicate_start}:{x.predicate_stop}]</div></> :

                                                            <>
                                                                {x.predicate_concept_url && <div>
                                                                    <div>
                                                                        <b>Concept: </b>
                                                                        {x.predicate_concept_name}

                                                                    </div>
                                                                    <div>
                                                                        <b>ID: </b>
                                                                        {x.predicate_concept_url}

                                                                    </div>
                                                                    <div>
                                                                        <b>Type: </b>
                                                                        {x.predicate_concept_area}

                                                                    </div>
                                                                </div>}<br/>

                                                            </>}<br/>

                                                    </>



                                                </Col>
                                                <Col md={2}>{x.count.toString()}</Col>
                                                <Col md={3}>{x.annotators.join(", ")}</Col>
                                            </Row>

                                            <Row>
                                                <Col md={2} style={{color:'orange'}}><b>Object</b></Col>
                                                <Col md={5}>
                                                    <>
                                                        {x.object_mention_text ?
                                                          <><div>
                                                                    <b>Mention: </b>
                                                                    {x.object_mention_text}
                                                                </div>
                                                                    <div><b>Location: </b> {x.object_location_in_text} - [{x.object_start}:{x.object_stop}]</div>
                                                          </> :
                                                            <>
                                                                {x.object_concept_url && <div>
                                                                    <div>
                                                                        <b>Concept: </b>
                                                                        {x.object_concept_name}

                                                                    </div>
                                                                    <div>
                                                                        <b>ID: </b>
                                                                        {x.object_concept_url}

                                                                    </div>
                                                                    <div>
                                                                        <b>Type: </b>
                                                                        {x.object_concept_area}

                                                                    </div>
                                                                </div>}

                                                            </>}<br/>

                                                    </>


                                                </Col><Col md={3}></Col><Col md={3}></Col>

                                            </Row>
                                            <hr/></div>

                            )}
                        </div>

                    </div>
                </DialogContent></>}



            <DialogActions>
                <Button onClick={()=>props.setshow(false)}>Close</Button>


            </DialogActions>
        </Dialog>
    );
}
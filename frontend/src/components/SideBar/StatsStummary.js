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

const checkedIcon = <CheckBoxIcon fontSize="small" />;

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {AppContext} from "../../App";
import './sidebar.css'
import {CircularProgress} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

export default function SummaryStatsComponent(props){
    const { collection,document_id,labels, inarel,labelstosave,username,curannotator } = useContext(AppContext);
    const [Collection,SetCollection] = collection
    const [DocumentID,SetDocumentID] = document_id
    const [Labels,SetLabels] = labels
    const [NotAdded,SetNotAdded] = useState([])
    const [ShowSelect,SetShowSelect] = useState(false)
    const [AnnotatedLabels, SetAnnotatedLabels] = useState(false)
    const [LabelsToSave, SetLabelsToSave] = labelstosave
    const [InARel,SetInARel] = inarel
    const [MyStats,SetMyStats] = useState(false)
    const [GlobalStatsOpen,SetGlobalStatsOpen] = useState(false)
    const [GlobalStats,SetGlobalStats] = useState(false)
    const [PersonalStats,SetPersonalStats] = useState(false)
    const [Username,SetUsername] = username
    const [CurAnnotator,SetCurAnnotator] = curannotator


    useEffect(()=>{
        SetPersonalStats(false)

        axios.get('statistics/personal/general',{params:{document : DocumentID,collection:Collection}})
            .then(r=>{
                SetPersonalStats(r.data)
                // SetPersonalStats(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))

        axios.get('statistics/global/general',{params:{document : DocumentID,collection:Collection}})
            .then(r=>{
                SetGeneralStats(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))

    },[])






    return(
        <div >
            <h5>
                Document Statistics
            </h5>
            <div className={'cont'}><div>
            <h6 className={'h5toexpand'} onClick={()=>SetMyStats(prev=>!prev)}>My Statistics</h6>
            {/*<Collapse in={MyStats}>*/}
                <div>
                    <div style={{padding:'5px'}}>

                        {PersonalStats ?
                            <div style={{fontSize:'0.7rem'}}>
                                <Row>
                                    <Col md={8}></Col>
                                    <Col md={4}><b>Count</b></Col>
                                </Row>
                                <hr/>

                                {['annotated_documents','mentions','concepts','relationships','assertions','labels'].map((k,i)=>
                                    <div style={{margin:'10px 0'}}>
                                        {!(k === 'annotated_documents' && props.document !== false) && <Row>

                                            <Col
                                                md={8}>{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}:</Col>
                                            <Col md={4}>{PersonalStats[k]}
                                                {/*{([]) && <IconButton><InfoIcon/></IconButton></Col>}*/}
                                            </Col>
                                        </Row>}
                                        {k === 'annotated_documents' && props.document === false && <hr/>}
                                    </div>

                                )}
                            </div>

                            : <div className='loading'><CircularProgress />

                            </div>}
                    </div>
                </div><hr/>
            {/*</Collapse>*/}
            <h6 className={'h5toexpand'} onClick={()=>SetGlobalStatsOpen(prev=>!prev)}>Global Statistics</h6>
            {/*<Collapse in={GlobalStatsOpen}>*/}
                <div style={{fontSize:'0.7rem'}}>
                    {GlobalStats ?
                        <>
                            <Row>
                                <Col md={7}></Col>
                                <Col md={2}><b>Count</b></Col>
                                <Col md={3}>
                                    <Tooltip title="Fleiss' kappa">
                                        <div>
                                            <b>IAA</b>
                                        </div>
                                    </Tooltip>
                                </Col>
                            </Row>
                            <hr/>

                            {['annotated_documents','annotators','mentions','concepts','relationships','assertions','labels'].map((k,i)=>
                                <div style={{margin:'10px 0'}}>
                                    {!(k === 'annotated_documents' && props.document !== false) && <Row>

                                        <Col
                                            md={7}>{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}:</Col>
                                        <Col md={2}>{GlobalStats[k]}
                                        </Col>
                                        <Col md={3}>
                                            {Object.keys(GlobalStats['iaa']).indexOf(k) !== -1 && <>{GlobalStats['iaa'][k]}</>}
                                        </Col>
                                    </Row>}
                                    {k === 'annotators' && props.document === false && <hr/>}
                                </div>

                            )}
                        </>

                        : <div className='loading'><CircularProgress />

                        </div>}
                </div>
            {/*</Collapse>*/}

            </div>
        </div></div>
    );
}
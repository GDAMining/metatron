import {Col, Row} from "react-bootstrap";
import Button from "@mui/material/Button";

import axios from "axios";
import {ButtonGroup} from "@material-ui/core";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from '@mui/material/TextField';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import Badge from 'react-bootstrap/Badge'
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import Collapse from "@material-ui/core/Collapse";
import Paper from "@mui/material/Paper";
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {AppContext} from "../../App";
import './stats.css'
import {useParams} from "react-router-dom";
import {CircularProgress, IconButton} from "@mui/material";
import PieChart from "./utils/PieChart";
import InfoIcon from "@material-ui/icons/Info";
import BarChart from "./utils/BarChart";
import ColumnChart from "./utils/ColumnChart";
// import Tooltip from "react-bootstrap/Tooltip";
import Tooltip from "@mui/material/Tooltip";
export default function GeneralStats(props){
    const { username,users,collectionslist,collectiondocuments } = useContext(AppContext);
    const [Username, SetUsername] = username
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [CollectionToShow,SetCollectionToShow] = useState(false)
    const [AddCollection,SetAddCollection] = useState(false)
    const [UpdateCollection,SetUpdateCollection] = useState(false)
    const [Details,SetDetails] = useState(false)
    const [UsersList,SetUsersList] = users
    const {collection_id} = useParams()
    const [CollectionCur,SetCollectionCur] = useState(false)
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [Type,SetType] = useState('my')
    const [Update,SetUpdate] = useState(false)
    const [OpenArea,SetOpenArea] = useState(false)
    const [GlobalStats,SetGlobalStats] = useState(false)
    const [ShowSubject,SetShowSubject] = useState(false)
    const [ShowObject,SetShowObject] = useState(false)
    const [ShowPredicate,SetShowPredicate] = useState(false)
    const [ResultSub,SetResultSub] = useState(false)
    const [Annotators,SetAnnotators] = useState(false)
    const [ConceptsStats,SetConceptsStats] = useState(false)
    const [ConceptsAreaStats,SetConceptsAreasStats] = useState(false)

    const [GeneralStats,SetGeneralStats] = useState(false)

    useEffect(()=>{
        if(ConceptsStats){
            let personal = new Array(Object.keys(ConceptsStats['count_per_area']).length).fill(false)
            SetOpenArea(personal)
        }
    },[ConceptsStats])

    useEffect(()=>{
        let doc = props.document
        if (doc === null || doc === '' || doc === undefined || doc === false){
            doc = ''
        }
        axios.get('statistics/global/general',{params:{document : doc,collection:collection_id}})
            .then(r=>{
                SetGeneralStats(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))

        axios.get('statistics/global/concept_area',{params:{document : doc,collection:collection_id}})
            .then(r=>{
                SetConceptsStats(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))

        axios.get('statistics/global/relationship_area',{params:{document : doc,collection:collection_id}})
            .then(r=>{
                SetConceptsAreasStats(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))

        // SetGlobalStats(false)
        // SetResultSub(false)
        // axios.get('statistics/'+collection_id+'/global',{params:{document : doc}})
        //     .then(r=>{
        //         SetGlobalStats(r.data)
        //         console.log(r.data)
        //     })
        //     .catch(error=>console.log('error',error))
        //
        axios.get('statistics/'+collection_id+'/annotation_per_document_global')
            .then(r=>{
                SetResultSub(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))
        //
        axios.get('statistics/'+collection_id+'/annotators_per_document')
            .then(r=>{
                SetAnnotators(r.data)
                console.log(r.data)
            })
            .catch(error=>console.log('error',error))


    },[props.document])




    return(
        <div style={{padding:'2%'}}>

            <Row>
                <Col md={4}> <div className={'fixedsquare'}>
                    {/*<Paper elevation={3}>*/}
                    <div style={{textAlign:'center'}}>
                        <h5>General</h5>
                        <div style={{fontSize:'0.7rem'}}>Global statistics provide an overview of the total count of annotations for each annotation type.
                            All the annotators are considered. </div>


                    </div>

                    <div style={{padding:'5px'}}>

                        {GeneralStats ?
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

                                {['annotated_documents','annotators_count','mentions','concepts','relationships','assertions','labels'].map((k,i)=>
                                    <div style={{margin:'10px 0'}}>
                                        {!(k === 'annotated_documents' && props.document !== false) && <Row>

                                            <Col
                                                md={7}>{k.charAt(0).toUpperCase() + k.slice(1).replace('_', ' ')}:</Col>
                                            <Col md={2}>{GeneralStats[k]}
                                            </Col>
                                            <Col md={3}>
                                                {Object.keys(GeneralStats['iaa']).indexOf(k) !== -1 && <>{GeneralStats['iaa'][k]}</>}
                                            </Col>
                                        </Row>}
                                        {k === 'annotators_count' && props.document === false && <hr/>}
                                    </div>

                                )}
                            </>

                            : <div className='loading'><CircularProgress />

                            </div>}
                    </div>

                    {/*</Paper>*/}



                </div>
                </Col>
                <Col md={4}> <div className={'fixedsquare'}>

                    <div style={{textAlign:'center'}}>
                        <h5>Linked concepts overview</h5>
                        <div style={{fontSize:'0.7rem'}}>For each concept type it is provided the list of concepts which have been linked to a mention at least once.
                            All the annotators are considered. </div>

                    </div>

                    <div style={{padding:'5px'}}>

                        {ConceptsStats ?
                            <>
                                <Row>
                                    <Col md={8}>

                                    </Col>
                                    <Col md={4}>
                                        <b>Count</b>
                                    </Col>

                                </Row><hr/>
                                {Object.keys(ConceptsStats['count_per_area']).map((area,i)=>
                                    <>
                                        <Row>
                                            <Col md={8}  onClick={()=>{
                                                let open = OpenArea.map(x=>x)
                                                open[i] = !open[i]
                                                SetOpenArea(open)
                                            }}>
                                                <h6 className={'btnclass'}>{area}</h6>
                                            </Col>
                                            <Col md={4}>
                                                <div  >{ConceptsStats['count_per_area'][area]}</div>
                                            </Col>
                                        </Row>
                                        <Collapse in={OpenArea[i]}>
                                            <div style={{margin:'10px'}}>
                                                {/*<hr/>*/}
                                                <>
                                                    {Object.keys(ConceptsStats['concepts_per_area'][area]).map((concept,j)=>
                                                        <Row>
                                                            <Col md={8}>
                                                                <div style={{marginLeft:'10px'}}>
                                                                    {concept}
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                {ConceptsStats['concepts_per_area'][area][concept]}
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </>

                                                <hr/>

                                            </div>


                                        </Collapse>


                                    </>
                                )}

                            </> : <div>

                                <div className='loading'><CircularProgress /></div>

                            </div>}</div></div>
                </Col>
                <Col md={4}>

                    <div className={'fixedsquare'}>
                        <div style={{textAlign:'center'}}>
                            <h5>Relationships & Assertions Concepts overview</h5>
                            <div style={{fontSize:'0.7rem'}}>Overview of the concepts assigned to subjects, predicates, objects of the relationships and assertions annotations.
                                All the annotators are considered. </div>
                        </div>

                        <div style={{padding:'5px'}}>

                            {ConceptsAreaStats ?
                                <>
                                    <Row>
                                        <Col md={8}>

                                        </Col>
                                        <Col md={4}>
                                            <b>Count</b>
                                        </Col>
                                    </Row><hr/>
                                    <Row>
                                        <Col md={12}><h6 className={'btnclass'} onClick={()=>SetShowSubject(prev=>!prev)}>
                                            Subject
                                        </h6></Col>
                                    </Row>
                                    <Collapse in={ShowSubject}>
                                        {Object.keys(ConceptsAreaStats['subject']).map(area=>
                                            <><div style={{margin:'5px 0'}}><Row >

                                                <Col md={8}>
                                                    <b>
                                                        {area}
                                                    </b>
                                                </Col>
                                                <Col md={4}>
                                                    <b>{ConceptsAreaStats['subject'][area]['count']}</b>
                                                </Col>


                                            </Row></div>
                                                {Object.keys(ConceptsAreaStats['subject'][area]).map(concept=>
                                                    <>
                                                        {concept !== 'count' && <Row>
                                                            <Col md={8}>
                                                                <div style={{marginLeft:'10px'}}>
                                                                    {concept}
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                {ConceptsAreaStats['subject'][area][concept]}
                                                            </Col>
                                                        </Row>}
                                                    </>)}
                                            </>


                                        )}<hr/>
                                    </Collapse>
                                    <Row>
                                        <Col md={12}><h6 className={'btnclass'} onClick={()=>SetShowPredicate(prev=>!prev)}>
                                            Predicate
                                        </h6></Col>                    </Row>
                                    <Collapse in={ShowPredicate}>
                                        {Object.keys(ConceptsAreaStats['predicate']).map(area=>
                                            <><div style={{margin:'5px 0'}}><Row>


                                                <Col md={8}>
                                                    <b>{area}</b>
                                                </Col>
                                                <Col md={4}>
                                                    <b>{ConceptsAreaStats['predicate'][area]['count']}</b>
                                                </Col>
                                            </Row></div>
                                                {Object.keys(ConceptsAreaStats['predicate'][area]).map(concept=>
                                                    <>
                                                        {concept !== 'count' &&
                                                        <Row>
                                                            <Col md={8}>
                                                                <div style={{marginLeft:'10px'}}>

                                                                    {concept}
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                {ConceptsAreaStats['predicate'][area][concept]}
                                                            </Col>
                                                        </Row>}
                                                    </>)}
                                            </>


                                        )}<hr/>
                                    </Collapse>
                                    <Row>
                                        <Col md={12}><h6 className={'btnclass'} onClick={()=>SetShowObject(prev=>!prev)}>Object
                                        </h6></Col>
                                    </Row>

                                    <Collapse in={ShowObject}>
                                        {Object.keys(ConceptsAreaStats['object']).map(area=>
                                            <><div style={{margin:'5px 0'}}><Row>


                                                <Col md={8}>
                                                    <b>
                                                        {area}
                                                    </b>
                                                </Col>
                                                <Col md={4}>
                                                    <b>{ConceptsAreaStats['object'][area]['count']}</b>
                                                </Col>
                                            </Row></div>
                                                {Object.keys(ConceptsAreaStats['object'][area]).map(concept=>
                                                    <>
                                                        {concept !== 'count' && <Row>
                                                            <Col md={8}>                                           <div style={{marginLeft:'10px'}}>

                                                                {concept}</div>
                                                            </Col>
                                                            <Col md={4}>
                                                                {ConceptsAreaStats['object'][area][concept]}
                                                            </Col>
                                                        </Row>}
                                                    </>)}
                                            </>


                                        )}<hr/>
                                    </Collapse>







                                </> : <div>

                                    {!GlobalStats && <div className='loading'><CircularProgress/></div>}

                                </div>}</div>
                    </div>
                </Col>
            </Row><hr/>
            {(!props.document && ResultSub) ? <><div style={{margin:'2%'}}>
                <h3 style={{textAlign:"center"}}>Documents annotations overview</h3>
                <div style={{textAlign:'center',fontSize:'0.7rem'}}>
                    For each document it is provided the number of annotations per annotation type.
                    All the annotations are considered. </div>
                <Row>

                    <Col md={12} >
                        <BarChart data={ResultSub} />
                    </Col>

                </Row>
            </div><hr/></> :  <div>

                {!ResultSub && <div className='loading'><CircularProgress/></div>}

            </div>}

            {(!props.document && Annotators ) ? <><div style={{margin:'2%'}}>
                <h3 style={{textAlign:"center"}}>Annotators overview</h3>
                <div style={{textAlign:'center',fontSize:'0.7rem'}}>
                    For each document it is provided the number of annotators.</div>
                <Row>

                    <Col md={12} >
                        <ColumnChart annotators={Annotators} />
                    </Col>

                </Row>
            </div><hr/></> :  <div>

                {(!Annotators) && <div className='loading'><CircularProgress annotators = {Annotators} /></div>}

            </div>}


            {(ConceptsAreaStats) ? <div >
                <div style={{margin: '2% 0', textAlign:'center'}}>
                    <h3>Concept types distribution</h3>
                    <div style={{fontSize:'0.7rem'}}>The four pie charts show the concept types distributions. The first one provides a global overview about the concept type distribution of all the annotated concepts, hence both those concerning the linked concepts and those concerning relationships and assertions. The three charts below, instead,
                    provide this overview for subjects, predicates, and objects respectively.</div>
                </div>
                <Row>
                    <Col md={4} style={{textAlign:'center'}}>


                    </Col>
                    <Col md={4} style={{textAlign:'center'}}>
                        <h5>Global</h5>

                        <div className={'centerpie'}>
                            <PieChart series={Object.keys(ConceptsAreaStats['global']).map(x=>ConceptsAreaStats['global'][x]['count'])} labels={Object.keys(ConceptsAreaStats['global'])} width={400}/>
                        </div>

                    </Col>
                    <Col md={4} style={{textAlign:'center'}}>


                    </Col>
                </Row>
                <div style={{margin:'3%'}}>
                    <Row>
                        <Col md={4} style={{textAlign:'center'}}>
                            <h5>Subject</h5>
                            <div className={'centerpie'}>

                                <PieChart series={Object.keys(ConceptsAreaStats['subject']).filter(x=>x!=='count').map(x=>ConceptsAreaStats['subject'][x]['count'])} labels={Object.keys(ConceptsAreaStats['subject']).filter(k=>k!== 'count')} width={350}/>
                            </div>

                        </Col>
                        <Col md={4} style={{textAlign:'center'}}>
                            <h5>Predicate</h5>

                            <div className={'centerpie'}>
                                <PieChart series={Object.keys(ConceptsAreaStats['predicate']).filter(x=>x!=='count').map(x=>ConceptsAreaStats['predicate'][x]['count'])} labels={Object.keys(ConceptsAreaStats['predicate']).filter(k=>k!== 'count')} width={350}/>
                            </div>


                        </Col>
                        <Col md={4} style={{textAlign:'center'}}>
                            <h5>Object</h5>

                            <div className={'centerpie'}>
                                <PieChart series={Object.keys(ConceptsAreaStats['object']).filter(x=>x!=='count').map(x=>ConceptsAreaStats['object'][x]['count'])} labels={Object.keys(ConceptsAreaStats['object']).filter(k=>k!== 'count')} width={350}/>
                            </div>

                        </Col>
                    </Row>
                </div>


                <hr/>

            </div> :  <div>

                {!ConceptsAreaStats && <div className='loading'><CircularProgress/></div>}

            </div>}






            {/*<span style={{display:'inline-block'}}><h3>{props.collection_name}</h3></span >&nbsp;&nbsp;{bull}&nbsp;&nbsp;<span style={{display:'inline-block'}}><h4>{props.document_id}</h4></span>*/}
            {/*<span style={{display:'inline-block'}}><h3>Collection name</h3></span >&nbsp;&nbsp;/&nbsp;&nbsp;<span style={{display:'inline-block'}}><h4>Doc id</h4></span>*/}
        </div>
    );
}
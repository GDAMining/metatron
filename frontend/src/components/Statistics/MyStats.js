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
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export default function MyStats(props){
    const { username,users,collectionslist,collectiondocuments,collection } = useContext(AppContext);
    const [Username, SetUsername] = username
    const [UserTeam, SetUserTeam] = useState(false)
    const [Creator, SetCreator] = useState(false)
    const [CollectionsList,SetCollectionsList] = collectionslist
    const [Collection,SetCollection] = collection
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
    const [PersonalStats,SetPersonalStats] = useState(false)
    const [ShowSubject,SetShowSubject] = useState(false)
    const [ShowObject,SetShowObject] = useState(false)
    const [ShowPredicate,SetShowPredicate] = useState(false)
    const [ResultSub,SetResultSub] = useState(false)

    const [GeneralStats,SetGeneralStats] = useState(false)
    const [ConceptsStats,SetConceptsStats] = useState(false)
    const [ConceptsAreasStats,SetConceptsAreasStats] = useState(false)

    useEffect(()=>{
        SetUserTeam(Username)
        if(collection_id){
            axios.get('collections/users',{params:{collection:collection_id}})
                .then(response=>{
                    console.log(response)
                    var ar = (response.data['members'].map(x=>x.username))
                    ar.push(Username)
                    SetUsersList(ar)
                })
                .catch(error=>{
                    console.log('error',error)

                })
        }

    },[Username,Collection])

    useEffect(()=>{
        if(CollectionsList){
            CollectionsList.map(col=>{
                if(col.id === Collection){
                    SetCreator(col.creator)
                }
            })
        }
    },[CollectionsList])

    useEffect(()=>{
        if(ConceptsStats){
            let personal = new Array(Object.keys(ConceptsStats['count_per_area']).length).fill(false)
            SetOpenArea(personal)
        }
    },[ConceptsStats])

    useEffect(()=>{
        SetPersonalStats(false)
        SetResultSub(false)

        let doc = props.document
        if (doc === null || doc === '' || doc === undefined || doc === false){
            doc = ''
        }

        if(UserTeam) {
            // general è il componente!!
            axios.get('statistics/personal/general', {
                params: {
                    document: doc,
                    collection: collection_id,
                    user: UserTeam
                }
            })
                .then(r => {
                    SetGeneralStats(r.data)
                    // SetPersonalStats(r.data)
                    console.log(r.data)
                })
                .catch(error => console.log('error', error))

            axios.get('statistics/personal/concept_area', {params: {user: UserTeam,document: doc, collection: collection_id}})
                .then(r => {
                    SetConceptsStats(r.data)
                    console.log(r.data)
                })
                .catch(error => console.log('error', error))

            axios.get('statistics/personal/relationship_area', {params: {user: UserTeam,document: doc, collection: collection_id}})
                .then(r => {
                    SetConceptsAreasStats(r.data)
                    console.log(r.data)
                })
                .catch(error => console.log('error', error))
            // if(Username){
            //     axios.get('statistics/'+collection_id+'/'+Username,{params:{document : doc}})
            //         .then(r=>{
            //             SetGeneralStats(r.data)
            //             // SetPersonalStats(r.data)
            //             console.log(r.data)
            //         })
            //         .catch(error=>console.log('error',error))
            // }


            axios.get('statistics/' + collection_id + '/annotation_per_document',{params:{user: UserTeam}})
                .then(r => {
                    SetResultSub(r.data)
                    console.log(r.data)
                })
                .catch(error => console.log('error', error))
        }
    },[props.document,UserTeam])




    return(
        <div style={{padding:'2%'}}>
            {Username === Creator && UserTeam && UsersList && <div>
                <Row>
                    <Col md={3}></Col>

                    {/*<Col md={3} style={{fontSize:'0.8rem',float:'right'}}>Select a specific annotator. By default you are provided with your statistics.</Col>*/}
                    <Col md={6}>
                        <div className={'subcontainer'}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                placeholder={'Insert an annotator'}
                                options={UsersList}
                                getOptionLabel={(option) => option}

                                value={UserTeam}
                                // value={DocumentPred ? DocumentPred : ''}
                                onChange={(event, newInputValue) => {
                                    console.log(newInputValue)
                                    SetUserTeam(newInputValue)
                                }}
                                sx={{ width: 300 }}
                                size={'small'}
                                renderInput={(params) => <TextField {...params} label="Annotator" />}
                                renderOption={(props, option, { inputValue }) => {
                                    const matches = match(option, inputValue, {insideWords: true});
                                    const parts = parse(option, matches);

                                    return (
                                        <li {...props}>
                                            <div>
                                                {parts.map((part, index) => (
                                                    <span
                                                        key={index}
                                                        style={{
                                                            fontWeight: part.highlight ? 700 : 400,
                                                        }}
                                                    >
                                              {part.text}
                                            </span>
                                                ))}
                                            </div>
                                        </li>
                                    );
                                }}
                            />
                        </div>



                    </Col>
                    <Col md={3}></Col>
                </Row>
                <br/>
            </div>}
            <Row>
                <Col md={4}> <div className={'fixedsquare'}>
                    {/*<Paper elevation={3}>*/}
                    <div style={{textAlign:'center'}}>
                        <h5>General</h5>
                        <div style={{fontSize:'0.7rem'}}>Personal statistics provide an overview of the total count of annotations for each annotation type. Only your annotations are considered. </div>

                    </div>

                        <div style={{padding:'5px'}}>

                            {GeneralStats ?
                                <>
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
                                            <Col md={4}>{GeneralStats[k]}
                                                {/*{([]) && <IconButton><InfoIcon/></IconButton></Col>}*/}
                                            </Col>
                                        </Row>}
                                        {k === 'annotated_documents' && props.document === false && <hr/>}
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
                        <div style={{fontSize:'0.7rem'}}>For each concept type it is provided the list of concepts which have been linked to a mention at least once. Only your annotations are considered. </div>

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
                    {/*{PersonalStats ? <div>*/}

                    {/*<div style={{textAlign:'center'}}>*/}
                    {/*    <h5>Concepts count (Mention-Concept association)</h5>*/}
                    {/*</div>*/}
                    <div className={'fixedsquare'}>
                    <div style={{textAlign:'center'}}>
                        <h5>Relationships & Assertions Concepts overview</h5>
                        <div style={{fontSize:'0.7rem'}}>Overview of the concepts assigned to subjects, predicates, objects of the relationships and assertions annotations.
                            Only your annotations are considered. </div>

                    </div>

                    <div style={{padding:'5px'}}>

                        {ConceptsAreasStats ?
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
                        {Object.keys(ConceptsAreasStats['subject']).map(area=>
                            <><div style={{margin:'5px 0'}}><Row >

                                    <Col md={8}>
                                        <b>
                                            {area}
                                        </b>
                                    </Col>
                                    <Col md={4}>
                                        <b>{ConceptsAreasStats['subject'][area]['count']}</b>
                                    </Col>


                            </Row></div>
                            {Object.keys(ConceptsAreasStats['subject'][area]).map(concept=>
                                <>
                                    {concept !== 'count' && <Row>
                                    <Col md={8}>
                                           <div style={{marginLeft:'10px'}}>
                                               {concept}
                                           </div>
                                    </Col>
                                    <Col md={4}>
                                        {ConceptsAreasStats['subject'][area][concept]}
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
                        {Object.keys(ConceptsAreasStats['predicate']).map(area=>
                            <><div style={{margin:'5px 0'}}><Row>


                                <Col md={8}>
                                    <b>
                                        {area}
                                    </b>
                                </Col>
                                <Col md={4}>
                                    <b>{ConceptsAreasStats['predicate'][area]['count']}</b>
                                </Col>
                            </Row></div>
                                {Object.keys(ConceptsAreasStats['predicate'][area]).map(concept=>
                                    <>
                                        {concept !== 'count' &&
                                        <Row>
                                            <Col md={8}>
                                                <div style={{marginLeft:'10px'}}>

                                                    {concept}
                                                </div>
                                            </Col>
                                            <Col md={4}>
                                                {ConceptsAreasStats['predicate'][area][concept]}
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
                        {Object.keys(ConceptsAreasStats['object']).map(area=>
                            <><div style={{margin:'5px 0'}}><Row>


                                <Col md={8}>
                                    <b>
                                        {area}
                                    </b>
                                </Col>
                                <Col md={4}>
                                    <b>{ConceptsAreasStats['object'][area]['count']}</b>
                                </Col>
                            </Row></div>
                                {Object.keys(ConceptsAreasStats['object'][area]).map(concept=>
                                    <>
                                        {concept !== 'count' && <Row>
                                            <Col md={8}>                                           <div style={{marginLeft:'10px'}}>

                                                {concept}</div>
                                            </Col>
                                            <Col md={4}>
                                                {ConceptsAreasStats['object'][area][concept]}
                                            </Col>
                                        </Row>}
                                    </>)}
                            </>


                        )}<hr/>
                    </Collapse>







                    </> : <div>

                                {!PersonalStats && <div className='loading'><CircularProgress/></div>}

                            </div>}</div>
                    </div>
                </Col>
            </Row><hr/>
            {(!props.document && ResultSub) ? <><div style={{margin:'2%'}}>
                <h3 style={{textAlign:"center"}}>Documents annotations overview</h3>
                <div style={{textAlign:'center',fontSize:'0.7rem'}}>
                    For each document it is provided the number of annotations per annotation type.
                    Only your annotations are considered. </div>
                <Row>

                    <Col md={12} >
                        <BarChart data={ResultSub} />
                    </Col>

                </Row>
            </div><hr/></> :  <div>

                {!ResultSub && <div className='loading'><CircularProgress/></div>}

            </div>}
            {(ConceptsAreasStats) ? <div >
                <div style={{margin: '2% 0', textAlign:'center'}}>
                    <h3>Concept classes distribution</h3>
                </div>
                <Row>
                    <Col md={4} style={{textAlign:'center'}}>


                    </Col>
                    <Col md={4} style={{textAlign:'center'}}>
                        <h5>Global</h5>

                        <div className={'centerpie'}>
                            <PieChart series={Object.keys(ConceptsAreasStats['global']).map(x=>ConceptsAreasStats['global'][x]['count'])} labels={Object.keys(ConceptsAreasStats['global'])} width={400}/>
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

                                <PieChart series={Object.keys(ConceptsAreasStats['subject']).filter(x=>x!=='count').map(x=>ConceptsAreasStats['subject'][x]['count'])} labels={Object.keys(ConceptsAreasStats['subject']).filter(k=>k!== 'count')} width={350}/>
                            </div>

                        </Col>
                        <Col md={4} style={{textAlign:'center'}}>
                            <h5>Predicate</h5>

                            <div className={'centerpie'}>
                                <PieChart series={Object.keys(ConceptsAreasStats['predicate']).filter(x=>x!=='count').map(x=>ConceptsAreasStats['predicate'][x]['count'])} labels={Object.keys(ConceptsAreasStats['predicate']).filter(k=>k!== 'count')} width={350}/>
                            </div>


                        </Col>
                        <Col md={4} style={{textAlign:'center'}}>
                            <h5>Object</h5>

                            <div className={'centerpie'}>
                                <PieChart series={Object.keys(ConceptsAreasStats['object']).filter(x=>x!=='count').map(x=>ConceptsAreasStats['object'][x]['count'])} labels={Object.keys(ConceptsAreasStats['object']).filter(k=>k!== 'count')} width={350}/>
                            </div>

                        </Col>
                    </Row>
                </div>


                <hr/>

            </div> :  <div>

                {!ConceptsAreasStats && <div className='loading'><CircularProgress/></div>}

            </div>}






            {/*<span style={{display:'inline-block'}}><h3>{props.collection_name}</h3></span >&nbsp;&nbsp;{bull}&nbsp;&nbsp;<span style={{display:'inline-block'}}><h4>{props.document_id}</h4></span>*/}
            {/*<span style={{display:'inline-block'}}><h3>Collection name</h3></span >&nbsp;&nbsp;/&nbsp;&nbsp;<span style={{display:'inline-block'}}><h4>Doc id</h4></span>*/}
        </div>
    );
}

import './App.css';
// import LabelList from "./components/Labels/LabelList";
import {AppContext} from './App';
import React, {useState, useEffect, useContext, createContext, useRef} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { styled } from '@mui/material/styles';
import Collapse from '@material-ui/core/Collapse';
import { Container, Row, Col } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { CSSTransition } from 'react-transition-group';

import Divider from '@mui/material/Divider';
import {CollectionsBookmarkOutlined} from "@material-ui/icons";
import ChangeConfiguration from "./components/BaseComponents/ChangeCollectionDocument";
import ActualPosition from "./components/BaseComponents/ActualPosition";
// import PassageLabelsList from "./components/Passages/PassageLabelsList";
import Chip from '@mui/material/Chip';
import DocumentToolBar from "./components/Document/ToolBar/DocumentToolBar";
import Document from "./components/Document/DocumentFinal_2";
import LabelsClass from "./components/RightsSideMenu/Labels";
import SimpleAccordion from "./components/BaseComponents/AccordionsDocumentsAnnotators";
import MyAccordion from "./components/BaseComponents/AccordionsDocumentsAnnotators";
import MentionsListClass from "./components/RightsSideMenu/MentionsListClass";
import StatsClass from "./components/RightsSideMenu/StatsClass";
import DraggableModal from "./components/Annotation/concepts/ConceptModal";
import RelationshipListClass from "./components/RightsSideMenu/RelationshipClass";
import SideBar from "./components/SideBar/PermanentSideBar";
import FilterComponent from "./components/SideBar/Filter";
import MembersComponent from "./components/SideBar/Members";
import CollectionsComponent from "./components/SideBar/ChangeCollections";
import ChangeDocumentComppnent from "./components/SideBar/ChangeDocument";
import SummaryStatsComponent from "./components/SideBar/StatsStummary";
import ConceptsListClass from "./components/RightsSideMenu/ConceptsListClass";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
import { DeleteRange, ClickOnBaseIndex } from './components/HelperFunctions/HelperFunctions'
import ChangeSettingsComponent from "./components/SideBar/ChangeSettings";
import {HuePicker} from "react-color";

// export const PassageContext = createContext('')

function DocumentAndAnnotations() {
    const { username,collection,annotators,users,showlabelspannel,showmentionsspannel,showrelspannel, showconceptspannel,showsettings,areascolors,documentlist,showdocs,collectionslist,collectiondocuments,annotatedlabels,fieldsToAnn,fields,showmembers,showfilter,showstats,showcollections,expand,inarel,labels,addconceptmodal,annotation,mentions,document_id,concepts } = useContext(AppContext);
    const [UsersList,SetUsersList] = users
    const [Annotation,SetAnnotation] = annotation
    const [ShowLabels,SetShowLabels] = showlabelspannel
    const [ShowMentions,SetShowMentions] = showmentionsspannel
    const [ShowConcepts,SetShowConcepts] = showconceptspannel
    const [ShowRels,SetShowRels] = showrelspannel
    const [DocumentID,SetDocumentID] = document_id
    const [ShowAnnotators,SetShowAnnotators] = useState(false)
    const [ChangeConf,SetChangeConf] = useState(false)
    // const [Expand,SetExpand] = useState(false)
    const [Expand,SetExpand] = expand
    const [Collection,SetCollection] = collection
    const [Username,SetUsername] = username
    const [CollList,SetCollList] = collectionslist
    const [MentionsList, SetMentionsList] = mentions
    const [Labels, SetLabels] = labels
    const [InARel,SetInARel] = inarel;
    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [CollectionDescription,SetCollectionDescription] = useState(false)
    const [ConceptsList,SetConceptsList] = concepts
    const [DocumentDesc,SetDocumentDesc] = useState(false)
    const [rows, setRows] = useState([])
    const [defaultColumnWidths,setdefaultColumnWidths] = useState([]);
    const [LoadingTable,SetLoadingTable] = useState(false)
    const [CollectionName, SetCollectionName] = useState(false)
    const [LoadingDoc,SetLoadingDoc] = useState(true)
    const [Annotators,SetAnnotators] = annotators
    const [ShowDocs,SetShowDocs] = showdocs
    const [ShowMembers,SetShowMembers] =showmembers
    const [ShowSettings,SetShowSettings] =showsettings
    const [ShowStats,SetShowStats] = showstats
    const [ShowCollections,SetShowCollections] = showcollections
    const [ShowFilter,SetShowFilter] = showfilter
    const [Fields,SetFields] = fields
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn
    const [AnnotatedLabels, SetAnnotatedLabels] = annotatedlabels
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [DisplayDocuments,SetDisplayDocuments] = useState([])
    const [ClickedSideBut,SetClickedSideBut] = useState(false)
    const [DocumentList,SetDocumentList] = documentlist
    const [AreasColors,SetAreasColors] = areascolors


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        boxShadow: null,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));


    useEffect(()=>{
        console.log('collection',Collection)
        if(Collection){
            axios.get('get_collections',{params:{collection:Collection}})
                .then(response=>{
                    SetCollectionDescription(response.data)
                })
            axios.get('get_collection_labels')
                .then(response=>{
                    SetLabels(response.data)
                })
            axios.get('get_cur_collection_documents')
                .then(response=>{
                    SetCollectionDocuments(response.data)
                    SetDisplayDocuments(response.data)
                })


        }
    },[Collection])



    useEffect(()=>{
        console.log('user',Username)
        localStorage.clear();

        if(Username && Username !== ''){
            console.log('entro',Username)
            var fields = []
            // axios.get("get_fields").then(response => {
            //
            //     SetFields(response.data)
            //     // SetLoadingMenu(false)
            // })



            axios.get("get_session_params").then(response => {
                console.log('params',response.data)
                SetCollection(response.data['collection']);
                SetAnnotation(response.data['annotation']);
                SetDocumentID(response.data['document']);

            })

            axios.get("get_users_list")
                .then(response => {
                    if(response.data['users'].length>0){
                        SetUsersList(response.data['users'])
                    }})
                .catch(error=>{
                    console.log(error)
                })

            axios.get('get_collections').then(response=>{
                SetCollList(response.data['collections'])})
                .catch(error=>{
                    console.log('error',error)
                })



        }
    },[])



    useEffect(()=>{
        if(DocumentID){
            // console.log('fields',Fields,FieldsToAnn)

            // GET FIELDS OF A DOCUMENT
            axios.get("get_fields").then(response => {
                var fields = response.data['fields']
                var fields_to_ann = response.data['fields_to_ann']
                // console.log('fields',fields,fields_to_ann)
                if(FieldsToAnn === []){
                    SetFieldsToAnn(fields)
                }
                else{
                    SetFieldsToAnn(fields_to_ann)
                }
                if(!Fields|| Fields.length === 0 || (Fields.length > 0 && Fields.some(r=>fields.indexOf(r) === -1))){
                    SetFields(fields)

                }

            })

            // GET ANNOTATORS
            async function fetchAnnotators(){
                const response = await axios.get('get_annotators');
                console.log('request',response)
                SetAnnotators(response.data)
                return response
            }
            fetchAnnotators()

            // GET LABELS OF A DOCUMENT
            async function fetchLabels(){
                const response = await axios.get('get_annotated_labels');
                console.log('request',response)
                SetAnnotatedLabels(response.data)
                return response
            }
            fetchLabels()

            // GET MENTIONS OF A DOCUMENT
            async function fetchMentions(){
                const response = await axios.get('get_mentions');
                console.log('request',response)
                SetMentionsList(response.data)
                return response
            }
            fetchMentions()

            async function fetchConcepts(){
                const response = await axios.get('get_concepts');
                console.log('request',response)
                SetConceptsList(response.data)
                return response
            }
            fetchConcepts()



        }
    },[DocumentID])

    useEffect(()=>{
        if(ConceptsList){
            let areas = {}
            ConceptsList.map(c=>{
                if(Object.keys(areas).indexOf(c.area) === -1){
                    let color = window.localStorage.getItem(c['concept'].area)
                    if(color === null){
                        color = 'rgba(65,105,225,1)'
                    }
                    areas[c['concept'].area] = color
                }
            })
            SetAreasColors(areas)
        }

    },[ConceptsList])

    // function ClickOnBaseIndex(e){
    //     e.preventDefault()
    //     if(InARel){
    //         console.log('set false')
    //         SetInARel(false)
    //
    //
    //     }
    // }

    useEffect(()=>{
        console.log('CONCEPTS LIST',ConceptsList)
    },[ConceptsList])

    return (

        <div className="baseindex" onClick={(e)=>ClickOnBaseIndex(e,InARel,SetInARel)}>

            {ShowAddConceptModal && <DraggableModal showconceptmodal={ShowAddConceptModal} setshowconceptmodal={SetShowAddConceptModal} />}

            <div className='doc_tool_bar'>
                <Row>
                    <Col md={12}>
                        <div>
                            <DocumentToolBar key={DisplayDocuments} documentList={DisplayDocuments}/>
                        </div>

                    </Col>


                </Row>
            </div>



            <div id='left-side-bar-content'>
                <CSSTransition in={Expand === true} timeout={150} classNames="foo" appear onEntered={(e)=>{
                    SetClickedSideBut(true)

                }} onExited={(e)=>{SetClickedSideBut(false)}}>
                    <div id='left-side-bar'>
                        {ClickedSideBut && ShowStats && <><SummaryStatsComponent /></>}
                        {ClickedSideBut && ShowMembers &&   <><MembersComponent /></>}
                        {ClickedSideBut && ShowCollections   && <><CollectionsComponent /></>}
                        {ClickedSideBut  && ShowDocs && <><ChangeDocumentComppnent displayDocs = {DisplayDocuments} setDisplayDocs={SetDisplayDocuments} /></>}
                        {ClickedSideBut  && ShowFilter && <><FilterComponent /></>}
                        {ClickedSideBut  && ShowSettings && <><ChangeSettingsComponent /></>}</div>

                </CSSTransition>
            </div>


            <div >
                <Row>
                    {/*<SideBar />*/}
                    {/*{Expand && <Col md={2}>*/}

                    {/*</Col>}*/}
                    {/*<Col md={Expand ? 7 : 7} className='trans'>*/}
                    <Col md={(ShowMentions || ShowLabels || ShowRels || ShowConcepts) ? 9: 12} className={'trans'}>
                        {/*<Paper elevation={2} className='paper'>*/}
                        <div style={{padding:'1%',textAlign:'justify'}}>
                            <Document />
                        </div>
                        {/*</Paper>*/}
                    </Col>
                    {(ShowMentions || ShowLabels || ShowRels || ShowConcepts) && <Col md={3} >
                        {/*<><StatsClass /><hr/></>*/}
                        {Labels.length > 0 && !InARel && ShowLabels &&  <><LabelsClass/><hr/></>}<br/>
                        {MentionsList.length > 0 && !InARel && ShowMentions && <><MentionsListClass /><hr/></>}<br/>
                        {ConceptsList.length > 0 && !InARel && ShowConcepts && <><ConceptsListClass /><hr/></>}<br/>
                        {/*{InARel  && ShowRels && <><RelationshipListClass /><hr/></>}<br/>*/}


                    </Col>}

                </Row>
            </div>



        </div>
    );
}

export default DocumentAndAnnotation;

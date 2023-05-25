import './App.css';
// import LabelList from "./components/Labels/LabelList";
import {AppContext} from './App';
import React, {useState, useEffect, useContext, useCallback, useMemo, createContext} from "react";
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
import LabelsClass from "./components/RightsSideMenu/labels/Labels";
import SimpleAccordion from "./components/BaseComponents/AccordionsDocumentsAnnotators";
import MyAccordion from "./components/BaseComponents/AccordionsDocumentsAnnotators";
import MentionsListClass from "./components/RightsSideMenu/mentions/MentionsListClass";
import StatsClass from "./components/RightsSideMenu/StatsClass";
import DraggableModal from "./components/Annotation/concepts/DraggableConceptModal";
import RelationshipListClass from "./components/to delete/RelationshipClass";
import SideBar from "./components/SideBar/PermanentSideBar";
import FilterComponent from "./components/SideBar/utils/Filter";
import MembersComponent from "./components/SideBar/Members";
import CollectionsComponent from "./components/SideBar/ChangeCollections";
import ChangeDocumentComppnent from "./components/SideBar/ChangeDocument";
import SummaryStatsComponent from "./components/SideBar/StatsStummary";
import ConceptsListClass from "./components/RightsSideMenu/associations/ConceptsListClass";

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from "@mui/material/Button";
// axios.defaults.xsrfCookieName = "csrftoken";
// axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
import { DeleteRange, ClickOnBaseIndex } from './components/HelperFunctions/HelperFunctions'
import ChangeSettingsComponent from "./components/SideBar/ChangeSettings";
import {HuePicker} from "react-color";
import RightSideMenu from "./components/RightsSideMenu/RightSideMenu";
import RelationshipComponent from "./components/RightsSideMenu/relationships/RelationshipComponent";
import ChangeViews from "./components/SideBar/ChangeViews";
import DownloadDocument from "./components/SideBar/DownloadDocuments";
import UploadAnnotation from "./components/Document/ToolBar/UploaddAnnotation";
import UploadDocument from "./components/SideBar/UploadDocuments";
import RelationshipsClass from "./components/RightsSideMenu/relationships/RelationshipsClass";
import Dialog from "@mui/material/Dialog";
import AssertionsList from "./components/RightsSideMenu/assertions/AssertionsComponent";
import AutomaticAnnotation from "./components/SideBar/AutomaticAnnotation";

export const ConceptContext = createContext('')
export const RelSearchContext = createContext('')



const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function BaseIndex() {
    const { username,collection,opensnack,loadingann,startrange,currentdiv,endrange,snackmessage,secondsel,firstsel,predicate,modifyrel,showautomaticannotation,profile,curannotator,newrelation,source,newfact,newfactin,readonlyrelation,enablerelation,sourcetext,sourceconcepts,targettext,targetconcepts,predicatetext,predicateconcepts,target,collectionconcepts,showfactspannel,annotators,showupload,showdownload,curmention,showview,users,showlabelspannel,showmentionsspannel,showrelspannel, showconceptspannel,showsettings,areascolors,documentlist,showdocs,collectionslist,collectiondocuments,annotatedlabels,fieldsToAnn,fields,showmembers,showfilter,showstats,showcollections,expand,inarel,labels,addconceptmodal,annotation,mentions,document_id,concepts } = useContext(AppContext);
    const [UsersList,SetUsersList] = users
    const [CurMention,SetCurMention] = curmention;
    const [ShowFacts,SetShowFacts] = showfactspannel
    const [Start,SetStart] = startrange
    const [End,SetEnd] = endrange
    const [Annotation,SetAnnotation] = annotation
    const [ShowLabels,SetShowLabels] = showlabelspannel
    const [ShowMentions,SetShowMentions] = showmentionsspannel
    const [ShowConcepts,SetShowConcepts] = showconceptspannel
    const [ShowRels,SetShowRels] = showrelspannel
    const [ShowAutoAnno,SetShowAutoAnno] = showautomaticannotation;
    const [DocumentID,SetDocumentID] = document_id
    const [Expand,SetExpand] = expand
    const [NewRelation,SetNewRelation] = newrelation
    const [Collection,SetCollection] = collection
    const [Username,SetUsername] = username
    const [CollList,SetCollList] = collectionslist
    const [Labels, SetLabels] = labels
    const [InARel,SetInARel] = inarel;
    const [NewFact,SetNewFact] = newfact;
    const [SnackMessage,SetSnackMessage] = snackmessage;
    const [OpenSnack,SetOpenSnack] = opensnack
    const [ShowAddConceptModal,SetShowAddConceptModal] = addconceptmodal
    const [CollectionDescription,SetCollectionDescription] = useState(false)
    const [Annotators,SetAnnotators] = annotators
    const [ShowDocs,SetShowDocs] = showdocs
    const [ShowMembers,SetShowMembers] =showmembers
    const [ShowSettings,SetShowSettings] =showsettings
    const [ShowUpload,SetShowUpload] =showupload
    const [ShowStats,SetShowStats] = showstats
    const [ShowCollections,SetShowCollections] = showcollections
    const [ShowView,SetShowView] = showview
    const [ShowFilter,SetShowFilter] = showfilter
    const [ShowDownload,SetShowDownload] = showdownload
    const [Fields,SetFields] = fields
    const [FieldsToAnn,SetFieldsToAnn] = fieldsToAnn
    const [AnnotatedLabels, SetAnnotatedLabels] = annotatedlabels
    const [CollectionDocuments,SetCollectionDocuments] = collectiondocuments
    const [DisplayDocuments,SetDisplayDocuments] = useState([])
    const [ClickedSideBut,SetClickedSideBut] = useState(false)
    const [ClickedAnnoBut,SetClickedAnnoBut] = useState(false)
    const [CollectionConcepts,SetCollectionConcepts] = collectionconcepts
    const [AreasColors,SetAreasColors] = areascolors
    const [Modify,SetModify] = modifyrel
    const [Source,SetSource] = source
    const [Predicate,SetPredicate] = predicate
    const [Target,SetTarget] = target
    const [SourceText,SetSourceText] = sourcetext
    const [PredicateText,SetPredicateText] = predicatetext
    const [TargetText,SetTargetText] = targettext
    const [SourceConcepts,SetSourceConcepts] = sourceconcepts
    const [PredicateConcepts, SetPredicateConcepts] = predicateconcepts
    const [TargetConcepts,SetTargetConcepts] = targetconcepts
    const [SPArrow,SetSPArrow] = useState(false)
    const [PTArrow,SetPTArrow] = useState(false)
    const [STArrow,SetSTArrow] = useState(false)
    const [SPArrowFloat,SetSPArrowFloat] = useState(false)
    const [PTArrowFloat,SetPTArrowFloat] = useState(false)
    const [STArrowFloat,SetSTArrowFloat] = useState(false)
    const [SearchSubject, SetSearchSubject] = useState(false)
    const [SearchPredicate, SetSearchPredicate] = useState(false)
    const [SearchObject, SetSearchObject] = useState(false)
    const [LoadingNewAnno, SetLoadingNewAnno] = loadingann
    const [FirstSelected,SetFirstSelected] = firstsel
    const [SecondSelected,SetSecondSelected] = secondsel
    const [ShowReadOnlyRelation,SetShowReadOnlyRelation] = readonlyrelation
    const [EnableRelationCreation,SetEnableRelationCreation] = enablerelation
    const [NewFactInterno,SetNewFactInterno] = newfactin
    const [Area,SetArea] = useState(null)
    const [Description,SetDescription] = useState(null)
    const [Name,SetName] = useState(null)
    const [Areas,SetAreas] = useState(false)
    const [Url,SetUrl] = useState(null)
    const [UrlName,SetUrlName] = useState(null)
    const [CurAnnotator,SetCurAnnotator] = curannotator
    const [AreaSearch,SetAreaSearch] = useState(null)
    const [UrlSearch,SetUrlSearch] = useState(null)
    const [NameSearch,SetNameSearch] = useState(null)
    const [Profile,SetProfile] = profile
    const [CurrentDiv,SetCurrentDiv] = currentdiv

    const [ColSx,SetColSx] = useState(1)
    const [ColDx,SetColDx] = useState(1)
    const [ColDoc,SetColDoc] = useState(10)


    const [state, setState] = React.useState({
        vertical: 'top',
        horizontal: 'right',
    });

    const { vertical, horizontal } = state;

    useEffect(()=>{
        if(CollectionDocuments){
            SetDisplayDocuments(CollectionDocuments)

        }
    },[CollectionDocuments])



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
                // console.log('request',response)
                SetAnnotators(response.data)
                return response
            }
            fetchAnnotators()

            // GET LABELS OF A DOCUMENT
            // async function fetchLabels(){
            //     const response = await axios.get('get_annotated_labels',{params:{user:CurAnnotator}});
            //     // console.log('request',response)
            //     SetAnnotatedLabels(response.data)
            //     if(LoadingNewAnno){
            //         SetLoadingNewAnno(false)
            //     }
            //     return response
            // }
            // fetchLabels()

        }
    },[DocumentID,CurAnnotator])




    const escFunction = useCallback((event) => {
        // console.log('chiave',event.key)
        if (event.key === "Escape") {
            ClickOnBaseIndex(event,InARel,SetInARel)

        }
    }, []);




    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);


    // const document_comp = useMemo(() => <Document />, [InARel,SourceConcepts]);


    useEffect(()=>{
        if(!InARel){
            SetSourceConcepts(false)
            SetSourceText(false)
            SetSource(false)
            SetPredicateText(false)
            SetPredicateConcepts(false)
            SetPredicate(false)
            SetTargetConcepts(false)
            SetTargetText(false)
            SetTarget(false)
            SetNewRelation(false)

        }
        if(!ShowRels){
            SetShowReadOnlyRelation(false)
            SetModify(false)
        }

    },[InARel,ShowRels])


    useEffect(()=>{
        if(Expand){
            let element = document.getElementById('left-side-bar')
            if(element) {

                element.className = 'active'
            }
            SetShowLabels(false)
            SetShowFacts(false)
            SetShowMentions(false)
            SetShowConcepts(false)
            SetShowRels(false)
        }else {
            let element = document.getElementById('left-side-bar')
            if(element){
                element.classList.remove('active')

            }
        }
    },[Expand])

    useEffect(()=>{
        if(Expand && (ShowSettings || ShowDocs || ShowAutoAnno || ShowDownload || ShowCollections || ShowUpload || ShowStats || ShowMembers || ShowFilter || ShowView) && (!ShowLabels && !ShowMentions && !ShowConcepts && !ShowRels && !ShowFacts)){
            let element = document.getElementById('left-side-bar')
            if(element) {

                element.className = 'active'
            }
        }else{
            let element = document.getElementById('left-side-bar')
            if(element) {

                element.classList.remove('active')
            }
        }
    },[Expand,ShowSettings,ShowDocs,ShowAutoAnno,ShowDownload,ShowUpload,ShowStats,ShowMembers,ShowFilter,ShowView,ShowCollections,ShowLabels,ShowMentions,ShowRels,ShowFacts,ShowConcepts])




    useEffect(()=>{

        if(!Expand && !InARel && !(ShowLabels || ShowMentions || ShowFacts || ShowRels || NewFact || ShowConcepts )){
            SetColDx(1)
            SetColSx(1)
            SetColDoc(10)
        }
        else if(!Expand && (ShowLabels || ShowMentions || ShowFacts || ShowRels || ShowConcepts || NewFact ||  InARel)){
            SetColSx(1)
            SetColDx(3)
            SetColDoc(8)

        }else if(Expand && !InARel) {
            SetColDx(1)
            SetColSx(2)
            SetColDoc(9)
        }else if(InARel){
            SetColSx(1)
            SetColDx(3)
            SetColDoc(8)
        }






    },[Expand,InARel,ShowConcepts,ShowFacts,ShowLabels,NewFact,ShowMentions,ShowRels])

    useEffect(()=>{
        if((ShowLabels || ShowMentions || ShowFacts || ShowRels || ShowConcepts)){
            SetShowStats(false)
            SetShowDocs(false)
            SetShowCollections(false)
            SetShowMembers(false)
            SetShowSettings(false)
            SetShowFilter(false)
            SetShowView(false)
            SetShowDownload(false)
            SetShowUpload(false)
            SetExpand(false);
            SetNewFact(false)
            SetSearchObject(false)
            SetSearchPredicate(false)
            SetSearchSubject(false)
            SetShowAutoAnno(false)

        }




    },[ShowLabels,ShowMentions,ShowFacts,ShowRels,ShowConcepts])

    useEffect(()=>{
        SetShowStats(false)
        SetShowDocs(false)
        SetShowCollections(false)
        SetShowMembers(false)
        SetShowSettings(false)
        SetShowFilter(false)
        SetShowView(false)
        SetShowDownload(false)
        SetShowUpload(false)
        SetExpand(false);
        SetNewFact(false)
        SetShowRels(false)
        SetShowConcepts(false)
        SetShowLabels(false)
        SetShowFacts(false)
        SetShowMentions(false)
        SetSearchObject(false)
        SetSearchPredicate(false)
        SetSearchSubject(false)
        SetShowAutoAnno(false)
        SetInARel(false)


    },[CurAnnotator])

    useEffect(()=>{
        if(NewFact){
            SetShowConcepts(false)
            SetShowMentions(false)
            SetShowLabels(false)
            SetShowRels(false)
            SetShowFacts(false)
            SetNewFactInterno(false)
        }
    },[NewFact])

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        SetOpenSnack(false)
        SetSnackMessage(false);
    };



    useEffect(()=>{
        if(ShowAddConceptModal){
            SetSearchSubject(false)
            SetSearchObject(false)
            SetSearchPredicate(false)
        }
    },[ShowAddConceptModal])

    return (

            <div className="baseindex">
                {OpenSnack && SnackMessage && < div >
                < Snackbar open={OpenSnack && SnackMessage} autoHideDuration={800} onClose={handleCloseSnack}>
                    <Snackbar
                    anchorOrigin={{ vertical, horizontal }}
                    open={OpenSnack && SnackMessage}
                    onClose={handleCloseSnack}
                    message={SnackMessage['message']}
                    key={vertical + horizontal}

                    />
                {/*{SnackMessage && SnackMessage['error'] && <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>*/}
                {/*    {SnackMessage}*/}
                {/*</Alert>}*/}
                {/*{SnackMessage && SnackMessage['success'] && <Alert onClose={handleCloseSnack} severity="danger" sx={{ width: '100%' }}>*/}
                {/*    {SnackMessage}*/}
                {/*</Alert>}*/}
                {/*{SnackMessage && SnackMessage['warning'] && <Alert onClose={handleCloseSnack} severity="info" sx={{ width: '100%' }}>*/}
                {/*    {SnackMessage}*/}
                {/*</Alert>}*/}
                    </Snackbar>

                    </div>}

                <ConceptContext.Provider value={{areaSearch:[AreaSearch,SetAreaSearch],urlSearch:[UrlSearch,SetUrlSearch],nameSearch:[NameSearch,SetNameSearch],searchsubject:[SearchSubject,SetSearchSubject],
                    searchpredicate:[SearchPredicate,SetSearchPredicate],searchobject:[SearchObject,SetSearchObject],sparrow:[SPArrow,SetSPArrow],ptarrow:[PTArrow,SetPTArrow],starrow:[STArrow,SetSTArrow],area:[Area,SetArea],areas:[Areas,SetAreas],name:[Name,SetName],
                    conceptslist:[CollectionConcepts,CollectionConcepts],description:[Description,SetDescription],urlname:[UrlName,SetUrlName],url:[Url,SetUrl],
                    sparrowfloat:[SPArrowFloat,SetSPArrowFloat],ptarrowfloat:[PTArrowFloat,SetPTArrowFloat],starrowfloat:[STArrowFloat,SetSTArrowFloat] }}>

            {ShowAddConceptModal  && <DraggableModal showconceptmodal={ShowAddConceptModal && CurMention} setshowconceptmodal={SetShowAddConceptModal} />}


            <div >

                <Row>
                    {/*<SideBar />*/}
                    {<Col md={ColSx} onClick={(e)=>{

                        DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                    }}>

                    {/*{<Col md={(!ShowLabels && !ShowMentions && !ShowConcepts && !ShowRels && !ShowFacts && !InARel && !NewFact  ) ? 2 : 1}>*/}
                        <div id='left-side-bar-content'>
                            <CSSTransition in={Expand === true} timeout={150} classNames="foo" appear
                                           onEntered={(e) => {
                                               SetClickedSideBut(true)

                                           }}
                                           onExited={(e) => {
                                SetClickedSideBut(false)
                            }}>
                                <>{(!InARel && !ShowLabels && !ShowConcepts && !ShowMentions && !ShowRels && !ShowFacts && !NewFact ) && <div id='left-side-bar'>
                                    {ClickedSideBut && ShowStats && <><SummaryStatsComponent/></>}
                                    {ClickedSideBut && ShowMembers && <><MembersComponent/></>}
                                    {ClickedSideBut && ShowCollections && <><CollectionsComponent/></>}
                                    {ClickedSideBut && ShowDocs && <><ChangeDocumentComppnent displayDocs={DisplayDocuments} setDisplayDocs={SetDisplayDocuments}/></>}
                                    {ClickedSideBut && ShowFilter && <><FilterComponent/></>}
                                    {ClickedSideBut && ShowSettings && <><ChangeSettingsComponent/></>}
                                    {ClickedSideBut && ShowView && <><ChangeViews/></>}
                                    {ClickedSideBut && ShowDownload && <><DownloadDocument/></>}
                                    {ClickedSideBut && ShowUpload && <><UploadDocument/></>}
                                    {ClickedSideBut && ShowAutoAnno && <><AutomaticAnnotation /></>}



                                </div>}



                                    </>

                            </CSSTransition>
                        </div>

                    </Col>}

                    {/*{Expand && <Col md={2}>*/}

                    {/*</Col>}*/}
                    {/*<Col md={Expand ? 7 : 7} className='trans'>*/}
                    {/*<Col md={(ShowMentions || ShowLabels || ShowRels || ShowConcepts) ? 9: 12} className={'trans'}>*/}
                    {/*<ConceptContext.Provider value={{area:[Area,SetArea],areas:[Areas,SetAreas],name:[Name,SetName],*/}
                    {/*    conceptslist:[CollectionConcepts,CollectionConcepts],description:[Description,SetDescription],urlname:[UrlName,SetUrlName],url:[Url,SetUrl]}}>*/}


                    <Col md={ColDoc} >

                    {/*<Paper elevation={2} className='paper'>*/}
                        {(Collection && Collection !== '') ? <div style={{padding: '1%', textAlign: 'justify'}}>
                            <DocumentToolBar key={DisplayDocuments} documentList={DisplayDocuments}/>

                            <Document/>

                            {/*{document_comp}*/}
                        </div> :
                            <div>
                                {((Collection === '' || !Collection) && (CollList && CollList.filter(x=>x.status !== 'Invited').length === 0 )) && <>
                                    <h4>You have not any document to annotate yet. </h4>
                                    <Button href={'/collections'}>Create a new collection.</Button>

                                </>}

                            </div>}
                            {/*</Paper>*/}
                    </Col>
                    <Col md={ColDx} onClick={(e)=>{

                        DeleteRange(SetStart, SetEnd, SetFirstSelected, SetSecondSelected, SetCurrentDiv)
                    }}>

                    {/*<Col md={(InARel || ShowLabels || ShowMentions || ShowConcepts || ShowRels || ShowFacts || NewFact) ? 3 : 2}>*/}
                        {/*<RelSearchContext.Provider value={{}}>*/}

                        <div>
                            <CSSTransition in={ShowLabels || ShowMentions || ShowConcepts || InARel || ShowRels || ShowFacts || NewFact} timeout={100} classNames="fooRight" appear onEntered={(e)=>{
                                SetClickedAnnoBut(true)

                            }} onExited={(e)=>{SetClickedAnnoBut(false)}}><>
                                {
                                <div id='right-side-bar'>

                                    { ClickedAnnoBut && !InARel && ShowLabels &&  <div><LabelsClass/><hr/></div>}
                                    { ClickedAnnoBut && !InARel && ShowMentions && <div><MentionsListClass /><hr/></div>}
                                    { ClickedAnnoBut && !InARel && ShowConcepts && <div><ConceptsListClass /><hr/></div>}
                                    { ClickedAnnoBut && (ShowRels) &&
                                    <div><RelationshipsClass />
                                        <hr/></div>
                                    }
                                    { ClickedAnnoBut && !InARel && ShowFacts && <><AssertionsList /><hr/></>}
                                    {((NewRelation || NewFact)) && <div className={'relation_class'}>
                                        <RelationshipComponent/>
                                    </div>}
                                </div>
                                }

                            </>


                            </CSSTransition>
                        </div>
                    {/*</ RelSearchContext.Provider>*/}


                    </Col>

                    {/*</ConceptContext.Provider>*/}




                </Row>
            </div>


                </ConceptContext.Provider>
        </div>
    );
}

export default BaseIndex;
